import {generateProto} from "./generate-proto"
import * as path from 'path'

const files = [
    path.join(__dirname, 'crypto/signed-obj'),
    path.join(__dirname, 'user/user')
];

Promise.all(files.map(generateProto));

