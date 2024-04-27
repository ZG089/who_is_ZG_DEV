import { execSync, spawnSync } from 'child_process'
import { defineConfig } from '@solidjs/start/config'
import svgPlugin from 'vite-plugin-solid-svg'

const defineString = (str?: string) => `"${str || 'unknown'}"`

const integrityCheckItems = ['public', 'src', './app.config.ts', './bun.lockb']
const integrityCheck = spawnSync('git', ['diff', '--name-only', 'HEAD', ...integrityCheckItems], {
    timeout: 5000,
})

const integrityDirtyItems = integrityCheck.stdout.toString().trim().split('\n').filter(Boolean)
const integrityResult = integrityDirtyItems.length ? 'dirty' : integrityCheck.status !== null ? 'clean' : 'unknown'

export default defineConfig({
    ssr: true,
    server: {
        preset: process.env.NITRO_PRESET ?? 'bun',
        prerender: {
            crawlLinks: true,
            failOnError: true,
        },
    },
    vite: {
        plugins: [svgPlugin({ defaultAsComponent: true })],
        define: {
            __APP_COMMIT: defineString(process.env.COMMIT_REF ?? execSync('git rev-parse HEAD').toString().trim()),
            __APP_DEPLOY_CONTEXT: defineString(process.env.CONTEXT ?? process.env.NODE_ENV),
            __APP_BRANCH: defineString(
                process.env.BRANCH ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
            ),
            __APP_INTEGRITY: defineString(integrityResult),
            __APP_INTEGRITY_DIRTY_FILES: `[${integrityDirtyItems.map(defineString).join(',')}]`,
        },
    },
})
