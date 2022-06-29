import {getKeyPair, sign, isMyUser, verify, signStoredObj, verifySignedObjSignature, validateOwner} from "./crypto";
import {expect} from "chai";
import {passThroughAwait} from "promise-passthrough";
import {withCtxAwait} from "@scottburch/with-context";
import {UserPayload} from "../payloadType/UserPayload";
import {PayloadType} from "../payloadType/PayloadType";
import {storeUser} from "../user/user";
import {newLocalDbConnector} from "../dag/newLocalDbConnector";

describe('crypto', function() {
    this.timeout(30_000);

    it('should be able to sign some data', () =>
        sign('username', 'testing', 'some-data')
            .then(sig => expect(sig).to.equal('30450220284b60209fd7a2bd0acb0e27449d421737fddc7efa643936d4d135890c78cdc9022100cbb9fa47dd5fe80b63bc2efdc9063c19a6075a1a2914d920b237c955797ef18c'))
    );

    it('should be able to validate a signature', () =>
        getKeyPair('username', 'testing')
            .then(ec => ec.getPublic('hex'))
            .then(pubKey => verify(pubKey, 'some-data', '30450220284b60209fd7a2bd0acb0e27449d421737fddc7efa643936d4d135890c78cdc9022100cbb9fa47dd5fe80b63bc2efdc9063c19a6075a1a2914d920b237c955797ef18c'))
            .then(result => expect(result).to.be.true)
    );

    it('should be able to sign a user', () =>
        Promise.resolve(UserPayload.fromObject({
            username: 'my-username',
            displayName: '',
            profile: 'my-profile'
        }))
            .then(user => signStoredObj(UserPayload,'username', 'password', user.username, user))
            .then(signObj => {
                expect(signObj.signature).to.equal('3046022100fcb4aa82db3a14ce98458c2bb93e15816c331130f136a9d369dcc82412dbca6f022100ea3b6b385438652ec262598a2feda8cabd9c010b6cd6b09fabb9b4e3606398d8');
                expect(signObj.pubKey).to.equal('04ff9ddd09c1e3bcdcbb3ba0dbbaa6bb5823c301df932edeb74138e80adb52b6c48214d90b8e9363ed1d1531fe62151eae49c26c48f3a5fd89e0a05be7e179693d');
            })
    )

    it('should be able to check if a user is yours', () =>
        Promise.resolve(UserPayload.fromObject({
            username: 'my-username',
            displayName: '',
            profile: '',
        }))
            .then(withCtxAwait('signedUser', user => signStoredObj(UserPayload, 'my-username', 'password', user.username, user)))
            .then(passThroughAwait(ctx => isMyUser(ctx.signedUser, 'password')
                .then(isMine => expect(isMine).to.be.true)
            ))
            .then(passThroughAwait(ctx => isMyUser(ctx.signedUser, 'wrong')
                .then(isMine => expect(isMine).to.be.false)
            ))
    );

    it('should be able to verify an object signature', () =>
        Promise.resolve(UserPayload.fromObject({
            username: 'my-username',
            displayName: 'my-display-name',
            profile: 'my-profile',
        }))
            .then(user => signStoredObj(UserPayload, 'username', 'password', user.username, user))
            .then(signedUser => verifySignedObjSignature(UserPayload, signedUser))
            .then(isValid => expect(isValid).to.be.true)
    );

    it('should verify a signed object against a owner', () => {
        const username = Date.now().toString();
        const connector = newLocalDbConnector();
        return Promise.resolve(UserPayload.fromObject({
            username: username,
            displayName: '',
            profile: ''
        }))
            .then(user => storeUser( connector, user, 'password'))
            .then(() => signStoredObj(FakePayload, username, 'password', username, {foo: 'my-payload'}))
            .then(signedObj => validateOwner(connector, username, FakePayload, signedObj))
            .then(valid => expect(valid).to.be.true)

            .then(() => signStoredObj(FakePayload, username, 'fake-pass', username, {foo: 'my-payload'}))
            .then(signedObj => validateOwner(connector, username, FakePayload, signedObj))
            .then(valid => expect(valid).to.be.false)
    });
});

const FakePayload: PayloadType<{foo:string}> = {
    fromObject: (obj) => obj,
    fromSignedObj: (obj) => ({foo: new TextDecoder().decode(obj.payload?.value?.buffer)}),
    getSignString: (obj) => obj.foo,
    getTypeUrl: () => 'fake',
    encoder: x => new TextEncoder().encode(x.foo)
}