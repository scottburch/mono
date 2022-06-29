import {IIndexationPayload, IMessage, IMessageMetadata, INDEXATION_PAYLOAD_TYPE, SingleNodeClient} from "@iota/iota.js";
import {withCtxAwait} from "@scottburch/with-context";
import {Converter} from "@iota/util.js";
import waitUntil from "async-wait-until";
import {passThroughAwait} from "promise-passthrough";
import {SignedObj} from "../crypto/signed-obj.pb";
import {filter, map, sortBy} from "lodash/fp";
import {flatten, last} from "lodash";
import {Buffer} from 'buffer'
import {DbConnector, NodeId} from "./DbConnector";


const NodeUrl = 'http://localhost:14265';


export const createRadixPath = (keys: string[]) =>
    keys.join(':')
        .split('')
        .reduce((words: string[], char, idx) => {
            words[idx] = words.length > 0 ? words[idx - 1] + char : char;
            return words;
        }, [])
        .slice(0, -1);


export const decodeSignedObject = (node: IMessage) =>
    SignedObj.decode(Buffer.from((node.payload as IIndexationPayload).data || '', 'hex'))

export const storeSignedObject = (connector: DbConnector, keys: string[], obj: SignedObj): Promise<NodeId> => {
    return Promise.all([
        writeRadixPath(connector, keys),
        writeNode(connector, keys, SignedObj.encode(obj).finish())
    ]).then(x => x[1]);


    function writeRadixPath(connector: DbConnector, keys: string[]) {
        return Promise.all(
            createRadixPath(keys)
                .map(path =>
                    doesNodeExist(connector, [path])
                        .then(exists => exists ? undefined : writeNode(connector, [path], new Uint8Array())
                            .then(nodeId => waitUntilNodeIncluded(connector, nodeId)))
                )
        )
    }

    function writeNode(connector: DbConnector, keys: string[], data: Uint8Array) {
        return Promise.resolve({
            client: new SingleNodeClient(NodeUrl),
            data: data
        })
            .then(withCtxAwait('tips', ctx => ctx.client.tips()))
            .then(withCtxAwait('msgId', ctx => ctx.client.messageSubmit({
                // Parents can be left undefined if you want the node to populate the field
                parentMessageIds: ctx.tips.tipMessageIds.slice(0, 2),
                payload: {
                    type: INDEXATION_PAYLOAD_TYPE,
                    index: Converter.utf8ToHex(makeMetaKey(connector, keys)),
                    data: Buffer.from(ctx.data).toString('hex')
                }
            })))
            .then(passThroughAwait(ctx => waitUntilNodeIncluded(connector, ctx.msgId)))
            .then(ctx => (ctx.msgId));
    }
}

const makeMetaKey = (connector: DbConnector, keys: string[]) => keys.join(':');

export const waitUntilNodeIncluded = (connector: DbConnector, nodeId: string, timeout: number = 30_000): Promise<IMessageMetadata> => {
    let lastMeta: IMessageMetadata;
    return Promise.resolve(new SingleNodeClient(NodeUrl))
        .then(client => waitUntil(() =>
                client.messageMetadata(nodeId)
                    .then(passThroughAwait(meta => lastMeta = meta))
                    .then(meta => !!meta.referencedByMilestoneIndex)
                    .catch(() => {
                    }) // catch error for now if the message is not found
            , {timeout, intervalBetweenAttempts: 1_000}))
        .then(() => lastMeta)
}

export const doesNodeExist = (connector: DbConnector, keys: string[]): Promise<boolean> =>
    readNodeIds(connector, keys).then(ids => !!ids.length);

export const readNodeIds = (connector: DbConnector, keys: string[]): Promise<string[]> =>
    Promise.resolve({
        client: new SingleNodeClient(NodeUrl)
    })
        .then(withCtxAwait('messages', ctx => ctx.client.messagesFind(makeMetaKey(connector, keys))))
        .then(ctx => ctx.messages.messageIds)

export const readNodes = <T extends object>(connector: DbConnector, keys: string[]): Promise<SignedObj[]> =>
    readNodeIds(connector, keys)
        .then(msgIds => ({
            msgIds,
            client: new SingleNodeClient(NodeUrl)
        }))
        .then(ctx => Promise.all(ctx.msgIds.map(msgId => ctx.client.message(msgId))))
        .then(msgs => msgs.map(decodeSignedObject));


export const readSignedObjectsWithMeta = (connector: DbConnector, keys: string[]) =>
    readNodeIds(connector, keys)
        .then(msgIds => ({msgIds, client: new SingleNodeClient(NodeUrl)}))
        .then(withCtxAwait('metas', ctx => Promise.all(ctx.msgIds.map(msgId => ctx.client.messageMetadata(msgId).then(meta => ({meta}))))))
        .then(withCtxAwait('msgs', ctx => Promise.all(ctx.metas.map(meta => ctx.client.message(meta.meta.messageId).then(m => ({
            ...meta,
            msg: m
        }))))))
        .then(withCtxAwait('signedObjects', ctx => Promise.resolve(ctx.msgs.map(msg => ({
            meta: msg.meta,
            signedObj: decodeSignedObject(msg.msg)
        })))));

export const readSignedObjectsSorted = (connector: DbConnector, keys: string[]) =>
    readSignedObjectsWithMeta(connector, keys)
        .then(ctx => ctx.signedObjects)
        .then(sortBy<unknown>('meta.referencedByMilestoneIndex'))
        .then(map(it => (it as { signedObj: SignedObj }).signedObj as SignedObj))


export const readNewestSignedObject = (connector: DbConnector, keys: string[]): Promise<SignedObj | undefined> =>
    readSignedObjectsSorted(connector, keys)
        .then(results => results.reduce((out, it) => {
            return it.signature ? it : out
        }, results[0]))

// TODO: this function returns sorted results, but favours shorter over longer.  the order is by length of the word
// rather than purely alphanumeric

export interface SearchSignedObjectsOptions {
    limit?: number
    keySet?: string[]
}

export const searchSignedObjs = (connector: DbConnector, keys: string[], options: SearchSignedObjectsOptions = {}): Promise<SignedObj[]> => {
    const limit = options.limit || 100;
    const keySet = options.keySet || KeySet.reverseAlphaNumeric
    const prefix = keys.slice(0, -1);
    const lastKey = last(keys) || '';
    let count = 0;

    return (function loop(key: string): Promise<SignedObj[]> {
        return readNewestSignedObject(connector, [...prefix, key])
            .then(existing => existing && count < limit ? (
                Promise.all(keySet.map(char => loop(key + char)))
                    .then(flatten)
                    .then(filter(o => !!o.signature))
                    .then(results => results.concat(existing.signature ? [existing] : []))
            ) : (
                Promise.resolve([])
            ))
            .then(passThroughAwait(results => count += results.length))
    }(lastKey));
}

const ALPHA_NUMERIC_KEY_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const NUMERIC_KEY_CHARS = '0123456789';

export const KeySet = {
    reverseAlphaNumeric: ALPHA_NUMERIC_KEY_CHARS.split('').reverse(),
    alphaNumeric: ALPHA_NUMERIC_KEY_CHARS.split(''),
    numeric: NUMERIC_KEY_CHARS.split(''),
    reverseNumeric: NUMERIC_KEY_CHARS.split('').reverse()
};



