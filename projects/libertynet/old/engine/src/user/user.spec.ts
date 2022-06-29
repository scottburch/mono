import {withCtxAwait} from "@scottburch/with-context";
import {doesUserExist, readUser, storeUser} from "./user";
import {passThroughAwait} from "promise-passthrough";
import {expect} from "chai";
import {UserPayload} from "../payloadType/UserPayload";
import {newLocalDbConnector} from "../dag/newLocalDbConnector";

describe('user dag client', function () {
    this.timeout(40_000);

    it('should be able to store and retrieve a user', () => {
        const connector = newLocalDbConnector();
        return Promise.resolve(Date.now().toString())
            .then(username => ({username}))
            .then(ctx => ({
                ...ctx, user: UserPayload.fromObject({
                    username: ctx.username,
                    profile: 'my-profile',
                    displayName: ''
                })
            }))
            .then(passThroughAwait(ctx => storeUser(connector, ctx.user, 'password')))

            .then(withCtxAwait('user', ctx => readUser(connector, ctx.username)))
            .then(ctx => {
                expect((ctx.user).username).to.equal(ctx.username);
                expect((ctx.user).profile).to.equal('my-profile');
            })
    });


    it('should always return the correct user by checking the public key of the oldest user', () => {
        const connector = newLocalDbConnector();
        return Promise.resolve({username: Date.now().toString()})
            .then(withCtxAwait('user1', ctx => Promise.resolve(UserPayload.fromObject({
                username: ctx.username,
                displayName: '',
                profile: 'first',
            }))))
            .then(withCtxAwait('user2', ctx => Promise.resolve(UserPayload.fromObject({
                username: ctx.username,
                displayName: '',
                profile: 'updated profile',
            }))))
            .then(withCtxAwait('user3', ctx => Promise.resolve(UserPayload.fromObject({
                username: ctx.username,
                displayName: '',
                profile: 'bad user',
            }))))
            .then(withCtxAwait('user1Resp', ctx => storeUser(connector, ctx.user1, 'password')))
            .then(passThroughAwait(ctx => newLocalDbConnector().waitUntilNodeIncluded(newLocalDbConnector(), ctx.user1Resp)))
            .then(withCtxAwait('user2Resp', ctx => storeUser(connector, ctx.user2, 'password')))
            .then(passThroughAwait(ctx => newLocalDbConnector().waitUntilNodeIncluded(newLocalDbConnector(), ctx.user2Resp)))
            .then(withCtxAwait('user3Resp', ctx => storeUser(connector, ctx.user3, 'diff-password')))
            .then(passThroughAwait(ctx => newLocalDbConnector().waitUntilNodeIncluded(newLocalDbConnector(), ctx.user3Resp)))
            .then(ctx => readUser(connector, ctx.username))
            .then(user => {
                expect(user?.profile).to.equal('updated profile');
            })
    });

    it('should return undefined if we try to read a user that does not exist', () =>
        readUser(newLocalDbConnector(), 'user-does-not-exist')
            .then(user => expect(user).to.be.undefined)
    );

    it('should be able to check if user already exists', () =>
        Promise.resolve(Date.now().toString())
            .then(username => doesUserExist(newLocalDbConnector(), username))
            .then(exists => expect(exists).to.be.false)

            .then(() => ({username: Date.now().toString()}))
            .then(ctx => ({...ctx, user: UserPayload.fromObject({
                    username: ctx.username,
                    profile: '',
                    displayName: ''
                })}))
            .then(passThroughAwait(ctx => storeUser(newLocalDbConnector(), ctx.user, 'password')))
            .then(ctx => doesUserExist(newLocalDbConnector(), ctx.username))
            .then(exists => expect(exists).to.be.true)
    );
});