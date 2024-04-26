import type { Component } from 'solid-js'
import { RepositoryLinks } from './constants/links'

const ErrorPage: Component<{ error: unknown; reset: () => void }> = props => {
    return (
        <main id="error-page">
            <h1>Something went very wrong</h1>
            <p>Try refreshing the page. If that still doesn't work, you can report an issue using the button below.</p>
            <h4>Stack trace (include this in the bug report):</h4>
            <code id="error-page__stack">
                {props.error instanceof Error ? props.error.stack : JSON.stringify(props.error)}
            </code>
            <div id="error-page__buttons">
                <button
                    type="button"
                    onClick={() => location.reload()}
                    style="background: var(--primary); color: var(--on-primary)"
                >
                    Reload
                </button>
                <a href={RepositoryLinks.issues} style="background: var(--primary); color: var(--on-primary)">
                    Report an issue
                </a>
                <button
                    type="button"
                    onClick={props.reset}
                    style="background: var(--secondary); color: var(--on-secondary)"
                >
                    Try a re-render
                </button>
            </div>
        </main>
    )
}

export default ErrorPage
