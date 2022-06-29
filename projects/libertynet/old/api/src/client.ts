import {Either, Left, Right} from "monet";
import {
    isMyUser,
    readSignedUser,
    storeUser,
    User,
    readUser as engineReadUser,
    UserPayload,
    signStoredObj, PayloadType
} from "@libertynet/engine";
import {map} from "lodash/fp";
import {DbConnector} from "@libertynet/engine/src/dag/DbConnector";

export interface ClientOptions {
    username: string;
    password: string;
    connector: DbConnector;
}

export interface UserProfile {
    displayName: string
    profile: string
}

export const newClient = (options: ClientOptions) =>
    Right(options)
        .flatMap(options => validateUsername(options))
        .cata(e => {
            throw e
        }, c => c)

const validateUsername = (options: ClientOptions): Either<string, ClientOptions> =>
    Right<string, ClientOptions>(options)
        .flatMap(o => o.username.length > 0 ? Right<string, ClientOptions>(o) : Left<string, ClientOptions>('username-too-short'))
        .flatMap(o => o.username.length <= 15 ? Right<string, ClientOptions>(o) : Left<string, ClientOptions>('username-too-long'))
        .flatMap(n => /^[a-zA-Z0-9]*$/.test(n.username) ? Right(n) : Left('username-invalid'))

export const login = (client: ClientOptions): Promise<boolean> =>
    readSignedUser(client.connector, client.username)
        .then(user => user ? user : throwIt('invalid-username'))
        .then(user => isMyUser(user, client.password))
        .then(success => success ? true : throwIt('invalid-password')) as Promise<boolean>


export const signup = (client: ClientOptions, profile: UserProfile): Promise<unknown> =>
    doesUsernameExist(client, client.username)
        .then(exists => exists ? throwIt('username-already-exists') : client)
        .then(client => storeUser(client.connector, UserPayload.fromObject({username: client.username, ...profile}), client.password));


export const doesUsernameExist = (client: ClientOptions, username?: string): Promise<boolean> =>
    readSignedUser(client.connector, username || client.username)
        .then(user => !!user)

export const readUser = (client: ClientOptions, username?: string): Promise<User | undefined> =>
    engineReadUser(client.connector, username || client.username);

export const updateProfile = (client: ClientOptions, profile: UserProfile): Promise<unknown> =>
    storeUser(client.connector, UserPayload.fromObject({username: client.username, ...profile}), client.password)

export const searchUsers = (client: ClientOptions, prefix: string): Promise<User[]> =>
    searchObjects({
        client,
        payloadType: UserPayload,
        keys: [prefix]
    });

export interface SearchObjectsParams<T> {
    client: ClientOptions,
    payloadType: PayloadType<T>,
    keys: string[]
}

export const searchObjects = <T>(params: SearchObjectsParams<T>) =>
    params.client.connector.searchSignedObjs(params.client.connector, params.keys)
        .then(map(params.payloadType.fromSignedObj));


export interface StoreObjectParams<T> {
    client: ClientOptions;
    payloadType: PayloadType<T>,
    keys: string[],
    value: T
}

export const storeObject = <T, I>(params: StoreObjectParams<T>) =>
    signStoredObj(params.payloadType, params.client.username, params.client.password, params.client.username, params.value)
        .then(obj => params.client.connector.storeSignedObject(params.client.connector, params.keys, obj));


const throwIt = (message: string) => {
    throw message
};