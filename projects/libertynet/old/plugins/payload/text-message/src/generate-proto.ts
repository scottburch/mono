import {generateProto} from "@libertynet/engine/src/generate-proto"
import * as path from 'path'

const files = [
    path.join(__dirname, 'text-message/text-message'),
];

Promise.all(files.map(generateProto));

