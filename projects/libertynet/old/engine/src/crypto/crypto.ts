import {BNInput, ec, ec as EC} from "elliptic";
import {Some} from "monet";
import {padEnd} from "lodash/fp";
import {withCtxAwait} from "@scottburch/with-context";
import {SignedObj} from "./signed-obj.pb";
import {PayloadType} from "../payloadType/PayloadType";
import {UserPayload} from "../payloadType/UserPayload";
import {readSignedUser} from "../user/user";
import {DbConnector} from "../dag/DbConnector";


export const getKeyPair = (username: string, password: string): Promise<ec.KeyPair> =>
    Some(username + password)
        .map(padEnd(32))
        .map(pass => new TextEncoder().encode(pass))
        .map(entropy => new EC('secp256k1').genKeyPair({entropy}))
        .map(keypair => Promise.resolve(keypair))
        .join();

export const getPublicKey = (username: string, password: string): Promise<string> =>
    getKeyPair(username, password)
        .then(kp => kp.getPublic('hex'))


export const sign = (username: string, password: string, data: BNInput) =>
    getKeyPair(username, password)
        .then(ec => ec.sign(data).toDER('hex'))

export const verify = (pubKey: string, data: BNInput, sig: string) =>
    Promise.resolve(new EC('secp256k1'))
        .then(ec => ec.verify(data, sig, Buffer.from(pubKey, 'hex')));


export const isMyUser = (signedUser: SignedObj, password: string): Promise<boolean> =>
    getKeyPair(UserPayload.fromSignedObj(signedUser).username, password)
        .then(kp => ({
            kp,
            user: UserPayload.fromSignedObj(signedUser)
        }))
        .then(ctx => ({
            ...ctx,
            json: JSON.stringify(ctx.user)
        }))
        .then(ctx => ctx.kp.verify(ctx.json, signedUser.signature));

export const signStoredObj = <T, I>(type: PayloadType<T>, username: string, password: string, owner: string, obj: T): Promise<SignedObj> =>
    Promise.resolve({obj})
        .then(withCtxAwait('signature', ctx => sign(username, password, type.getSignString(ctx.obj))))
        .then(withCtxAwait('pubKey', () => getPublicKey(username, password)))
        .then(ctx => SignedObj.create({
            owner,
            signature: ctx.signature,
            pubKey: ctx.pubKey,
            payload: {
                type_url: type.getTypeUrl(),
                value: type.encoder(ctx.obj)
            }
        })
);


export const verifySignedObjSignature = <T, I>(payloadType: PayloadType<T>, obj: SignedObj): Promise<boolean> =>
    obj.payload ? (
        Promise.resolve(payloadType.fromSignedObj(obj))
            .then(obj => payloadType.getSignString(obj))
            .then(string => new EC('secp256k1').keyFromPublic(obj.pubKey, 'hex').verify(string, obj.signature))
    ) : Promise.resolve(false);


export const validateOwner = <T, I>(connector: DbConnector, username: string, type: PayloadType<T>, signedObj: SignedObj): Promise<boolean> =>
    readSignedUser(connector, username)
        .then(signedUser =>  new EC('secp256k1').keyFromPublic(signedUser?.pubKey || '', 'hex'))
        .then(ec => ({
            ec,
            content: type.getSignString(type.fromSignedObj(signedObj))
        }))
        .then(ctx => ctx.ec.verify(ctx.content, signedObj.signature))

