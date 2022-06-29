import {
    ClientOptions,
    doesUsernameExist,
    login,
    newClient,
    readUser, searchObjects,
    searchUsers,
    signup, storeObject,
    updateProfile
} from "./client";
import chai, {expect} from "chai";
import {newLocalDbConnector, PayloadType} from "@libertynet/engine";
import {passThroughAwait} from "promise-passthrough";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

const getConnector = () => newLocalDbConnector();

describe('client', () => {
    it('should validate the username', () => {
        expect(() => newClient({
            username: 'wrong-chars'
        } as ClientOptions)).to.throw('username-invalid');

        expect(() => newClient({
            username: 'username-too-long'
        } as ClientOptions)).to.throw('username-too-long')

        expect(() => newClient({
            username: ''
        } as ClientOptions)).to.throw('username-too-short')
    });

    it('should be able to login', () => {
        return Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            }))
            .then(passThroughAwait(client => signup(client, {profile: '', displayName: ''})))
            .then(passThroughAwait(client =>
                login(client)
                    .then(success => expect(success).to.be.true)
            ));
    });

    it('should fail login if user does not exist', () => {
        return Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            })
        )
            .then(client => expect(login(client)).to.be.rejectedWith('invalid-username'))
    });

    it('should fail login if the password is not correct', () => {
        return Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            }))
            .then(passThroughAwait(client => signup(client, {profile: '', displayName: ''})))
            .then(passThroughAwait(client =>
                login(client)
                    .then(success => expect(success).to.be.true)
            ))
            .then(client => expect(login({...client, password: 'wrong'})).to.be.rejectedWith('invalid-password'))
    });

    it('should be able to check if a username already exists', () => {
        return Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            })
        )
            .then(passThroughAwait(client => doesUsernameExist(client, client.username)
                .then(exist => expect(exist).to.be.false)))
            .then(passThroughAwait(client => signup(client, {displayName: 'my-name', profile: 'my-profile'})))
            .then(client => doesUsernameExist(client, client.username))
            .then(exists => expect(exists).to.be.true);
    });

    it('should be able to update a user profile', () => {
        return Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            })
        )
            .then(passThroughAwait(client => signup(client, {displayName: 'my-name', profile: 'my-profile'})))
            .then(passThroughAwait(client => readUser(client)
                .then(user => {
                    expect(user?.displayName).to.equal('my-name');
                    expect(user?.profile).to.equal('my-profile');
                })
            ))

            .then(passThroughAwait(client => updateProfile(client, {displayName: 'updated-my-name', profile: 'updated-my-profile'})))
            .then(client => readUser(client))
            .then(user => {
                expect(user?.displayName).to.equal('updated-my-name');
                expect(user?.profile).to.equal('updated-my-profile');
            })
    });

    it('should be able to search for objects', () =>
        Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            })
        )
            .then(passThroughAwait(client => storeObject({
                client,
                payloadType: TestObjectPayload,
                keys: ['type','key1'],
                value: 'my-test-string1'
            })))
            .then(passThroughAwait(client => storeObject({
                client,
                payloadType: TestObjectPayload,
                keys: ['type', 'key2'],
                value: 'my-test-string2'
            })))
            .then(client => searchObjects({
                client,
                payloadType: TestObjectPayload,
                keys: ['type','key']
            }))
            .then(results => expect(results).to.deep.equal(['my-test-string2', 'my-test-string1']))

    );

    it('should be able to list users', () =>
        Promise.resolve(
            newClient({
                username: 'myusername',
                password: 'my-password',
                connector: getConnector()
            })
        )
            .then(passThroughAwait(client => Promise.all(['auser1', 'auser2', 'buser1', 'cuser1'].map(username =>
                signup({...client, username}, {displayName: username, profile: username})
            ))))

            // .then(passThroughAwait(client =>
            //     searchUsers(client, '')
            //         .then(users => {
            //             expect(users).to.have.length(4);
            //             expect(users[3].username).to.equal('auser1');
            //             expect(users[2].username).to.equal('auser2');
            //             expect(users[1].username).to.equal('buser1');
            //             expect(users[0].username).to.equal('cuser1');
            //         })
            // ))

            .then(passThroughAwait(client =>
                searchUsers(client, 'a')
                    .then(users => {
                        expect(users).to.have.length(2);
                        expect(users[0].username).to.equal('auser2');
                        expect(users[1].username).to.equal('auser1');
                    })
            ))

            .then(passThroughAwait(client =>
                searchUsers(client, 'b')
                    .then(users => {
                        expect(users).to.have.length(1);
                        expect(users[0].username).to.equal('buser1');
                    })
            ))

            .then(passThroughAwait(client =>
                searchUsers(client, 'buser1')
                    .then(users => {
                        expect(users).to.have.length(1);
                        expect(users[0].username).to.equal('buser1');
                    })
            ))

            .then(passThroughAwait(client =>
                searchUsers(client, 'fake')
                    .then(users => expect(users).to.deep.equal([]))
            ))
    );
});

const TestObjectPayload: PayloadType<string> = {
    fromObject: () => 'myObj',
    getTypeUrl: () => 'test',
    fromSignedObj: (signedObj => new TextDecoder().decode(signedObj.payload?.value as BufferSource | undefined)),
    encoder: (value: string) => new TextEncoder().encode(value),
    getSignString: value => value,
}

