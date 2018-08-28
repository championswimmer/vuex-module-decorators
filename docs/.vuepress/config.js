module.exports = {
    title: "vuex-module-decorators",
    description: "Typescript/ES7 Decorators to make Vuex modules a breeze",
    themeConfig: {
        repo: "championswimmer/vuex-module-decorators",
        docsDir: "docs",
        editLinks: true,
        sidebar: [
            '/pages/installation',
            '/pages/overview',
            '/pages/getting-started',
            {
                title: 'Core Concepts',
                collapsable: false,
                children: [
                    '/pages/core/state',
                    '/pages/core/getters'
                ]
            },
        ]
    }
}