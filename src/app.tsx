import { MetaProvider } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { type Component, ErrorBoundary, Suspense, onMount } from 'solid-js'

import { ThemeProvider } from './contexts'
import ErrorPage from './error-page'

import './app.scss'

const IntegrityEmojiMap: Record<typeof __APP_INTEGRITY, string> = {
    clean: '✅',
    dirty: '❌',
    unknown: '❓',
}

const App: Component = () => {
    onMount(() => {
        console.debug(
            "%cHey there!\n%cAre you a developer looking to contribute to this website? Check out the source code!\nIf you're just exploring then that's fine. Have fun!",
            'font-size: 3rem',
            'font-size: 1rem',
        )

        console.table({
            Version: `${__APP_BRANCH}.${__APP_COMMIT}-${__APP_DEPLOY_CONTEXT}`,
            Integrity: `${IntegrityEmojiMap[__APP_INTEGRITY]}`,
            'Dirty files': !__APP_INTEGRITY_DIRTY_FILES.length
                ? 'All important files are clean'
                : `${__APP_INTEGRITY_DIRTY_FILES.length} files are dirty:\n${__APP_INTEGRITY_DIRTY_FILES
                      .map(f => `- ${f}`)
                      .join('\n')}`,
        })
    })

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
