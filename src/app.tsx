import { MetaProvider } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { type Component, Suspense, ErrorBoundary } from 'solid-js'

import { ThemeProvider } from './contexts'
import ErrorPage from './error-page'

import './app.scss'

const App: Component = () => {
    return (
        <ErrorBoundary fallback={(err, reset) => <ErrorPage error={err} reset={reset} />}>
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
        </ErrorBoundary>
    )
}

export default App
