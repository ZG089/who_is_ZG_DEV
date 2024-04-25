import { MetaProvider } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { type Component, Suspense } from 'solid-js'

import { ThemeProvider } from './contexts'

// Non-critical stylesheets
import './styles/layers.scss'

const App: Component = () => {
    return (
        <Router
            root={props => (
                <MetaProvider>
                    <ThemeProvider>
                        <Suspense>{props.children}</Suspense>
                    </ThemeProvider>
                </MetaProvider>
            )}
        >
            <FileRoutes />
        </Router>
    )
}

export default App
