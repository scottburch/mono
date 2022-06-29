import {eventListener, Msg, sendEvent} from "@scottburch/rxjs-msg-bus";
import {switchMap, filter, from, tap, map} from 'rxjs'
import {NewValidSignedObjMsg} from "@libertynet/crypto/src/crypto";
import {SignedObj} from "@libertynet/crypto/src/signedObj";

export type RegisterNewRouteHandler = Msg<'register-new-route', {
    typeUrl: string,
    event: string
}>

export type RouteHandlerObj = {
    signedObj: SignedObj,
    data: Uint8Array
}

eventListener<RegisterNewRouteHandler>('register-new-route').pipe(
    switchMap(({typeUrl, event}) =>
        eventListener<NewValidSignedObjMsg>('new-valid-signed-obj').pipe(
            switchMap(signedObj => from(signedObj.payload).pipe(map(payload => ({signedObj, payload})))),
            filter(({payload}) => payload.data?.typeUrl === typeUrl),
            tap(({signedObj, payload}) => sendEvent(event, {signedObj, data: payload.data?.value || new Uint8Array()}))
        )
    )
).subscribe();