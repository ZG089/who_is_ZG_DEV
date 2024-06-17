import { type Component, type ComponentProps, Show } from 'solid-js'

import { Column, Row } from './Page'
import Touchable from './Touchable'

import IconNext from '~/assets/icons/next.svg'

import { combineClassNames } from '~/utils'
import styles from './LinkCard.module.scss'

const LinkCard: Component<LinkCardProps> = props => {
    return (
        <Touchable
            data-comp={LinkCard.name}
            aria-label={`${props.name}. ${props.description} Tap to ${props.hint}.`}
            {...props}
            class={combineClassNames(styles.Card, props.class)}
            flex
            as={Column}
            asProps={{
                gap: 'none',
                as: 'a',
                target: '_blank',
                rel: 'noreferrer',
                href: props.href,
            }}
        >
            <Show when={props.preview}>{Comp => Comp()({})}</Show>
            <Column flex gap="md" class={styles.InfoContainer}>
                <Column gap="none">
                    <h3>{props.name}</h3>
                    <p style="margin: 0">{props.description}</p>
                </Column>
                <Show when={props.hint}>
                    <Row as="p" gap="xs" centerVertical class={styles.Hint} aria-hidden="true">
                        {props.hint} <IconNext />
                    </Row>
                </Show>
            </Column>
        </Touchable>
    )
}

export type LinkCardProps = {
    name: string
    description: string
    preview?: Component
    href: string
    hint?: string
} & ComponentProps<'a'>

export default LinkCard
