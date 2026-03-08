import path from 'node:path';
import * as fs from 'node:fs/promises'
import process from 'node:process';
import {createHash} from "node:crypto";
import {pipeline} from 'node:stream/promises';
import {isFileOrFolderExists} from "../utils.js";
import {ERROR_MESSAGES} from "../constants.js";

const PATH = path.join(path.resolve(process.cwd()), 'checksums.json')
const WORKSPACE = path.join(path.resolve(process.cwd()), 'workspace')
const verify = async () => {
    const isFileExists = await isFileOrFolderExists(PATH);
    if (!isFileExists) {
        throw new Error(ERROR_MESSAGES.fsError)
    }

    try {
        const rowData = await fs.readFile(PATH, {encoding: 'utf-8'});

        for (const [fileName, hashValue] of Object.entries(JSON.parse(rowData))) {
            const hash = createHash('sha256');

            const openedFile = await fs.open(path.join(WORKSPACE, fileName))
            const fileStream = openedFile.createReadStream({encoding: 'utf-8'});

            await pipeline(fileStream, hash)

            console.log(`${fileName} — ${hash.digest('hex') === hashValue ? 'OK' : 'FAIL'}`)
        }


    } catch (error) {
        throw new Error('Something went wrong');
    }
};

await verify();