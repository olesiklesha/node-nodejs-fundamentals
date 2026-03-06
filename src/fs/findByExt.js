import * as fs from 'node:fs/promises'
import path from 'node:path';
import {ERROR_MESSAGES} from "../constants.js";
import {argv} from 'node:process';

const getExt = () => {
    const [param, value] = argv.slice(2);

    return param === '--ext' ? value ?? 'txt' : 'txt';
}

const WORKSPACE_PATH = path.resolve('workspace')

const findByExt = async () => {
    const EXT = getExt();

    await fs.access(WORKSPACE_PATH, fs.constants.F_OK).catch(err => {
        throw new Error(ERROR_MESSAGES.fsError)
    })

    const items = await fs.readdir(WORKSPACE_PATH, {withFileTypes: true, recursive: true});

    const filePaths = await items.reduce((acc, item) => {
        if (!item.isFile()) return acc;

        const relPath = path.join(path.relative(WORKSPACE_PATH, item.parentPath), item.name)

        return path.extname(item.name).slice(1) === EXT ? [...acc, relPath] : acc;
    }, []).sort((a, b) => a.localeCompare(b))

    for (const item of filePaths) {
        console.log(item)
    }
};

await findByExt();
