export declare class Style {
    static bold(text: string): string;
    static dim(text: string): string;
    static italic(text: string): string;
    static underline(text: string): string;
    static inverse(text: string): string;
    static hidden(text: string): string;
    static strikethrough(text: string): string;
    static grey(text: string): string;
    static gray(text: string): string;
    static white(text: string): string;
    static cyan(text: string): string;
    static magenta(text: string): string;
    static blue(text: string): string;
    static yellow(text: string): string;
    static green(text: string): string;
    static red(text: string): string;
    static black(text: string): string;
    static bgBlack(text: string): string;
    static bgRed(text: string): string;
    static bgGreen(text: string): string;
    static bgYellow(text: string): string;
    static bgBlue(text: string): string;
    static bgMagenta(text: string): string;
    static bgCyan(text: string): string;
    static bgWhite(text: string): string;
}
export declare class Logger {
    static info: (...args: any[]) => void;
    static warn: (...args: any[]) => void;
    static success: (...args: any[]) => void;
    static meta: (group: string, message: string, vars?: any) => void;
    static error: (...args: any[]) => void;
    static echo: (message: string, vars?: any) => void;
}
