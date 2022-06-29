import {SignedObj} from "../crypto/signed-obj.pb";
import {IMessageMetadata} from "@iota/iota.js";
import {SearchSignedObjectsOptions} from "./dag-client";

export type NodeId = string;

export interface DbConnector {
    readSignedObjectsSorted(connector: DbConnector, keys: string[]): Promise<SignedObj[]>,
    storeSignedObject(connector: DbConnector, keys: string[], obj: SignedObj): Promise<NodeId>
    waitUntilNodeIncluded(connector: DbConnector, nodeId: string, timeout?: number): Promise<IMessageMetadata>
    searchSignedObjs(connector: DbConnector, keys: string[], options?: SearchSignedObjectsOptions): Promise<SignedObj[]>
}


