import {startSwarm, stopHornet, stopSwarm, Swarm} from "@libertynet/test/src/swarm-utils";
import {AppStartMsg, AppStopMsg} from "@libertynet/app";
import {concatMap, filter, first, firstValueFrom, from, map, skip, switchMap, tap, timer, delay} from 'rxjs'
import {eventListener, sendEvent} from "@scottburch/rxjs-msg-bus";
import './iotaConnector'
import {
    ClientConnectedMsg,
    MilestoneDetectionErrorMsg,
    NewLibertynetMessageMsg,
    NewMilestoneDetectedMsg,
    SendLibertynetMessageAction
} from "./messages";
import '@libertynet/test/src/test-app'
import {rm} from "fs/promises";
import {expect} from 'chai'

describe('iota-connector', () => {
    beforeEach(() =>
        rm(__dirname + '/../db-files', {recursive: true, force: true})
    );

    it('should pick up the nodeUrl from the app-start to connect to', (done) => {
        eventListener<ClientConnectedMsg>('client-connected').pipe(
            first(),
            tap(client => expect((client as any)._endpoint).to.equal('http://localhost:2222')),
            tap(() => sendEvent<AppStopMsg>('app-stop')),
            tap(() => done())
        ).subscribe();

        sendEvent<AppStartMsg>('app-start', {
            dbPath: __dirname + '/../db-files',
            nodeUrl: 'http://localhost:2222'
        })
    });

    it('should send a milestone detection error if a swarm is not up yet', () => {
        return firstValueFrom(timer(0).pipe(
            switchMap(() => stopHornet().toPromise()),
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: __dirname + '/../db-files'})),
            switchMap(() => eventListener<MilestoneDetectionErrorMsg>('milestone-detection-error')),
            tap(() => sendEvent<AppStopMsg>('app-stop'))
        ))
    });

    it('should detect a new milestone when they occur', () => {
        return firstValueFrom(timer(0).pipe(
            switchMap(() => startSwarm().toPromise()),
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: __dirname + '/../db-files'})),
            concatMap(swarm => eventListener<NewMilestoneDetectedMsg>('new-milestone-detected')
                .pipe(map(ms => ({ms, swarm})))
            ),
            filter(({ms}) => ms.index > 2),
            tap(() => sendEvent<AppStopMsg>('app-stop')),
            switchMap(({swarm}) => stopSwarm(swarm))
        ));
    });

    it('should be able to send a libertynet message', (done) => {
        let swarm: Swarm;
        eventListener<NewLibertynetMessageMsg>('new-libertynet-message').pipe(
            skip(19),
            first(),
            tap(() => sendEvent<AppStopMsg>('app-stop')),
            switchMap(() => stopSwarm(swarm)),
            tap(() => done())
        ).subscribe();

        firstValueFrom(from(startSwarm().toPromise()).pipe(
            tap(swrm => swarm= swrm),
            tap(() => sendEvent<AppStartMsg>('app-start',{dbPath: __dirname + '/../db-files'})),
            tap(() => [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0].forEach((_, n) =>
                sendEvent<SendLibertynetMessageAction>('send-libertynet-message',
                    Buffer.from([1,2,3,n]).toString('hex')
                )
            ))
        ))
    });
});