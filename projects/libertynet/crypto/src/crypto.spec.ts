import {
    createPrivateKey,
    decodeSignedObj,
    encodeSignedObj,
    getPublicKey, NewValidSignedObjMsg, SendSignedObjMessageAction,
    signData,
    verifySig,
    verifySignedObj
} from "./crypto";
import {map, of, switchMap, tap, withLatestFrom, from, first, filter} from "rxjs";
import {expect} from "chai";
import {eventListener, sendEvent} from "@scottburch/rxjs-msg-bus";
import {startSwarm, stopSwarm, Swarm} from '@libertynet/test/src/swarm-utils'
import {AppStartMsg, AppStopMsg, DisableLogCentralBusMsg, EnableLogCentralBusMsg} from '@libertynet/app'
import '@libertynet/iota-connector'
import '@libertynet/accounts'
import './crypto'



describe('crypto', () => {
    beforeEach(() => sendEvent<EnableLogCentralBusMsg>('enable-log-central-bus'));
    afterEach(() => sendEvent<DisableLogCentralBusMsg>('disable-log-central-bus'));

    it('should create a signed object from a username and password', (done) => {
        of({
            username: 'my-name',
            password: 'my-password',
            data: new TextEncoder().encode('my-data'),
            typeUrl: 'test-data'
        }).pipe(
            encodeSignedObj(),
            decodeSignedObj(),
            tap(signedObj => {
                expect(signedObj.version).to.equal(1);
                expect(signedObj.payload[0].data?.typeUrl).to.equal('test-data');
                expect(signedObj.owner).to.contain('liberty');
                expect(signedObj.payload[0].data?.value.toString()).to.equal('my-data');
            }),
            tap(() => done())
        ).subscribe()
    });

    it('should verify a signed object true with a good public key', (done) => {
        of({
            username: 'my-name',
            password: 'my-password',
            data: new TextEncoder().encode('my-data'),
            typeUrl: 'test-data'
        }).pipe(
            encodeSignedObj(),
            decodeSignedObj(),
            map(signedObj => ({signedObj, pubKey: signedObj.pubKey})),
            verifySignedObj(),
            tap(result => expect(result.isValid).to.be.true)

        ).subscribe(() => done());
    });

    it('should fail to verify a signed object with  bad data', (done) => {
        of({
            username: 'my-name',
            password: 'my-password',
            data: new TextEncoder().encode('my-data'),
            typeUrl: 'test-data'
        }).pipe(
            encodeSignedObj(),
            decodeSignedObj(),
            map(signedObj => ({...signedObj, payload: [{...signedObj.payload[0], data: {typeUrl: '', value: new TextEncoder().encode('ay-data')}}]})),
            map(signedObj => ({signedObj, pubKey: signedObj.pubKey})),
            verifySignedObj(),
            tap(result => expect(result.isValid).to.be.false)

        ).subscribe(() => done());
    });


    it('should fail to verify a signed object with a bad public key', (done) => {
        of({
            username: 'my-name',
            password: 'my-password',
            data: new TextEncoder().encode('my-data'),
            typeUrl: 'test-data'
        }).pipe(
            encodeSignedObj(),
            decodeSignedObj(),
            map(signedObj => ({...signedObj, pubKey: signedObj.pubKey.replace('9', 'a')})),
            map(signedObj => ({signedObj, pubKey: signedObj.pubKey})),
            verifySignedObj(),
            tap(result => expect(result.isValid).to.be.false)

        ).subscribe(() => done());
    });

    it('should create a private key from a name and password', (done) => {
        of({username: 'my-name', password: 'my-password'}).pipe(
            createPrivateKey(),
            tap(key => expect(key).to.equal('202020202020206d792d6e616d656d792d70617373776f726420202020202020'))
        ).subscribe(() => done())
    });

    it('should sign some data using a private key', (done) => {
        const privateKey = of({username: 'my-name', password: 'my-password'}).pipe(
            createPrivateKey()
        );

        of(new TextEncoder().encode('my-data')).pipe(
            withLatestFrom(privateKey),
            map(([data, privateKey]) => ({data, privateKey})),
            signData(),
            withLatestFrom(privateKey),
            switchMap(([sig, privateKey]) => of(privateKey).pipe(getPublicKey(), map(pubKey => [sig, pubKey]))),
            map(([sig, pubKey]) => ({data: new TextEncoder().encode('my-data'), sig, pubKey})),
            verifySig(),
            tap(result => expect(result).to.be.true),
            tap(() => done())
        ).subscribe();
    });

    it('should be able to send data wrapped as a signed object', (done) => {
        let swarm: Swarm
        eventListener<NewValidSignedObjMsg>('new-valid-signed-obj').pipe(
            filter(signedObj => signedObj.payload[0].data?.typeUrl === 'my-type'),
            first(),
            tap(() => sendEvent<AppStopMsg>('app-stop')),
            switchMap(() => stopSwarm(swarm)),
            tap(() => done())
        ).subscribe();

        from(startSwarm().toPromise()).pipe(
            tap(swrm => swarm = swrm),
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: './db-files'})),
            map(() => new TextEncoder().encode('my-data')),
            tap(data => sendEvent<SendSignedObjMessageAction>('send-signed-obj-message', {
                data,
                typeUrl: 'my-type',
                password: 'my-password',
                username: 'my-username'
            })),
        ).subscribe()
    });
});