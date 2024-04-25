export const combineClassNames = (...classNames: (string | undefined)[]) => classNames.filter(Boolean).join(' ')
export const undefinedIf = <T, U>(condition: T, value: U) => (condition ? undefined : value)
