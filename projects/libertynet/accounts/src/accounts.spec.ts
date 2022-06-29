import {eventListener, sendEvent} from "@scottburch/rxjs-msg-bus";
import {AccountExistsMsg, EnsureAccountExistsAction} from "./accounts";
import {from, tap, filter, take, bufferCount, switchMap, delay} from 'rxjs'
import {startSwarm, Swarm ,stopSwarm} from '@libertynet/test/src/swarm-utils'
import './accounts'
import {AppStartMsg} from '@libertynet/app/src/app'
import '@libertynet/app/src/app'
import {expect} from "chai";
import {rm} from "fs/promises";
import * as path from 'path'


describe('accounts', () => {
    it('should check if an account exists and create it if it does not', (done) => {
        let swarm: Swarm;
        eventListener<AccountExistsMsg>('account-exists').pipe(
            filter(({address}) => address === 'my-address'),
            take(2),
            bufferCount(2),
            tap(accounts => {
                expect(accounts[0].account.pubKey).to.equal('my-pubkey');
                expect(accounts[1].account.pubKey).to.equal('my-pubkey');
            }),
            tap(() => stopSwarm(swarm)),
            tap(() => done())
        ).subscribe()


        from(rm(path.join(__dirname, '../db-files'), {recursive: true})).pipe(
            switchMap(() => startSwarm().toPromise()),
            tap(swrm => swarm = swrm),
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: './db-files'})),
            tap(() =>  sendEvent<EnsureAccountExistsAction>('ensure-account-exists', {
                address: 'my-address',
                pubKey: 'my-pubkey'
            })),
            delay(100),
            tap(() => sendEvent<EnsureAccountExistsAction>('ensure-account-exists', {
                address: 'my-address',
                pubKey: 'fake-pubkey'
            }))
        ).subscribe()
    });
});