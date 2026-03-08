import * as fs from 'node:fs/promises'

export const isFileOrFolderExists = async (path) => {
    return await fs.access(path, fs.constants.F_OK).then(() => true, () => false);
}