import {flatten, times} from "lodash";
import {eventListener, Msg, sendEvent, sendEventPartial} from "./msg-bus";
import {WindowSizeEvent} from "./window";
import {first, map, pipe, Subscription, tap} from "rxjs";
import jq from 'jquery';
import {whenMyTurn} from "./tick";
import {ALIEN_SIZE, ALIEN_SPEED, COLS, ROWS} from "./settings";
import {movement} from "./alien-mover";
import {calculateLeft, calculateTop, getAlienSize, renderAlienContainer, rerenderAlien} from "./alien-render";
import {Missile, MissileHitEvent, MissileUpdatedEvent} from "./missile";

export type Alien = {
    id: string
    x: number
    y: number
    el: JQuery
    tick?: Subscription
    missile?: Subscription
}

export type AlienCreatedEvent = Msg<'alien-created', Alien>
type AlienRenderedEvent = Msg<'alien-rendered', Alien>
export type AlienUpdatedEvent = Msg<'alien-updated', Alien>
type StartGameEvent = Msg<'start-game', {}>


const createAliens = (rows: number, columns: number) => pipe(
    map(() => flatten(times(rows).map(row =>
            times(columns).map(col => ({
                id: `alien-${col}-${row}`,
                x: col * ALIEN_SIZE,
                y: row * ALIEN_SIZE,
                el: jq(),
            } as Alien))
        ))
    )
);

const notifyAliensCreated = pipe(
    map((aliens: Alien[]) => aliens.forEach(sendEventPartial<AlienCreatedEvent>('alien-created')))
)


eventListener<StartGameEvent>('start-game').pipe(
    first(),
    createAliens(ROWS, COLS),
    notifyAliensCreated
).subscribe()

eventListener<WindowSizeEvent>('windowResize').pipe(
    first(),
).subscribe(sendEventPartial<StartGameEvent>('start-game'));




const addWindowResize = (alien: Alien) =>
    eventListener<WindowSizeEvent>('windowResize').subscribe(() => rerenderAlien(alien));

const addTickListener = (alien: Alien) =>
    alien.tick = whenMyTurn(ALIEN_SPEED, movement).pipe(
        tap(move => move(alien)),
        tap(() => rerenderAlien(alien)),
        tap(() => sendEvent<AlienUpdatedEvent>('alien-updated', alien))
    ).subscribe();

const addMissileListener = (alien: Alien) =>
    alien.missile = eventListener<MissileUpdatedEvent>('missile-updated').subscribe(checkCollision(alien));


const checkCollision = (alien: Alien) => (missile: Missile) =>
    missile.top <= calculateTop(alien) + getAlienSize() &&
    missile.top >= calculateTop(alien) &&
    missile.left >= calculateLeft(alien) &&
    missile.left <= calculateLeft(alien) + getAlienSize() &&
    sendEvent<MissileHitEvent>('missile-hit', {missile, alien})

eventListener<MissileHitEvent>('missile-hit').pipe(
    map(({alien}) => alien),
    tap(alien => alien.el.remove()),
    tap(alien => alien.missile?.unsubscribe()),
    tap(alien => alien.tick?.unsubscribe())
).subscribe()

eventListener<AlienRenderedEvent>('alien-rendered').pipe(
    tap(addWindowResize),
    tap(addTickListener),
    tap(addMissileListener)
).subscribe();






