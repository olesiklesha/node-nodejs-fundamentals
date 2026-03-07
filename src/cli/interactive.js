import * as readline from 'node:readline/promises';

import {exit, stdin as input, stdout as output, cwd} from 'node:process';

const EXIT = 'Goodbye!'

const interactive = () => {
    const start = Date.now();
    const rl = readline.createInterface({input, output, prompt: '> '});

    rl.prompt();

    rl.on('line', line => {
        const end = Date.now();
        switch (line.trim()) {
            case 'uptime':
                const time = (((end - start) / 1000)).toFixed(2)
                console.log(`Uptime: ${time}s`);
                break;

            case 'cwd':
                console.log(cwd());
                break;

            case 'exit':
                console.log(EXIT)
                exit(0)
                break;

            case 'date':
                console.log(new Date().toUTCString());
                break;

            default:
                console.log('Unknown command');
                break;
        }
        console.log(EXIT)
        exit(0)
    })

    rl.on('SIGINT', () => {
        console.log(EXIT)
        exit(0)
    });
};

interactive();
