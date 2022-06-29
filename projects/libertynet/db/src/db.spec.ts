import * as fs from 'fs-extra'
import {AppStartMsg} from '@libertynet/app/src/app'
import {from, tap} from 'rxjs'
import {eventListener, sendEvent} from "@scottburch/rxjs-msg-bus";
import {DbReadAction, DbWriteAction, ValueReadFromDbMsg} from "./db";
import './db'
import {expect} from "chai";

describe('db', function() {
    this.timeout(2_000);

    it('should startup on app start', (done) => {
        eventListener<ValueReadFromDbMsg>('value-read-from-db').pipe(
            tap(({key, value}) => {
                expect(new TextDecoder().decode(key)).to.equal('my-key');
                expect(new TextDecoder().decode(value)).to.equal('my-value');
            }),
            tap(() => done())
        ).subscribe()

        from(fs.rm('./db-files', {recursive: true, force: true})).pipe(
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: __dirname + '/db-files'})),
            tap(() => sendEvent<DbWriteAction>('write-to-db', {
                key: new TextEncoder().encode('my-key'),
                value: new TextEncoder().encode('my-value')
            })),
            tap(() => sendEvent<DbReadAction>('read-from-db', {key: new TextEncoder().encode('my-key')})),
        ).subscribe();
    });
});