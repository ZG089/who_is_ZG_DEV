import { type Component, For, Show } from 'solid-js'
import { Column, LinkButton, LinkIconButton, Page, ProjectCard, Row, Section, Touchable } from '~/components'

import IconDiscord from '~/assets/icons/discord.svg'
import IconMail from '~/assets/icons/mail.svg'

import Projects from '~/constants/projects'
import Skills from '~/constants/skills'
import Socials from '~/constants/socials'

import sharedStyles from '~/styles/shared.module.scss'
import styles from './(home).module.scss'

export default (() => {
    return (
        <Page>
            <Section constrainSize id="hero" class={styles.DirectTextChildrenCenter}>
                <Column gap="none">
                    {/* biome-ignore lint/a11y/useHeadingContent: Screen readers kinda suck, so here's a workaround */}
                    <h1 aria-label="Hey there, I'm Palm">
                        <span aria-hidden="true">Hey there, I'm </span>
                        <span
                            aria-hidden="true"
                            style="font-weight: var(--weight-bolder)"
                            class={sharedStyles.GradientText}
                        >
                            Palm
                        </span>
                        <span aria-hidden="true">!</span>
                    </h1>
                    <p style="text-wrap: balance">
                        I'm a 15-year-old self-taught full-stack developer and a UI/UX designer. I want to make useful
                        things look good and accessible to everyone.
                    </p>
                </Column>
                <Row
                    wrap
                    centerHorizontal
                    gap="md"
                    style="padding-block-start: var(--gap-small)"
                    as="ul"
                    aria-label="My socials"
                >
                    <For each={Object.values(Socials)}>
                        {social => (
                            <li>
                                <LinkIconButton
                                    variant="surface-low"
                                    label={social.name}
                                    href={social.href}
                                    icon={social.icon}
                                />
                            </li>
                        )}
                    </For>
                </Row>
            </Section>
            <Section centerHorizontal constrainSize id="projects">
                <h2 class={styles.JSXHeadingStart} aria-label="Projects">
                    <span aria-hidden="true">&lt;</span>
                    <span>Projects</span>
                    <span aria-hidden="true">&gt;</span>
                </h2>
                <ul class={styles.ProjectsGrid}>
                    <For each={Projects}>
                        {project => (
                            <li style="flex: 1">
                                <ProjectCard {...project} />
                            </li>
                        )}
                    </For>
                </ul>
                <p aria-hidden="true" class={styles.JSXHeadingEnd}>
                    &lt;/Projects&gt;
                </p>
            </Section>
            <Section id="skills">
                <Column gap="none">
                    <h2>Skills</h2>
                    <p>These are the technologies I know and use regularly.</p>
                </Column>
                <Row gap="sm" wrap style="max-width: 48rem" as="ul">
                    <For each={Skills}>
                        {skill => (
                            <li>
                                <Touchable
                                    as={Row}
                                    class={styles.SkillContainer}
                                    asProps={{
                                        gap: 'sm',
                                        as: 'a',
                                        href: skill.link,
                                        target: '_blank',
                                        rel: 'noreferrer',
                                    }}
                                    withInteractionGlow
                                    centerVertical
                                >
                                    <Show when={typeof skill.icon === 'string' && skill.icon}>
                                        {url => (
                                            <img
                                                aria-hidden="true"
                                                class={styles.SkillIcon}
                                                draggable="false"
                                                src={url()}
                                                loading="lazy"
                                                alt={`${skill.name} logo`}
                                            />
                                        )}
                                    </Show>
                                    <Show when={typeof skill.icon === 'function' && skill.icon}>
                                        {icon => icon()({ class: styles.SkillIcon })}
                                    </Show>
                                    <span>{skill.name}</span>
                                </Touchable>
                            </li>
                        )}
                    </For>
                </Row>
            </Section>
            <Section id="contact">
                <Column gap="none">
                    <h2>Let's chat</h2>
                    <p style="text-wrap: balance">
                        Don't be shy! If you want to know more about me, work with me, or just want to have a little
                        chat, you can always contact me at anytime.
                    </p>
                </Column>
                <Row as="ul" gap="sm" wrap>
                    <li>
                        <LinkButton leadingIcon={IconDiscord} href={Socials.discord.href}>
                            Chat on Discord
                        </LinkButton>
                    </li>
                    <li>
                        <LinkButton variant="secondary" leadingIcon={IconMail} href={Socials.mail.href}>
                            Send an email
                        </LinkButton>
                    </li>
                </Row>
            </Section>
        </Page>
    )
}) satisfies Component
