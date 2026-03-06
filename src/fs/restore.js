import fs from 'node:fs/promises'
import path from 'node:path';
import {ERROR_MESSAGES} from "../constants.js";

const FILE_PATH = path.resolve('../../snapshot.json')
const RESTORED_DIR_PATH = path.join(path.dirname(FILE_PATH), 'workspace_restored');

const restore = async () => {
    try {
        const rowData = await fs.readFile(FILE_PATH, 'utf8').catch((e) => {
            throw new Error(ERROR_MESSAGES.fsError)
        })
        const data = JSON.parse(rowData)

        await fs.access(RESTORED_DIR_PATH, fs.constants.F_OK).then(() => {
            throw new Error(ERROR_MESSAGES.fsError)
        }, () => {
            fs.mkdir(RESTORED_DIR_PATH)
        })

        const dirs = data.entries.filter((entry) => entry.type === 'directory')
        const files = data.entries.filter((entry) => entry.type === 'file')

        for (const entry of dirs) {
            const {path: entryPath} = entry;

            await fs.mkdir(path.join(RESTORED_DIR_PATH, entryPath));
        }

        for (const entry of files) {
            const {path: entryPath, content} = entry;

            await fs.writeFile(path.join(RESTORED_DIR_PATH, entryPath), atob(content));
        }
    } catch (err) {
        throw new Error('something went wrong' + err.message);
    }
};

await restore();
