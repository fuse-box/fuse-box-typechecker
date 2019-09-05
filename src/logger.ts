import { FuseLog } from './fuseLogger/fuseLog';

const _Logger = class extends FuseLog {};
const _logger = new _Logger();



export class Logger {
    public static info = (...args: any[]) => {
        _logger.info(...args);
    };
    public static echo = (message: string, vars?: any) => {
        _logger.echo(message, vars);
    };
}
