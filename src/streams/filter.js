import process from 'node:process'
import {Transform} from 'node:stream';

const [pattern] = process.argv.slice(3)


class Filterer extends Transform {
    _transform(chunk, encoding, callback) {
        if (chunk.toString().includes(pattern)) {
            this.push(chunk.toString());
        }

        callback();
    }
}


const filter = () => {
    process.stdin.pipe(new Filterer()).pipe(process.stdout);
};

filter();
