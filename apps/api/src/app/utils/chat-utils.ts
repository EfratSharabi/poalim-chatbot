import { v4 as uuidv4 } from 'uuid';

export namespace ChatUtils {

    export const generateId = (): string => uuidv4();

    export const normalize = (text: string): string => text.toLowerCase().replace(/[^\w\s]/g, '');
}
