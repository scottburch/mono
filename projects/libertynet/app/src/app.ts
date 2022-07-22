import {eventListener, getCentralMsgBus, Msg} from "@scottburch/rxjs-msg-bus";
import {takeUntil, switchMap, tap} from 'rxjs'

export type AppConfig = {
    dbPath: string
}

export type EnableLogCentralBusMsg = Msg<'enable-log-central-bus'>
export type DisableLogCentralBusMsg = Msg<'disable-log-central-bus'>

export type AppStartMsg = Msg<'app-start', AppConfig>;
export type AppStopMsg = Msg<'app-stop'>;

eventListener<EnableLogCentralBusMsg>('enable-log-central-bus').pipe(
    switchMap(() => getCentralMsgBus()),
    takeUntil(eventListener<DisableLogCentralBusMsg>('disable-log-central-bus')),
    takeUntil(eventListener<AppStopMsg>('app-stop')),
    tap(console.log)
).subscribe()




