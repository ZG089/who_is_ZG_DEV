export const combineClassNames = (...classNames: (string | undefined)[]) => classNames.filter(Boolean).join(' ')
export const undefinedIf = <T, U>(condition: T, value: U) => (condition ? undefined : value)

const createLogMethod = (method: 'log' | 'debug') => (tag: string, ...args: unknown[]) => console[method](`%c[${tag}]`, 'font-weight: bold; color: aquamarine', ...args)
export const logger = {
    log: createLogMethod('log'),
    debug: createLogMethod('debug'),
}
