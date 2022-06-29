import {expect} from "chai";
import {newLocalDbConnector} from '../../engine/src/dag/newLocalDbConnector'
import {UserPayload} from '../../engine/src/payloadType/UserPayload'
import {storeUser, readUser} from '../../engine/src/user/user'
import {startSwarm, stopSwarm, Swarm} from "../src/swarm-utils";

describe('dev tests', function() {
    this.timeout(60_000)
    let swarm: Swarm

    beforeEach(() => startSwarm().then(s => swarm = s))
    afterEach(() => stopSwarm(swarm));

    it('should write a user', () => {
        const connector = newLocalDbConnector();
        return Promise.resolve('my-test-user')
            .then(username => ({username}))
            .then(ctx => ({
                ...ctx, user: UserPayload.fromObject({
                    username: ctx.username,
                    profile: 'my-profile',
                    displayName: ''
                })
            }))
            .then(ctx => storeUser(connector, ctx.user, 'password'))
            .then(() => readUser(connector, 'my-test-user'))
            .then(user => {
                expect(user?.profile).to.equal('my-profile');
            })
    });
});



