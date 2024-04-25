import { type Accessor, createContext, createSignal, createEffect, type Component, type JSX, onCleanup } from 'solid-js'
import { ThemeCycleMap } from './constants/theme'

export const ThemeContext = createContext<ThemeStruct>({
    theme: () => 'auto' as const,
    colorScheme: () => 'light' as const,
    set: () => {},
    cycle: () => {},
    initialized: () => false
})

export const ThemeProvider: Component<{ children: JSX.Element | JSX.Element[] }> = props => {
    const [colorScheme, setColorScheme] = createSignal<ThemeColorScheme>('dark')
    const [theme, setTheme] = createSignal<ThemeTheme>('auto')
    const [initialized, setInitialized] = createSignal(false)

    const themeSetHandler = ((value, mq?: Pick<MediaQueryList, 'matches'>) => {
        switch (value) {
            case 'auto':
                localStorage.removeItem('theme_override')
                setColorScheme((mq ?? matchMedia('(prefers-color-scheme:light)')).matches ? 'light' : 'dark')
                break
            default:
                localStorage.setItem('theme_override', value)
                setColorScheme(value)
        }

        setTheme(value)
        document.documentElement.dataset.theme = colorScheme()
    }) satisfies ThemeStruct['set']

    createEffect(() => {
        const mq = matchMedia('(prefers-color-scheme:light)')
        const override = localStorage.getItem('theme_override') as ThemeColorScheme

        setTheme(override ?? 'auto')
        setInitialized(true)

        const listener = (e: MediaQueryListEvent) =>
            !localStorage.getItem('theme_override') && themeSetHandler('auto', e)

        mq.addEventListener('change', listener)
        onCleanup(() => mq.removeEventListener('change', listener))
    })

    return (
        <ThemeContext.Provider
            value={{
                colorScheme: colorScheme,
                theme: theme,
                set: themeSetHandler,
                cycle: () => themeSetHandler(ThemeCycleMap[theme()]),
                initialized: initialized
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export interface ThemeStruct {
    theme: Accessor<ThemeTheme>
    colorScheme: Accessor<ThemeColorScheme>
    set: (theme: ThemeTheme) => void
    cycle: () => void
    initialized: Accessor<boolean>
}

export type ThemeColorScheme = 'light' | 'dark'
export type ThemeTheme = ThemeColorScheme | 'auto'
