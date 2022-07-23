import * as fs from 'fs-extra'
import {AppStartMsg} from '@libertynet/app/src/app'
import {from, map, tap} from 'rxjs'
import {sendEvent} from "@scottburch/rxjs-msg-bus";
import {buildKey, bytesToNum, numToBytes, readFromDb, writeToDb} from "./db";
import './db'
import {expect} from "chai";

describe('db', function() {
    this.timeout(2_000);

    it('should be able to convert number to bytes and bytes to number', () => {
        expect(Array.from(numToBytes(257))).to.deep.equal([1, 1]);
        expect(bytesToNum(numToBytes(2581))).to.equal(2581);
    })

    it('should have a read convinience method', (done) => {
        from(fs.rm('./db-files', {recursive: true, force: true})).pipe(
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: __dirname + '/db-files'})),
            map(() => ({
                key: buildKey('my-appId', 'my-category', 'my-key'),
                value: new Uint8Array([1,2,3])
            })),
            writeToDb(),
            readFromDb(),
            tap(val => expect(Array.from(val)).to.deep.equal([1,2,3])),
            tap(() => done())
        ).subscribe()

    })
});