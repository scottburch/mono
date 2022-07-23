import {eventListener, Msg, sendEvent} from "@scottburch/rxjs-msg-bus";
import {buildKey, DbWriteAction, readFromDb} from "@libertynet/db/src/db";
import {map, of, switchMap, takeUntil, tap} from 'rxjs'
import {Account} from "./account";
import {AppStopMsg} from '@libertynet/app/src/app'

type Hex = string;
export type EnsureAccountExistsAction = Msg<'ensure-account-exists', {
    address: Hex,
    pubKey: Hex
}>;

export type AccountExistsMsg = Msg<'account-exists', {
    address: Hex,
    account: Account
}>

eventListener<EnsureAccountExistsAction>('ensure-account-exists').pipe(
    takeUntil(eventListener<AppStopMsg>('app-stop')),

    switchMap(({address, pubKey}) => of(address).pipe(
        map(address => ({
            key: buildKey('libertynet', 'account', address)
        })),
        readFromDb(),
        tap(value => value.length > 0 || sendEvent<DbWriteAction>('write-to-db', {
            key: buildKey('libertynet', 'account', address),
            value: Account.encode({pubKey}).finish()
        })),
        map((value) => value.length > 0 ? Account.decode(value) :  Account.fromJSON({pubKey: pubKey} as Account)),
        tap((account) => sendEvent<AccountExistsMsg>('account-exists', {address, account}))
    ))
).subscribe()