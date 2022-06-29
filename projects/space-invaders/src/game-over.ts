import {eventListener, Msg, sendEvent} from "./msg-bus";
import {AlienUpdatedEvent} from "./alien";
import {filter, map, tap} from "rxjs";
import {calculateTop, getContainer, gridSize} from "./alien-render";
import {ALIEN_SIZE} from "./settings";
import jq from "jquery";


export type GameOverEvent = Msg<'game-over', boolean>


eventListener<AlienUpdatedEvent>('alien-updated').pipe(
    map(calculateTop),
    map(top => top + (gridSize() * ALIEN_SIZE) >= (getContainer().height() || 0)),
    filter(isAtBottom => isAtBottom),
    tap(() => getGameOver().show()),
    tap(() => sendEvent<GameOverEvent>('game-over', true))
).subscribe();

sendEvent<GameOverEvent>('game-over', false);
const getGameOver = () => jq('#game-over');
getGameOver().hide();
