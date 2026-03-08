import process from 'node:process'

const DEFAULT_COLOR = '\x1b[0m'


const CLI_ARGS = process.argv.slice(2);

const getProgressBarArgs = () => {

    const getArgValue = (arg, defaultValue, getString = false) => {
        const value = CLI_ARGS.includes(arg) ? (CLI_ARGS[CLI_ARGS.indexOf(arg) + 1] ?? defaultValue) : defaultValue

        return getString ? value : Number(value)
    };


    return {
        duration: getArgValue('--duration', 5000),
        interval: getArgValue('--interval', 100),
        length: getArgValue('--length', 30),
        color: getArgValue('--color', DEFAULT_COLOR, true),
    }
}

const isValidHex = (color) => /^#[0-9A-F]{6}$/i.test(color)

const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    return {r, g, b};
}

const getColoredText = (text, hexColor) => {
    const {r, g, b} = hexToRgb(hexColor);
    const colorString = isValidHex(hexColor) ? `\x1b[38;2;${r};${g};${b}m` : DEFAULT_COLOR;

    return `${colorString}${text}${DEFAULT_COLOR}`
}

const progress = () => {
    const {duration, color, interval: progressInterval, length} = getProgressBarArgs()

    const getProgressBarStr = (progress) => {
        const filledWidth = Math.floor(progress / 100 * length);
        const emptyWidth = length - filledWidth;
        const progressBar = '█'.repeat(filledWidth) + ' '.repeat(emptyWidth);

        return `[${getColoredText(progressBar, color)}] ${progress}%`;
    }

    let currentTime = 0;

    const progressBarTic = () => {
        currentTime += progressInterval;
        const progressPercentage = Math.floor(currentTime / duration * 100);
        process.stdout.write(`\r${getProgressBarStr(progressPercentage)}`);
    }

    const interval = setInterval(progressBarTic, progressInterval);

    const finishProgressBar = () => {
        clearInterval(interval);
        process.stdout.write(`\r${getProgressBarStr(100)}`);
        console.log("\nDone!");
    }

    setTimeout(finishProgressBar, duration);
};

progress();
