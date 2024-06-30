import { type Component, type JSX, Suspense } from 'solid-js'
import { NavDock } from '~/components'

import IconBlog from '~/assets/icons/nav/blog.svg'
import IconHome from '~/assets/icons/nav/home.svg'
import IconSource from '~/assets/icons/source.svg'

const GlobalLayout: Component<{ children: JSX.Element }> = props => {
    let canvasRef: HTMLCanvasElement | undefined

    return (
        <>
            <canvas
                id="confetti-canvas"
                ref={canvasRef}
                style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: var(--layer-overlay);"
            />
            <NavDock
                pages={[
                    { name: 'Home', href: '/', icon: IconHome },
                    { name: 'Blog', href: '/blog', icon: IconBlog, matchSubroutes: true },
                ]}
                links={[
                    {
                        name: 'Source code',
                        icon: IconSource,
                        href: 'https://github.com/PalmDevs/website',
                    },
                ]}
            />
            <Suspense>{props.children}</Suspense>
        </>
    )
}

export default GlobalLayout
