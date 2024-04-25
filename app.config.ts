import { defineConfig } from '@solidjs/start/config'
import svgPlugin from 'vite-plugin-solid-svg'
import { execSync, spawnSync } from 'child_process'

const defineString = (str?: string) => `"${str || 'unknown'}"`

const integrityCheck = spawnSync('git', ['diff-index', 'HEAD', '--quiet'], { stdio: 'ignore', timeout: 5000 })
const integrityResult = integrityCheck.status === 0 ? 'clean' : integrityCheck.status !== null ? 'dirty' : 'unknown'

export default defineConfig({
    ssr: true,
    server: {
        prerender: {
            crawlLinks: true,
            failOnError: true,
        },
    },
    vite: {
        plugins: [svgPlugin({ defaultAsComponent: true })],
        define: {
            __APP_COMMIT: defineString(
                (process.env.COMMIT_REF ?? execSync('git rev-parse --short HEAD').toString().trim()).slice(0, 7),
            ),
            __APP_DEPLOY_CONTEXT: defineString(process.env.CONTEXT ?? process.env.NODE_ENV),
            __APP_BRANCH: defineString(
                process.env.BRANCH ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
            ),
            __APP_INTEGRITY: defineString(integrityResult),
        },
    },
})
