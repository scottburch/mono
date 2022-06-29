import {eventListener, getCentralMsgBus, Msg} from "@scottburch/rxjs-msg-bus";
import {takeUntil} from 'rxjs'

export type AppConfig = {
    dbPath: string
}

export type AppStartMsg = Msg<'app-start', AppConfig>;
export type AppStopMsg = Msg<'app-stop'>;


getCentralMsgBus().pipe(
    takeUntil(eventListener<AppStopMsg>('app-stop'))
).subscribe(console.log);


