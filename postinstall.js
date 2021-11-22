const RESET = `\u001B[0m`
const BLACK = '\u001b[30m'
const RED = '\u001b[31m'
const GREEN = '\u001b[32m'
const YELLOW = '\u001b[33m'
const BLUE = '\u001b[34m'
const MAGENTA = '\u001b[35m'
const CYAN = '\u001b[36m'
const WHITE = '\u001b[37m'
const BOLD = `\u001b[1m`
const UNDERLINE = `\u001b[4m`

const BANNER = `
${GREEN}Thank you for using ${YELLOW}${BOLD} vuex-module-decorators ${RESET}
${GREEN}This package had been unmaintained for a long time, but I am maintaining it again.${RESET}
${GREEN}Maintaining open source projects take time, and I definitely would gracefully accept donations${RESET}

${CYAN} - ${UNDERLINE}https://www.patreon.com/championswimmer${RESET}
${CYAN} - ${UNDERLINE}https://liberapay.com/championswimmer${RESET}

${RED}${BOLD}NOTE: ${RESET}${RED}If you are using Vue 3+ and Vuex 4+ please use ${YELLOW}${BOLD}v2.x ${RESET}${RED}of this package
`

console.log(BANNER)