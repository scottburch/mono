import {curry, filter, identity} from "lodash/fp";
import {signStoredObj, verifySignedObjSignature} from "../crypto/crypto";
import {DbConnector, NodeId} from "../dag/DbConnector";
import {User} from "./user.pb";
import {UserPayload} from "../payloadType/UserPayload";
import {last} from "lodash";
import {SignedObj} from "../crypto/signed-obj.pb";

export const storeUser = curry((connector: DbConnector, user: User, password: string): Promise<NodeId> =>
    signStoredObj(UserPayload, user.username, password, user.username, user)
        .then(signedObj =>
            connector.storeSignedObject(connector, [user.username], signedObj)));


export const readSignedUser = (connector: DbConnector, username: string): Promise<SignedObj | undefined> =>
    connector.readSignedObjectsSorted(connector, [username])
        .then(signedUsers => signedUsers.filter(user => user.pubKey === signedUsers[0].pubKey))
        .then(signedUsers => Promise.all(signedUsers.map(signedUser =>
            verifySignedObjSignature(UserPayload, signedUser)
                .then(isValid => isValid ? signedUser : undefined)
        )))
        .then(filter(identity))
        .then(last);

export const readUser = (connector: DbConnector, username: string): Promise<User | undefined> =>
    readSignedUser(connector, username)
        .then(signedObj => signedObj ? UserPayload.fromSignedObj(signedObj) : undefined);

export const doesUserExist = (connector: DbConnector, username: string): Promise<boolean> =>
    readUser(connector, username)
        .then(user => !!user);

