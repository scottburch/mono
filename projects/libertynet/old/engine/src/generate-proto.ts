import {exec} from "@scottburch/exec";
const nodeModulesPath = require.resolve('ts-node').replace(/node_modules.*/, 'node_modules');


export function generateProto(filename: string) {
    return exec`${nodeModulesPath}/.bin/pbjs -t static-module -w commonjs -p src -o ${filename}.pb.js ${filename}.proto`
        .then(() => exec` ${nodeModulesPath}/.bin/pbts -o ${filename}.pb.d.ts ${filename}.pb.js`);
}