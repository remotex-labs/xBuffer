/**
 * Imports
 */

import { defineVersionedConfig } from '@viteplus/versions';

/**
 * Doc config
 */

export default defineVersionedConfig({
    title: 'xBuffer',
    base: '/xBuffer/',
    description: 'A library with Node.js Buffer api for the browser',
    head: [
        [ 'link', { rel: 'icon', type: 'image/png', href: '/xBuffer/logo.png' }],
        [ 'meta', { name: 'theme-color', content: '#ff7e17' }],
        [ 'script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-ZL5X4BWS6C' }],
        [
            'script', {},
            'window.dataLayer = window.dataLayer || [];function gtag(){ dataLayer.push(arguments); }gtag(\'js\', new Date());gtag(\'config\', \'G-ZL5X4BWS6C\');'
        ]
    ],
    versionsConfig: {
        current: 'v1.0.1',
        versionSwitcher: false
    },
    themeConfig: {
        logo: '/logo.png',

        search: {
            provider: 'local'
        },

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide' },
            { component: 'VersionSwitcher' }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/remotex-labs/xBuffer' },
            { icon: 'npm', link: 'https://www.npmjs.com/package/@remotex-labs/xbuffer' }
        ],

        docFooter: {
            prev: false,
            next: false
        },

        footer: {
            message: 'Released under the Mozilla Public License 2.0',
            copyright: `Copyright © ${ new Date().getFullYear() } @remotex-labs/xbuffer Contributors`
        }
    }
});
