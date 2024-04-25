import type { Component, ComponentProps } from 'solid-js'

export * from './buttons'
export * from './Page'
export { default as NavDock } from './NavDock'
export { default as ProjectCard } from './ProjectCard'
export { default as Touchable } from './Touchable'

export type IconType = Component<ComponentProps<'svg'>>
