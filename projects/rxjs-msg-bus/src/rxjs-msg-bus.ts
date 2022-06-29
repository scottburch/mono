import {filter, map, Observable, Subject} from "rxjs";


export type Msg<TYPE, T> = {
    type: TYPE
    data: T
}

const centralBus = new Subject<Msg<unknown, unknown>>();
const centralBus$ = centralBus.asObservable();

export const eventListener = <T extends Msg<T['type'], T['data']>>(type: T['type']) => (centralBus$ as Observable<T>).pipe(
    filter(msg => msg.type === type),
    map(msg => msg.data as T['data'])
);

export const sendEvent = <T extends Msg<T['type'], T['data']>>(type: T['type'], data: T['data']) => centralBus.next({type, data});
export const sendEventPartial = <T extends Msg<T['type'], T['data']>>(type: T['type']) => (data: T['data']) => centralBus.next({type, data});
