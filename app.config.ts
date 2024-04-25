import { defineConfig } from '@solidjs/start/config'
import svgPlugin from 'vite-plugin-solid-svg'

export default defineConfig({
    ssr: true,
    server: {
        prerender: {
            crawlLinks: true,
            failOnError: true,
        },
        rollupConfig: {
            external: ['__STATIC_CONTENT_MANIFEST', 'node:async_hooks'],
        },
    },
    vite: {
        plugins: [svgPlugin({ defaultAsComponent: true })],
    }
})
