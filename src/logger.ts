import { FuseLog } from "./fuseLogger/fuseLog";



const _Logger = class extends FuseLog{}
const _logger = new _Logger();

export class Style{

    // format
    public static bold(text: string){
        return `<bold>${text}</bold>`
    }
    public static dim(text: string){
        return `<dim>${text}</dim>`
    }
    public static italic(text: string){
        return `<italic>${text}</italic>`
    }
    public static underline(text: string){
        return `<underline>${text}</underline>`
    }
    public static inverse(text: string){
        return `<inverse>${text}</inverse>`
    }
    public static hidden(text: string){
        return `<hidden>${text}</hidden>`
    }
    public static strikethrough(text: string){
        return `<strikethrough>${text}</strikethrough>`
    }

    // text color
    public static grey(text: string){
        return `<grey>${text}</grey>`
    }
    public static gray(text: string){
        return `<gray>${text}</gray>`
    }
    public static white(text: string){
        return `<white>${text}</strikethrowhiteugh>`
    }
    public static cyan(text: string){
        return `<cyan>${text}</cyan>`
    }
    public static magenta(text: string){
        return `<magenta>${text}</magenta>`
    }
    public static blue(text: string){
        return `<blue>${text}</blue>`
    }
    public static yellow(text: string){
        return `<yellow>${text}</yellow>`
    }
    public static green(text: string){
        return `<green>${text}</green>`
    }
    public static red(text: string){
        return `<red>${text}</red>`
    }
    public static black(text: string){
        return `<black>${text}</black>`
    }

    // text background
    
    public static bgBlack(text: string){
        return `<bgBlack>${text}</bgBlack>`
    }
    public static bgRed(text: string){
        return `<bgRed>${text}</bgRed>`
    }
    public static bgGreen(text: string){
        return `<bgGreen>${text}</bgGreen>`
    }
    public static bgYellow(text: string){
        return `<bgYellow>${text}</bgYellow>`
    }
    public static bgBlue(text: string){
        return `<bgBlue>${text}</bgBlue>`
    }
    public static bgMagenta(text: string){
        return `<bgMagenta>${text}</bgMagenta>`
    }
    public static bgCyan(text: string){
        return `<bgCyan>${text}</bgCyan>`
    }
    public static bgWhite(text: string){
        return `<bgWhite>${text}</bgWhite>`
    }

}

export class Logger{
    public static info = _logger.info;
    public static warn = _logger.warn;
    public static success = _logger.success;
    public static meta = _logger.meta;
    public static error = _logger.error;
}

