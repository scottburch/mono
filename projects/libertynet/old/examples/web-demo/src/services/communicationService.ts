import {ClientOptions, login, Network, newRemoteDbConnector, readUser, searchUsers, signup} from "@libertynet/api";
import {readTextMessagesForUser, storeTextMessage} from "@libertynet/text-message/src/textMessage";
import {bind} from "@react-rxjs/core";
import {BehaviorSubject} from "rxjs";

export interface SignupData {
    username: string;
    password: string;
    password2: string;
    displayName: string;
    profile: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface MsgData {
    title: string,
    body: string
}

const clientSubject = new BehaviorSubject({
    connector: newRemoteDbConnector('http://localhost:3000/json-rpc', Network.DEVNET),
//    connector: newLocalDbConnector(Network.DEVNET),
    username: 'guest',
    password: 'guest'
});

export const getClient = () => clientSubject.getValue();

export const [useClient] = bind(clientSubject.asObservable(), getClient());


export const doSearchUsers = (prefix: string) =>
    searchUsers(getClient(), prefix)

export const doSignup = (data: SignupData) =>
    Promise.resolve(getClient())
        .then(client => signup({...client, username: data.username, password: data.password}, {
            profile: data.profile,
            displayName: data.displayName
        }))
        .then(() => {
            clientSubject.next({
                ...clientSubject.value,
                username: data.username,
                password: data.password
            })
        })
        .then(() => 'Success!!!')

export const readUserInfo = (username: string) =>
    Promise.resolve(getClient())
        .then(client => readUser(client.connector, username));


export const readMessagesForUser = (username: string) =>
    readTextMessagesForUser({...getClient(), username});

export const sendTextMsg = (data: MsgData) =>
    storeTextMessage(getClient(), {
        ...data,
        username: getClient().username,
        time: new Date().toISOString()
    });



export const isLoggedIn = (client: ClientOptions) => client.username && client.username !== 'guest';

export const doLogout = () =>
    clientSubject.next({
        ...clientSubject.getValue(),
        username: 'guest'
    });

export const doLogin = (data: LoginData) => login({
    ...clientSubject.getValue(),
    ...data
})
    .then(() => clientSubject.next({
        ...clientSubject.getValue(),
        ...data
    }))
    .then(() => 'Success!!!')

