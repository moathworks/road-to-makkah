/**
 * قالب ملف manifest.json لكل لغة (يُولَّد في جذر الموقع للعربية وفي en/ للإنجليزية).
 * نطاق التطبيق (scope) هو جذر الموقع في اللغتين، فيبقى التنقل بين اللغتين داخل التطبيق المثبّت.
 */

const { LANG_META, makeT, pagePath, rootPrefix } = require('./helpers');

const ICONS = [
    { file: 'icon-192.png', sizes: '192x192', purpose: 'any' },
    { file: 'icon-512.png', sizes: '512x512', purpose: 'any' },
    { file: 'icon-maskable-512.png', sizes: '512x512', purpose: 'maskable' }
];

function renderManifest(lang) {
    const t = makeT(lang);
    const root = rootPrefix(pagePath(null, lang));
    const manifest = {
        name: t('site.name'),
        short_name: t('manifest.shortName'),
        description: t('manifest.description'),
        start_url: './',
        scope: root,
        display: 'standalone',
        dir: LANG_META[lang].dir,
        lang,
        background_color: '#121212',
        theme_color: '#121212',
        icons: ICONS.map(icon => ({
            src: `${root}assets/images/${icon.file}`,
            sizes: icon.sizes,
            type: 'image/png',
            purpose: icon.purpose
        }))
    };
    return `${JSON.stringify(manifest, null, 2)}\n`;
}

module.exports = {
    renderManifest
};
