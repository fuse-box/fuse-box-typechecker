import * as path from 'path';
import { ITypeCheckerOptions } from './interfaces';
export function getPath(usePath: string, options: ITypeCheckerOptions): string {
    return options.basePath
        ? path.resolve(options.basePath, usePath)
        : path.resolve(process.cwd(), usePath);
}
