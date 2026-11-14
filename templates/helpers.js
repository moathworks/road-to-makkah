/**
 * أدوات مشتركة بين القوالب: التهريب، الترجمة، مسارات الصفحات، ووسوم <head> الموحدة.
 */

const ui = require('../data/i18n');

const LANGS = ['ar', 'en'];
const DEFAULT_LANG = 'ar';
const LANG_META = {
    ar: { dir: 'rtl', ogLocale: 'ar_AR', switchLabel: 'ع', switchTitle: 'العربية' },
    en: { dir: 'ltr', ogLocale: 'en_US', switchLabel: 'EN', switchTitle: 'English' }
};

// أيقونة التبويب: إيموجي الكعبة بصيغة SVG (كما في التصميم الأصلي)
const FAVICON_DATA_URI = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%95%8B%3C%2Ftext%3E%3C%2Fsvg%3E';

const CHEVRON_SVG = `<svg class="chevron-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const PLAY_STORE_SVG = `<svg aria-hidden="true" focusable="false" viewBox="0 0 512 512" width="20" height="20"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>`;
const APP_STORE_SVG = `<svg aria-hidden="true" focusable="false" viewBox="0 0 384 512" width="20" height="20"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>`;
const EXTERNAL_LINK_SVG = `<svg aria-hidden="true" focusable="false" viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>`;
const APPS_GRID_SVG = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 0120.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`;

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

/**
 * قيمة نصية من البيانات: إما نص واحد (محايد لغوياً مثل الروابط والأرقام)
 * أو كائن { ar, en }. إن نقصت ترجمة لغة يُعرض النص العربي بدلاً منها.
 */
function tr(value, lang) {
    if (value === null || value === undefined) return value;
    if (typeof value !== 'object') return value;
    if (typeof value[lang] === 'string' && value[lang].trim()) return value[lang];
    if (typeof value[DEFAULT_LANG] === 'string' && value[DEFAULT_LANG].trim()) return value[DEFAULT_LANG];
    throw new Error(`[Validation Error] النص العربي مفقود: ${JSON.stringify(value).slice(0, 120)}`);
}

/** دالة ترجمة نصوص الواجهة من data/i18n.js، مع استبدال {متغيرات} */
function makeT(lang) {
    return (key, vars = {}) => {
        if (!ui[key]) throw new Error(`[Validation Error] مفتاح نص الواجهة غير معرّف في data/i18n.js: ${key}`);
        return tr(ui[key], lang).replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
    };
}

/** نصوص وقت التشغيل التي يحتاجها js/app.js (كل مفتاح يبدأ بـ js.) */
function runtimeStrings(lang) {
    const out = {};
    Object.keys(ui).filter(k => k.startsWith('js.')).forEach((k) => { out[k.slice(3)] = tr(ui[k], lang); });
    return out;
}

/** مسار الصفحة نسبةً لجذر الموقع: العربية في الجذر والإنجليزية تحت en/ */
function pagePath(slug, lang) {
    return (lang === DEFAULT_LANG ? '' : `${lang}/`) + (slug ? `${slug}/` : '');
}

/** بادئة الرجوع إلى جذر الموقع من صفحة بمسار معيّن */
function rootPrefix(path) {
    const depth = path.split('/').filter(Boolean).length;
    return depth === 0 ? './' : '../'.repeat(depth);
}

function otherLang(lang) {
    return lang === 'ar' ? 'en' : 'ar';
}

function jsonForScript(value) {
    // JSON داخل <script>: نهرّب «<» حتى لا يُغلق الوسم نصٌّ داخل البيانات
    return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * وسوم <head> المشتركة: الوصف، canonical، hreflang، Open Graph، الأيقونات، الخط.
 * options: { lang, slug, title, description, siteName, siteUrl, themeColor, robots, stylesheet, fontsStylesheet }
 * الخط مستضاف محلياً (css/fonts.css) ليُخزَّن للعمل دون اتصال، و manifest.json خاص بلغة الصفحة.
 */
function renderHead(options) {
    const { lang, slug, title, description, siteName, siteUrl, themeColor, robots, stylesheet, fontsStylesheet, extra = '' } = options;
    const path = pagePath(slug, lang);
    const root = rootPrefix(path);
    const canonicalUrl = `${siteUrl}/${path}`;
    // اسم الاختصار والتطبيق المثبّت (يقرؤه المتصفح بدل عنوان الصفحة الطويل)
    const appName = makeT(lang)('app.name');
    const ogImageUrl = `${siteUrl}/assets/images/kaaba.jpg`;
    const alternates = LANGS.map(l => `    <link rel="alternate" hreflang="${l}" href="${escapeHtml(`${siteUrl}/${pagePath(slug, l)}`)}">`).join('\n');

    return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="${escapeHtml(themeColor)}">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="application-name" content="${escapeHtml(appName)}">
    <meta name="apple-mobile-web-app-title" content="${escapeHtml(appName)}">${robots ? `\n    <meta name="robots" content="${escapeHtml(robots)}">` : ''}
    <meta name="description" content="${escapeHtml(description)}">
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
${alternates}
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(`${siteUrl}/${pagePath(slug, DEFAULT_LANG)}`)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${LANG_META[lang].ogLocale}">
    <meta property="og:locale:alternate" content="${LANG_META[otherLang(lang)].ogLocale}">
    <meta property="og:site_name" content="${escapeHtml(siteName)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:image" content="${escapeHtml(ogImageUrl)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1024">
    <meta property="og:image:height" content="1024">
    <meta property="og:image:alt" content="${escapeHtml(siteName)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}">
    <link rel="manifest" href="${root}${pagePath(null, lang)}manifest.json">
    <link rel="icon" href="${FAVICON_DATA_URI}">
    <link rel="apple-touch-icon" href="${root}assets/images/apple-touch-icon.png">
    <link rel="stylesheet" href="${root}${fontsStylesheet}">
    <link rel="stylesheet" href="${root}${stylesheet}">${extra}`;
}

/** رابط التبديل إلى اللغة الأخرى للصفحة نفسها */
function renderLangSwitch(slug, lang, className) {
    const target = otherLang(lang);
    const href = rootPrefix(pagePath(slug, lang)) + pagePath(slug, target);
    const meta = LANG_META[target];
    return `<a href="${escapeHtml(href)}" class="${className}" lang="${target}" hreflang="${target}" title="${meta.switchTitle}" aria-label="${meta.switchTitle}">${meta.switchLabel}</a>`;
}

module.exports = {
    LANGS,
    DEFAULT_LANG,
    LANG_META,
    CHEVRON_SVG,
    PLAY_STORE_SVG,
    APP_STORE_SVG,
    EXTERNAL_LINK_SVG,
    APPS_GRID_SVG,
    escapeHtml,
    formatNumber,
    tr,
    makeT,
    runtimeStrings,
    pagePath,
    rootPrefix,
    otherLang,
    jsonForScript,
    renderHead,
    renderLangSwitch
};
