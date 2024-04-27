import NavDock from '~/components/NavDock'

import IconBlog from '~/assets/icons/nav/blog.svg'
import IconHome from '~/assets/icons/nav/home.svg'
import IconSource from '~/assets/icons/source.svg'

import type { RouteSectionProps } from '@solidjs/router'
import type { Component } from 'solid-js'

const Layout: Component<RouteSectionProps> = props => {
    return (
        <>
            <NavDock
                pages={[
                    { name: 'Home', href: '/', icon: IconHome },
                    { name: 'Blog', href: '/blog', icon: IconBlog },
                ]}
                links={[
                    {
                        name: 'Source code',
                        icon: IconSource,
                        href: 'https://github.com/PalmDevs/website',
                    },
                ]}
            />
            {props.children}
        </>
    )
}

export default Layout
