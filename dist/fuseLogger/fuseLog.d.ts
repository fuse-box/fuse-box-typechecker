export declare class FuseLog {
    indent: string;
    log(_type: string, result: string): void;
    getString(message: string, vars?: any): string;
    echo(message: string, vars?: any): void;
    info(...args: any): void;
    warn(...args: any): void;
    success(...args: any): void;
    meta(group: string, message: string, vars?: any): void;
    error(...args: any): void;
}
export declare function createLog<L>(_CustomLogger?: L): FuseLog;
