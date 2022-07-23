import {eventListener, Msg, sendEvent} from "@scottburch/rxjs-msg-bus";
import {NewValidSignedObjMsg} from '@libertynet/crypto'
import {RegisterNewRouteHandler, RouteHandlerObj} from "./router";
import {first, tap} from 'rxjs'
import {expect} from 'chai'

describe('router', () => {
    it('should register a route for when a message arrives', (done) => {

        sendEvent<RegisterNewRouteHandler>('register-new-route', {
            typeUrl: 'my-type',
            event: 'my-type-event',
        });

        eventListener<Msg<'my-type-event', RouteHandlerObj>>('my-type-event').pipe(
            first(),
            tap(obj => {
                expect(obj.signedObj.payload[0].data?.typeUrl).to.equal('my-type');
                expect(Array.from(obj.data)).to.deep.equal([1,2,3]);
            }),
            tap(() => done())
        ).subscribe();

        sendEvent<NewValidSignedObjMsg>('new-valid-signed-obj', {
            pubKey: '',
            owner: '',
            version: 1,
            payload: [{signature: '', data: {typeUrl: 'my-type', value: new Uint8Array([1,2,3])}}]
        });
    })
});