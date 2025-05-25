import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    title: "JiuMu Docs",
    titleTemplate: 'JiuMu Docs - :title',
    description: "Jiumu Docs Site",
    head: [
        ['link', { rel: 'icon', href: '/favicon.svg' }]
    ],
    themeConfig: {

        logo: '/home-banner.svg',
        siteTitle: 'JiuMu Docs',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Docker', link: '/docker/README.md' },
        ],

        sidebar: {
            '/docker/': [
                {
                    text: 'Docker',
                    items: [
                        { text: '目录', link: '/docker/README.md' },
                        { text: '简介', link: '/docker/01-introduction.md' },
                        { text: '安装', link: '/docker/02-installation.md' },
                        { text: '基本命令', link: '/docker/03-basic-commands.md' },
                        { text: '镜像', link: '/docker/04-images.md' },
                        { text: '容器', link: '/docker/05-containers.md' },
                        { text: '网络', link: '/docker/06-network.md' },
                        { text: '卷', link: '/docker/07-volume.md' },
                        { text: 'compose', link: '/docker/08-compose.md' },
                        { text: 'Dockerfile', link: '/docker/09-dockerfile.md' },
                        { text: '最佳实践', link: '/docker/10-best-practices.md' },
                        { text: 'swarm', link: '/docker/11-swarm.md' },
                        { text: '命令参考', link: '/docker/12-commands-reference.md' }
                    ]
                }
            ],

        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
