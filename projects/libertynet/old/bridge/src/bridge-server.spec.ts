import {newRemoteDbConnector} from "@libertynet/engine";
import {newClient, signup} from "@libertynet/api";
import {passThroughAwait} from "promise-passthrough";
import {doesUsernameExist} from "@libertynet/api/src/client";
import chai,{expect} from "chai";
import waitUntil from "async-wait-until";
import asPromised from 'chai-as-promised'

chai.use(asPromised)

describe('rpc-bridge', () => {
    it('should store a signed object', () =>
        getClient()
            .then(passThroughAwait(client => expect(doesUsernameExist(client)).to.eventually.be.false))
            .then(passThroughAwait(client=> signup(client, {displayName: 'me', profile: ''})))
            .then(client =>
                waitUntil(() =>
                    doesUsernameExist(client), {timeout: 20_000, intervalBetweenAttempts: 2_000}
                )
            )
    );
});



const getClient = () => Promise.resolve(Date.now().toString())
    .then(username => newClient({
            username: username,
            password: 'my-pass',
            connector: newRemoteDbConnector('http://localhost:3000/json-rpc')
        })
);