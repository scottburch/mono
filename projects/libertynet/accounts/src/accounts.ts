import {eventListener, Msg, sendEventPartial} from "@scottburch/rxjs-msg-bus";
import {buildKey, readFromDb, writeToDb} from "@libertynet/db";
import {map, of, switchMap, takeUntil, tap, iif} from 'rxjs'
import {Account} from "./account";
import {AppStopMsg} from '@libertynet/app'

type Hex = string;
export type EnsureAccountExistsAction = Msg<'ensure-account-exists', {
    address: Hex,
    pubKey: Hex
}>;

export type AccountExistsMsg = Msg<'account-exists', Account>

eventListener<EnsureAccountExistsAction>('ensure-account-exists').pipe(
    takeUntil(eventListener<AppStopMsg>('app-stop')),

    switchMap(({address, pubKey}) => of(address).pipe(
        map(address => ({
            key: buildKey('libertynet', 'account', address)
        })),
        readFromDb(),

        switchMap(value => iif(() => value.length > 0, (
            of(Account.decode(value))
        ), (
            of({
                key: buildKey('libertynet', 'account', address),
                value: Account.encode({pubKey, address}).finish()
            }).pipe(
                writeToDb(),
                map(() => Account.fromJSON({pubKey, address}))
            )
        ))),

        tap(sendEventPartial<AccountExistsMsg>('account-exists'))
    ))
).subscribe()