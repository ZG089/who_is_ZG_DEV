import type { Component } from 'solid-js'
import { RepositoryLinks } from './constants/links'

const ErrorPage: Component<{ error: unknown; reset: () => void }> = props => {
    return (
        <main id="error-page">
            <h1>Something went very wrong</h1>
            <p>
                Try refreshing the page. If that still doesn't work, you can report an issue{' '}
                <a target="_blank" rel="noreferrer" style="color: var(--primary)" href={RepositoryLinks.issues}>
                    here
                </a>
                .
            </p>
            <h4>Stack trace (include this in the bug report):</h4>
            <code id="error-page__stack">
                {props.error instanceof Error ? formatError(props.error) : JSON.stringify(props.error)}
            </code>
            <div id="error-page__buttons">
                <button
                    type="button"
                    onClick={() => location.reload()}
                    style="background: var(--primary); color: var(--on-primary)"
                >
                    Reload
                </button>
                <button
                    type="button"
                    onClick={props.reset}
                    style="background: var(--secondary); color: var(--on-secondary)"
                >
                    Try a re-render (won't reload the site)
                </button>
            </div>
        </main>
    )
}

const formatError = (error: Error) => {
    return `${error.name}: ${error.message}\n\n${error.stack}`
}

export default ErrorPage
