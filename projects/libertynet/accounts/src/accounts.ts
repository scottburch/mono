import {eventListener, Msg, sendEvent} from "@scottburch/rxjs-msg-bus";
import {DbReadAction, DbWriteAction, ValueReadFromDbMsg} from "@libertynet/db/src/db";
import {first, tap, filter, map, takeUntil} from 'rxjs'
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
    tap(({address, pubKey}) => eventListener<ValueReadFromDbMsg>('value-read-from-db').pipe(
        filter(({key}) => new TextDecoder().decode(key) === `account-${address}`),
        first(),
        tap(({key, value}) => value.length > 0 || sendEvent<DbWriteAction>('write-to-db', {
            key,
            value: Account.encode({pubKey}).finish()
        })),
        map(({value}) => value.length > 0 ? Account.decode(value) :  Account.fromJSON({pubKey: pubKey} as Account)),
        tap((account) => sendEvent<AccountExistsMsg>('account-exists', {address, account}))
    ).subscribe()),

    tap(({address}) => sendEvent<DbReadAction>('read-from-db', {
        key: new TextEncoder().encode(`account-${address}`)
    }))
).subscribe()