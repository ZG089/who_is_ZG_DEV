// @refresh reload
import { StartServer, createHandler } from '@solidjs/start/server'

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <title>Palm (PalmDevs)</title>
                    <meta
                        name="description"
                        content="I'm Palm! I'm a 15-year-old self-taught full-stack developer and a UI/UX designer. I want to make useful things look good and accessible to everyone. I am known for working and contributing to things in the open-source world, and designing applications."
                    />
                    <meta property="og:image" content="/assets/og/image.webp" />
                    <meta property="og:image:width" content="500" />
                    <meta property="og:image:height" content="500" />
                    <meta property="og:image:type" content="image/webp" />  
                    {assets}
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="theme-color" content="#16181b" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon-variants/apple-touch-icon.png" />
                    <link rel="mask-icon" href="/assets/favicon-variants/safari-pinned-tab.svg" color="#30a3a3" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-variants/favicon-16x16.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-variants/favicon-32x32.png" />
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
                    <link
                        rel="preload"
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap"
                        as="style"
                    />
                    <link
                        rel="preload"
                        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap"
                        as="style"
                    />
                    <link rel="preconnect" href="https://fonts.gstatic.com" as="font" />
                </head>
                <script>
                    document.documentElement.dataset.theme = localStorage.getItem('theme_override') ??
                    (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark')
                </script>
                <body>
                    <noscript>You will need to enable JavaScript to run this site.</noscript>
                    {scripts}
                    {children}
                </body>
            </html>
        )}
    />
))
