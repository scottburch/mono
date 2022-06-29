import {from, switchMap} from "rxjs";

from([1,3,5]).pipe(
    switchMap(i => from([10 * i, 10 * i, 10 * i]))
).subscribe(console.log);