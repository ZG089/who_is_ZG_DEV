const Repository = {
    Landing: 'https://github.com/PalmDevs/website',
    get Issues() {
        return `${this.Landing}/issues`
    },
    get CreateIssues() {
        return `${this.Issues}/new`
    },
} as const

export const RepositoryLinks = Repository

export { Repository }
