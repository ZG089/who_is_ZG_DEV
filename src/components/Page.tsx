import JSConfetti from 'js-confetti'
import { Link, Meta } from '@solidjs/meta'
import { useLocation } from '@solidjs/router'
import {
    type Component,
    type ComponentProps,
    type JSX,
    mergeProps,
    splitProps,
    createSignal,
    onMount,
    onCleanup,
    Show,
    useContext,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { format, register } from 'timeago.js'

import { combineClassNames, undefinedIf } from '~/utils'
import { BottomBanner, Button } from '~/components'
import { ThemeContext } from '~/contexts'

import styles from './Page.module.scss'
import sharedStyles from '~/styles/shared.module.scss'

const year = new Date().getUTCFullYear()
const birthday = new Date(`${year}-07-01 00:00:00 UTC+7`)
const birthdayEnd = new Date(`${year}-07-02 00:00:00 UTC+7`)

register(
    'countdown',
    (_: number, index: number, __?: number): [string, string] =>
        (
            [
                ['a few seconds', 'a few seconds'],
                ['%s seconds', '%s seconds'],
                ['1 minute', '1 minute'],
                ['%s minutes', '%s minutes'],
                ['1 hour', '1 hour'],
                ['%s hours', '%s hours'],
            ] as [string, string][]
        )[index],
)

export const Page: Component<ComponentProps<'main'> & { noCrawl?: boolean; noSetCanonical?: boolean }> = props => {
    const theme = useContext(ThemeContext)
    const loc = useLocation()
    const [time, setTime] = createSignal<string | null>('...')

    let confetti: JSConfetti | undefined

    const launchConfetti = () => {
        confetti?.addConfetti({
            confettiRadius: 4,
            confettiNumber: 250,
            confettiColors: theme.colorScheme === 'light' ? ['#29a873', '#007cfa'] : ['#4feaa9', '#57b7d9'],
        })
    }

    onMount(() => {
        confetti = new JSConfetti({ canvas: document.getElementById('confetti-canvas') as HTMLCanvasElement })

        const fn = () => {
            if (Date.now() >= birthday.getTime()) {
                launchConfetti()
                setTime(null)
                clearInterval(interval)
                return
            }

            setTime(format(birthday, 'countdown'))
        }

        fn()
        const interval = setInterval(() => fn, 1000)

        onCleanup(() => clearInterval(interval))
    })

    return (
        <Column as="main" flex centerHorizontal tabIndex="-1">
            <Show when={props.noCrawl}>
                <Meta name="robots" content="noindex, nofollow" />
            </Show>
            <Show when={!props.noSetCanonical}>
                <Link rel="canonical" href={`https://palmdevs.me${loc.pathname}`} />
            </Show>
            <Column {...props} centerHorizontal class={combineClassNames(props.class, styles.Content)}>
                {props.children}
            </Column>
            <Show when={Date.now() < birthdayEnd.getTime()}>
                <BottomBanner id="2024-bd" closeLabel="Close" onClose={launchConfetti}>
                    <Row gap="sm" flex wrap centerVertical style="justify-content: space-between">
                        <p style="margin: 0">
                            <Show
                                when={time()}
                                fallback={
                                    <>
                                        Today's my <span class={sharedStyles.GradientText}>birthday!</span> 🎂
                                    </>
                                }
                            >
                                It's <span class={sharedStyles.GradientText}>{time()}</span> before my birthday! 🎂
                            </Show>
                        </p>
                        <Button onClick={launchConfetti}>Launch confetti 🎉</Button>
                    </Row>
                </BottomBanner>
            </Show>
        </Column>
    )
}

export const Section: Component<SectionProps & FlexHelperProps<'section'>> = fullProps => {
    const [props, sectionProps] = splitProps(fullProps, ['constrainSize'])

    return (
        <Column
            as="section"
            wrap
            {...sectionProps}
            class={combineClassNames(
                styles.Section,
                styles.FlexAlignCenter,
                undefinedIf(props.constrainSize, sharedStyles.FlexFlex),
                sectionProps.class,
            )}
        />
    )
}

interface SectionProps extends ComponentProps<'section'> {
    constrainSize?: boolean
}

/*
 * FLEX HELPERS
 *
 * The Column and Row components are used to create a flex container with a gap between its children.
 * The gap can be set using the gap prop, and the flex prop can be used to make the container fill the available space.
 */

export const Row = <E extends ElementType>(props: FlexHelperProps<E>) => (
    <Dynamic component={props.as ?? 'div'} {...transformFlexHelperProps('FH-Row', false, props)} {...props.asProps} />
)

export const Column = <E extends ElementType>(props: FlexHelperProps<E>) => (
    <Dynamic component={props.as ?? 'div'} {...transformFlexHelperProps('FH-Col', true, props)} {...props.asProps} />
)

const transformFlexHelperProps = (
    name: string,
    // Center vertical uses justify-content
    cvuj: boolean,
    fullProps: FlexHelperProps<ElementType> & ComponentProps<ElementType>,
) => {
    const [props, compProps] = splitProps(fullProps, [
        'flex',
        'wrap',
        'centerHorizontal',
        'centerVertical',
        'as',
        'gap',
    ])

    const justifyCenter = (props.centerVertical && cvuj) || (props.centerHorizontal && !cvuj)
    const alignCenter = (props.centerVertical && !cvuj) || (props.centerHorizontal && cvuj)

    return mergeProps(compProps, {
        class: combineClassNames(
            styles[name],
            styles[`G-${props.gap ?? 'md'}`],
            undefinedIf(!props.flex, styles['FH-FF']),
            undefinedIf(!props.wrap, styles['FH-FW']),
            undefinedIf(!justifyCenter, styles['FH-JC']),
            undefinedIf(!alignCenter, styles['FH-AC']),
            compProps.class,
        ),
    })
}

// biome-ignore lint/suspicious/noExplicitAny: This is typings
type ElementType = keyof JSX.HTMLElementTags | Component<any>
export type FlexHelperProps<E extends ElementType> = FlexHelperCustomProps<E> &
    Omit<ComponentProps<E>, keyof FlexHelperCustomProps<E>>
type FlexHelperCustomProps<E extends ElementType> = {
    as?: E
    asProps?: ComponentProps<E>
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
    flex?: boolean
    wrap?: boolean
    centerVertical?: boolean
    centerHorizontal?: boolean
}
