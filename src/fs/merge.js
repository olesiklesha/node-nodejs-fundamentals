import * as fs from 'node:fs/promises'
import path from 'node:path';
import {isFileOrFolderExists} from "../utils.js";
import {ERROR_MESSAGES} from "../constants.js";
import {argv} from 'node:process';


const PATH = 'workspace'
const PARTS_PATH = path.join(PATH, 'parts')

const [CLI_ARG, ...FILES] = argv.slice(2)

const getFilePathsByArgs = () => {
    return FILES.map(file => file.includes(',') ? file.split(',') : file).flat(2);
}


const getFilePathsByTxt = async () => {
    const items = await fs.readdir(PARTS_PATH, {withFileTypes: true})

    return items.reduce((acc, item) => {
        if (item.isFile() && path.extname(item.name).slice(1) === 'txt') return [...acc, item.name];

        return acc
    }, []).sort((a, b) => a.localeCompare(b));
}
const merge = async () => {
    if (!(await isFileOrFolderExists(PARTS_PATH))) {
        throw new Error(ERROR_MESSAGES.fsError)
    }

    const filePaths = CLI_ARG === '--files' ? getFilePathsByArgs() : await getFilePathsByTxt();

    if (filePaths.length === 0) {
        throw new Error(ERROR_MESSAGES.fsError)
    }

    const mergePath = path.join(PATH, 'merged.txt')

    await fs.writeFile(mergePath, '');

    for (const filePath of filePaths) {
        try {
            const content = await fs.readFile(path.join(PARTS_PATH, filePath), {encoding: 'utf-8'});

            await fs.appendFile(mergePath, content + '\n');
        } catch (err) {
            console.log(err)
            throw new Error(ERROR_MESSAGES.fsError)
        }
    }
};

await merge();
