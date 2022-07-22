import {IIndexationPayload, IMessage, INDEXATION_PAYLOAD_TYPE, ITypeBase, SingleNodeClient} from "@iota/iota.js";
import {eventListener, sendEvent, sendEventPartial} from "@scottburch/rxjs-msg-bus";
import {AppStartMsg, AppStopMsg} from "@libertynet/app/src/app";
import {concatMap, filter, from, interval, map, pipe, switchMap, takeUntil, tap, withLatestFrom, count, mergeMap} from 'rxjs'
import {switchToLatestFrom} from '@scottburch/rxjs-utils'
import {memoize} from "lodash";
import {Converter} from "@iota/util.js";
import {Buffer} from "buffer";
import {
    ClientConnectedMsg,
    IotaPollTickMsg,
    LastMilestoneDetectedMsg,
    MilestoneDetectionErrorMsg,
    NewIotaMessageIdMsg,
    NewLibertynetMessageMsg,
    NewMilestoneDetectedMsg,
    SendIotaMessageAction,
    SendLibertynetMessageAction
} from "./messages";


// set milestone counter
eventListener<AppStartMsg>('app-start').pipe(
    tap(() => sendEvent<LastMilestoneDetectedMsg>('last-milestone-detected', 0))
).subscribe()

// start poll ticker
eventListener<AppStartMsg>('app-start').pipe(
    switchMap(() => interval(2000)),
    takeUntil(eventListener<AppStopMsg>('app-stop')),
    tap(sendEventPartial<IotaPollTickMsg>('iota-poll-tick'))
).subscribe();

// connect iota client
eventListener<AppStartMsg>('app-start').pipe(
    map(() => newIotaClient()),
    tap(sendEventPartial<ClientConnectedMsg>('client-connected'))
).subscribe()

// detect new milestones
eventListener<IotaPollTickMsg>('iota-poll-tick').pipe(
    switchToLatestFrom(eventListener<ClientConnectedMsg>('client-connected')),
    withLatestFrom(eventListener<LastMilestoneDetectedMsg>('last-milestone-detected')),
    switchMap(([client, index]) =>
        client.milestone(index + 1)
            .then(m => {
                sendEvent<NewMilestoneDetectedMsg>('new-milestone-detected', m);
            })
            .catch(e => sendEvent<MilestoneDetectionErrorMsg>('milestone-detection-error', e.toString()))
    ),
).subscribe()

// detect new milestone connected messages
eventListener<NewMilestoneDetectedMsg>('new-milestone-detected').pipe(
    withLatestFrom(eventListener<ClientConnectedMsg>('client-connected')),
    concatMap(([milestone, client]) => client.message(milestone.messageId).then(ms => ({index: milestone.index, milestone: ms}))),
    concatMap(({index, milestone}) => from(milestone.parentMessageIds as string[]).pipe(
        filterOutGenesisParent(),
        filterOutPreviousMessageIds(),
        tap(sendEventPartial<NewIotaMessageIdMsg>('new-iota-message-id')),
        count()
    )),
    withLatestFrom(eventListener<LastMilestoneDetectedMsg>('last-milestone-detected')),
    tap(([_, index]) => sendEvent<LastMilestoneDetectedMsg>('last-milestone-detected', index + 1)),
    tap(() => sendEvent<IotaPollTickMsg>('iota-poll-tick'))
).subscribe();

// read back in the graph to find new messages
eventListener<NewIotaMessageIdMsg>('new-iota-message-id').pipe(
    withLatestFrom(eventListener<ClientConnectedMsg>('client-connected')),
    concatMap(([messageId, client]) => client.messageMetadata(messageId)),
    switchMap(meta => from(meta.parentMessageIds as string[])),
    filterOutGenesisParent(),
    filterOutPreviousMessageIds(),
    tap(sendEventPartial<NewIotaMessageIdMsg>('new-iota-message-id')),
).subscribe();

// read newly discovered mesages
eventListener<NewIotaMessageIdMsg>('new-iota-message-id').pipe(
    withLatestFrom(eventListener<ClientConnectedMsg>('client-connected')),
    concatMap(([messageId, client]) => client.message(messageId)),
    filterForLibertynetMessage(),
    map(msg => (msg.payload as IIndexationPayload).data || ''),
    tap(sendEventPartial<NewLibertynetMessageMsg>('new-libertynet-message'))
).subscribe();

// send an iota message
eventListener<SendIotaMessageAction>('send-iota-message').pipe(
    withLatestFrom(eventListener<ClientConnectedMsg>('client-connected')),
    map(([msg, client]) => ({msg, client})),
    concatMap(ctx => from(ctx.client.tips()).pipe(
        map(tips => ({...ctx, msg: {...ctx.msg, parentMessageIds: tips.tipMessageIds.slice(0, 2)}}))
    )),
    tap(ctx => ctx.client.messageSubmit(ctx.msg))
).subscribe();


eventListener<SendLibertynetMessageAction>('send-libertynet-message').pipe(
    tap((hex: string) => sendEvent<SendIotaMessageAction>('send-iota-message', {
        payload: {
            type: INDEXATION_PAYLOAD_TYPE,
            index: Converter.utf8ToHex(`libertynet`),
            data: hex
        }
    }))
).subscribe();

/**
 * UTILITIES
 */
export const newIotaClient = (url: string = 'http://localhost:14265') => new SingleNodeClient(url);

const previousMessageIds: Record<string, { timestamp: number }> = {}
function filterOutPreviousMessageIds() {
    return pipe(
        filter((id: string) => !previousMessageIds[id]),
        tap(id => previousMessageIds[id] = {timestamp: Date.now()})
    )
}


function filterForLibertynetMessage() {
    return pipe(
        filter((msg: IMessage) => (msg.payload as ITypeBase<number>).type === 2 && (msg.payload as IIndexationPayload).index.includes(getLibertynetIndex())),
    )
}

const getLibertynetIndex = (memoize(() => Buffer.from('libertynet').toString('hex')));


function filterOutGenesisParent() {
    return pipe(
        filter((msgId: string) => !/^0*$/.test(msgId)),
    );
}