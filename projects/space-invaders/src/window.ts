import {fromEvent, throttleTime} from "rxjs";
import {sendEvent} from "./msg-bus";

export type WindowSizeEvent = {type: 'windowResize', data:{height: number, width: number}};


const sendWindowSize = () => sendEvent<WindowSizeEvent>('windowResize', {height: window.innerHeight, width: window.innerWidth});

setTimeout(sendWindowSize)

fromEvent(window, 'resize').pipe(
    throttleTime(500, undefined, {leading: false, trailing: true})
).subscribe(sendWindowSize);

