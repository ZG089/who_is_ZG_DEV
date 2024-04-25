import { Column, Row } from './Page'
import Touchable from './Touchable'

import IconNext from '~/assets/icons/next.svg'

import type { Component } from 'solid-js'

import styles from './ProjectCard.module.scss'

const ProjectCard: Component<ProjectCardProps> = props => {
    return (
        <Touchable
            {...props}
            as={Column}
            flex
            asProps={{
                as: 'a',
                target: '_blank',
            }}
            class={styles.Card}
            withInteractionGlow
            aria-label={`${props.name}. ${props.description} Tap to ${props.hint}.`}
        >
            <Column centerHorizontal centerVertical class={styles.ImageContainer}>
                <img aria-hidden="true" draggable="false" loading="lazy" src={props.image} alt={props.name} />
            </Column>
            <Column style="justify-content: space-between" flex gap="md" class={styles.InfoContainer}>
                <Column gap="none">
                    <h3>{props.name}</h3>
                    <p style="margin-block: 0">{props.description}</p>
                </Column>
                <Row
                    gap="xs"
                    style="color: var(--primary); font-weight: var(--weight-label); margin: 0"
                    as="p"
                    aria-hidden="true"
                >
                    {props.hint ?? 'Learn more'} <IconNext />
                </Row>
            </Column>
        </Touchable>
    )
}

export interface ProjectCardProps {
    name: string
    description: string
    image: string
    href: string
    hint?: string
}

export default ProjectCard
