import {SignedObj} from "../crypto/signed-obj.pb";
import {IMessageMetadata} from "@iota/iota.js";
import {DbConnector, NodeId} from "./DbConnector";
import { JSONRPCClient } from "json-rpc-2.0";
import {map} from "lodash/fp";
import {Buffer} from 'buffer'
import {SearchSignedObjectsOptions} from "./dag-client";



export const newRemoteDbConnector = (url: string): DbConnector => ({
    readSignedObjectsSorted: (connector: DbConnector, keys: string[]): Promise<SignedObj[]> =>
        getRpcClient(url).request('readSignedObjectsSorted', {connector, keys})
            .then(map((obj: string) => SignedObj.decode(Buffer.from(obj, 'base64')))) as Promise<SignedObj[]>,

    storeSignedObject: (connector: DbConnector, keys: string[], obj: SignedObj): Promise<NodeId> =>
        getRpcClient(url).request('storeSignedObject', {connector, keys, obj: Buffer.from(SignedObj.encode(obj).finish()).toString('base64')}) as Promise<NodeId>,

    waitUntilNodeIncluded: (connector: DbConnector, nodeId: string, timeout?: number): Promise<IMessageMetadata> =>
        getRpcClient(url).request('waitUntilNodeIncluded', {connector, nodeId, timeout}) as Promise<IMessageMetadata>,

    searchSignedObjs: (connector: DbConnector, keys: string[], options: SearchSignedObjectsOptions): Promise<SignedObj[]> =>
        getRpcClient(url).request('searchSignedObjs', {connector, keys, options})
            .then(map((obj: string) => SignedObj.decode(Buffer.from(obj, 'base64')))) as Promise<SignedObj[]>
});


const getRpcClient = (url: string): JSONRPCClient => {
    const client: JSONRPCClient = new JSONRPCClient((jsonRPCRequest) =>
        fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(jsonRPCRequest),
        }).then((response) => {
            if (response.status === 200) {
                // Use client.receive when you received a JSON-RPC response.
                return response
                    .json()
                    .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
            } else if (jsonRPCRequest.id !== undefined) {
                return Promise.reject(new Error(response.statusText));
            }
        })
    );

    return client

}
