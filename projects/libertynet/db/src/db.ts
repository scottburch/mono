import {eventListener, Msg, sendEvent, sendEventPartial} from "@scottburch/rxjs-msg-bus";
import {AppStartMsg} from '@libertynet/app/src/app'
import {Level} from "level";
import {map, switchMap, tap, withLatestFrom, concatMap} from 'rxjs'

type Key = Uint8Array
type Value = Uint8Array

export type DbConnectionMsg = Msg<'db-connection', Level>
export type DbWriteAction = Msg<'write-to-db', {key: Key, value: Value}>
export type DbReadAction = Msg<'read-from-db', {key: Key}>
export type ValueReadFromDbMsg = Msg<'value-read-from-db', {key: Key, value: Value}>

eventListener<AppStartMsg>('app-start').pipe(
    map(appConfig => new Level(appConfig.dbPath || `${__dirname}/../../db-files`, { valueEncoding: 'view', keyEncoding: 'view'})),
    tap(sendEventPartial<DbConnectionMsg>('db-connection'))
).subscribe();

eventListener<DbWriteAction>('write-to-db').pipe(
    withLatestFrom(eventListener<DbConnectionMsg>('db-connection')),
    switchMap(([data, db]) => db.put(data.key, data.value, {keyEncoding: 'view'})),
).subscribe();

eventListener<DbReadAction>('read-from-db').pipe(
    withLatestFrom(eventListener<DbConnectionMsg>('db-connection')),
    concatMap(([data, db]) => db.get<Uint8Array, Uint8Array>(data.key, {keyEncoding: 'view', valueEncoding: 'view'}).then(value => [data.key, value]).catch(() => [data.key, new Uint8Array()])),
    tap(([key, value]) => sendEvent<ValueReadFromDbMsg>('value-read-from-db', {key, value}))
).subscribe()