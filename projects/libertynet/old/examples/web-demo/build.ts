import {$, path} from 'zx'
import * as fs from 'fs/promises'

$`yarn webpack`
    .then(() => fs.readFile(path.join(__dirname, 'src/index.html')))
    .then(html => html.toString().split('//js-here'))
    .then(([start, end]) =>
        fs.writeFile(path.join(__dirname, './lib/index.html'), start)
            .then(() => fs.readFile(path.join(__dirname, 'lib/index.js')))
            .then(js => fs.appendFile(path.join(__dirname, 'lib/index.html'), js))
            .then(() => fs.appendFile(path.join(__dirname, 'lib/index.html'), end))
    )

