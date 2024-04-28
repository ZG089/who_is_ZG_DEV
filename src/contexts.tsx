import { type Accessor, type Component, type JSX, createContext, createEffect, createSignal, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ThemeCycleMap } from './constants/theme'
import { logger } from './utils'

export const ThemeContext = createContext<ThemeStruct>({
    theme: 'auto',
    colorScheme: 'light',
    set: () => {},
    cycle: () => {},
    initialized: false,
})

export const ThemeProvider: Component<{ children: JSX.Element | JSX.Element[] }> = props => {
    const [theme, setTheme] = createStore<ThemeStruct>({
        theme: 'auto',
        colorScheme: 'dark',
        initialized: false,
        set: value => {
            if (value === 'auto') {
                localStorage.removeItem('theme_override')
                setTheme({
                    colorScheme: matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark',
                })
            } else {
                localStorage.setItem('theme_override', value)
                setTheme({
                    colorScheme: value as ThemeColorScheme,
                })
            }

            setTheme({
                theme: value,
            })

            document.documentElement.dataset.theme = theme.colorScheme
            logger.log('ThemeProvider', `Theme to "${value}" with color scheme "${theme.colorScheme}"`)
        },
        cycle: () => {
            theme.set(ThemeCycleMap[theme.theme])
        },
    })

    createEffect(() => {
        const mq = matchMedia('(prefers-color-scheme:light)')
        const override = localStorage.getItem('theme_override') as ThemeColorScheme

        setTheme({
            theme: override ?? 'auto',
            initialized: true,
        })

        logger.log('ThemeProvider', `Initialized with theme "${theme.theme}" and color scheme "${theme.colorScheme}"`)

        const listener = () => !localStorage.getItem('theme_override') && theme.set('auto')
        mq.addEventListener('change', listener)
        onCleanup(() => mq.removeEventListener('change', listener))
    })

    return <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
}

export interface ThemeStruct {
    theme: ThemeTheme
    colorScheme: ThemeColorScheme
    set: (theme: ThemeTheme) => void
    cycle: () => void
    initialized: boolean
}

export type ThemeColorScheme = 'light' | 'dark'
export type ThemeTheme = ThemeColorScheme | 'auto'
