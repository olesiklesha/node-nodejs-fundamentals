import * as fs from 'node:fs/promises'
import path from 'node:path';
import {ERROR_MESSAGES} from "../constants.js";


const WORKSPACE_PATH = path.resolve('../../workspace')

const snapshot = async () => {
    try {
        const items = await fs.readdir(WORKSPACE_PATH, { withFileTypes: true, recursive: true }).catch(() => {
            throw new Error(ERROR_MESSAGES.fsError)
        });

        const entries = [];

        for (const item of items) {
            const type = item.isFile() ? 'file' : 'directory';
            const relativePath = path.join(path.relative(WORKSPACE_PATH, item.parentPath), item.name)

            const res = {
                path: relativePath,
                type
            }

            if (item.isDirectory()) {
                entries.push(res)

                continue;
            }

            const itemPath = path.join(item.parentPath, item.name);
            const content = await fs.readFile(itemPath, {encoding: 'utf-8'});
            const stat = await fs.stat(itemPath)

            entries.push({...res, content, size: stat.size})
        }

        await fs.writeFile(path.join(WORKSPACE_PATH, 'snapshot.json'), JSON.stringify({
            rootPath: WORKSPACE_PATH,
            entries,
        }));


    } catch (e) {
        throw new Error('Something went wrong' + e.message)
    }

};

await snapshot();
