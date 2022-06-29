import {newClient, newLocalDbConnector} from "@libertynet/api";
import {passThroughAwait} from "promise-passthrough";
import {readTextMessagesForUser, storeTextMessage} from "./textMessage";
import {expect} from "chai";

describe('text message', () => {
    it('should add a text message for a user', () => {
        const username = Date.now().toString();
            Promise.resolve(newClient({
                username,
                connector: newLocalDbConnector(),
                password: 'my-password'
            }))
                .then(passThroughAwait(client => storeTextMessage(client, {
                    username,
                    title: 'my-title1',
                    body: 'my-body1',
                    time: new Date().toUTCString()
                })))
                .then(passThroughAwait(client => storeTextMessage(client, {
                    username,
                    title: 'my-title2',
                    body: 'my-body2',
                    time: new Date().toUTCString()
                })))
                .then(passThroughAwait(client => storeTextMessage(client, {
                    username,
                    title: 'my-title3',
                    body: 'my-body3',
                    time: new Date().toUTCString()
                })))
                .then(client => readTextMessagesForUser(client))
                .then(results => {
                    expect(results).to.have.length(3)
                    expect(results[0].title).to.equal("my-title3")
                    expect(results[1].title).to.equal("my-title2")
                    expect(results[2].title).to.equal("my-title1")
                })
        });
});