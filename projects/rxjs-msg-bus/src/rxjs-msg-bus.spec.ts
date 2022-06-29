import {eventListener, Msg, sendEvent, sendEventPartial} from "./rxjs-msg-bus";
import {scan} from "rxjs";

describe('rxjs-msg-bus', () => {
    type TestEvent = Msg<'test-event', number>

    it('should notify on an event', (done) => {
        eventListener<TestEvent>('test-event').pipe(
            scan((total, n) => total + n, 0)
        ).subscribe(total => total === 21 && done());

        sendEvent<TestEvent>('test-event', 10);
        sendEventPartial<TestEvent>('test-event')(11)
    });
});