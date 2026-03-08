import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [pluginName] = process.argv.slice(2);

const dynamic = async () => {
    if (!pluginName) {
        console.log('Plugin not found')
        process.exit(1);
    }

    const pluginPath = path.join(__dirname, 'plugins', pluginName.endsWith(".js") ? pluginName : `${pluginName}.js`);

    try {

        const plugin = await import(`file://${pluginPath}`);

        const res = plugin.run();
        console.log(res)

    } catch (e) {
        console.log(e)
        throw new Error('Something went wrong');
    }
};

await dynamic();
