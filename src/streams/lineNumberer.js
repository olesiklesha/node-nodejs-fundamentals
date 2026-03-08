import process from 'node:process'
import {Transform} from 'node:stream';


let counter = 1;


class Numberer extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(`${counter++} | ${chunk.toString()}`);
    
        callback();
    }
}


const lineNumberer = () => {
    process.stdin.pipe(new Numberer()).pipe(process.stdout);
};

lineNumberer();

