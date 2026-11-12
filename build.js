/**
 * مُجمِّع المشروع (Zero-Dependency Static Builder)
 *
 * - يكتشف الدول الفعّالة تلقائياً من data/countries/*.js (ملف واحد لكل دولة).
 * - يبني كل صفحة بلغتين: العربية في جذر الموقع، والإنجليزية تحت en/.
 * - يبني سلسلة المسار من distanceFromPrevKm فقط، ويشتق منها: المسافة المتبقية، نقاط GPS،
 *   الوقود والزمن الصافي. لا تُكتب أي قيمة مشتقة يدوياً في ملفات البيانات.
 * - يتحقق من البيانات (ومن اكتمال الترجمة) ويفشل البناء عند أي تناقض.
 * - يحسب بصمات الملفات، ويولّد صفحات HTML و sw.js و sitemap.xml.
 *   (لا يُولَّد robots.txt: الموقع على مسار فرعي في GitHub Pages، ومحركات البحث لا تقرأ
 *   robots.txt إلا من جذر النطاق. تُرسَل خريطة الموقع عبر Google Search Console.)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const shared = require('./data/shared');
const { countriesOrder } = require('./data/site');
const { LANGS, tr, makeT, pagePath } = require('./templates/helpers');
const { renderCountryPage } = require('./templates/country');
const { renderComingSoonPage } = require('./templates/coming-soon');
const { renderHomePage } = require('./templates/home');
const { renderServiceWorker } = require('./templates/sw');

const COUNTRIES_DIR = path.join(__dirname, 'data', 'countries');

// المسارات التي يُعدّ تغيّرها «تحديثاً للمحتوى» (لحساب تاريخ آخر تحديث)
const CONTENT_PATHS = ['data', 'templates', 'css', 'js', 'assets', 'manifest.json'];

// هامش السماح عند مقارنة المسافة المستقيمة بمسافة الطريق (المسافات المعروضة تقريبية «~»)
const STRAIGHT_LINE_TOLERANCE = 1.03;

// صيغة المسافة داخل شارة المحطة في كل لغة: «~90 كم» / «~90 km»
const BADGE_KM_PATTERN = { ar: /~\s*(\d+)\s*كم/, en: /~\s*(\d+)\s*km/ };

function fail(message) {
    throw new Error(`[Validation Error] ${message}`);
}

function sha256Short(content) {
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
}

function getFileHash(relPath) {
    return sha256Short(fs.readFileSync(path.join(__dirname, relPath)));
}

function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = Math.PI / 180;
    const a = Math.sin((lat2 - lat1) * toRad / 2) ** 2 +
        Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin((lon2 - lon1) * toRad / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function hasCoords(point) {
    return typeof point.lat === 'number' && typeof point.lon === 'number';
}

/* ---------- تاريخ آخر تحديث (آلي) ---------- */

function toIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * تاريخ آخر إيداع غيّر المحتوى. وإن وُجدت تعديلات غير مودعة على المحتوى فالتاريخ هو اليوم.
 * بهذا لا يتغيّر التاريخ (ولا الملفات المولّدة) عند إعادة البناء دون تغيير فعلي.
 */
function getLastUpdatedIso() {
    const git = (args) => execSync(`git ${args} -- ${CONTENT_PATHS.join(' ')}`, {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
    }).trim();

    try {
        if (!git('status --porcelain')) {
            const lastCommitDate = git('log -1 --format=%cs');
            if (/^\d{4}-\d{2}-\d{2}$/.test(lastCommitDate)) return lastCommitDate;
        }
    } catch (e) {
        // git غير متاح: نستخدم تاريخ اليوم
    }
    return toIsoDate(new Date());
}

function formatDate(isoDate, lang) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const locale = lang === 'ar' ? 'ar-u-nu-latn-ca-gregory' : 'en-GB';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
}

/* ---------- التحقق من البيانات ---------- */

/** هل للنص ترجمة غير فارغة بهذه اللغة؟ */
function hasLang(value, lang) {
    return typeof value[lang] === 'string' && Boolean(value[lang].trim());
}

/**
 * نص معروض بصيغة { ar, en }: العربية إلزامية. الترجمة الناقصة لا توقف البناء،
 * بل يُعرض النص العربي مكانها ويُطبع تنبيه في نهاية البناء لتكملتها لاحقاً.
 */
const missingTranslations = [];
function requireBilingual(value, label) {
    if (!value || typeof value !== 'object') fail(`${label}: يجب أن يكون النص بصيغة { ar, en }.`);
    if (!hasLang(value, 'ar')) fail(`${label}: النص العربي مفقود.`);
    LANGS.forEach((lang) => {
        if (!hasLang(value, lang)) missingTranslations.push(`${label} [${lang}]`);
    });
}

function validateCoords(point, label) {
    if (!hasCoords(point) || Number.isNaN(point.lat) || Number.isNaN(point.lon)) fail(`${label}: الإحداثيات (lat/lon) مفقودة أو غير رقمية.`);
    // نطاق شبه الجزيرة العربية والدول المجاورة: يلتقط الأخطاء الفادحة مثل تبديل lat و lon
    if (point.lat < 12 || point.lat > 38 || point.lon < 34 || point.lon > 60) fail(`${label}: الإحداثيات (${point.lat}, ${point.lon}) خارج النطاق الجغرافي المتوقع.`);
}

function validateStation(station, label) {
    requireBilingual(station.title, `${label}.title`);
    const name = station.title.ar;
    requireBilingual(station.desc, `${label} (${name}).desc`);
    ['badge', 'gpsName', 'btnLabel'].forEach((key) => {
        if (station[key] !== undefined) requireBilingual(station[key], `${label} (${name}).${key}`);
    });
    if (!station.mapUrl || !/^https?:\/\//.test(station.mapUrl)) fail(`${label} (${name}): رابط الخريطة غير صالح (${station.mapUrl}).`);

    const hasLat = station.lat !== undefined;
    const hasLon = station.lon !== undefined;
    if (hasLat !== hasLon) fail(`${label} (${name}): يجب تحديد lat و lon معاً أو حذفهما معاً.`);
    if (hasLat) validateCoords(station, `${label} (${name})`);
}

function validateApp(app, label) {
    requireBilingual(app.title, `${label}.title`);
    requireBilingual(app.desc, `${label}.desc`);
    ['ariaName', 'webAriaLabel'].forEach((key) => {
        if (app[key] !== undefined) requireBilingual(app[key], `${label}.${key}`);
    });
    if (!app.iconEmoji && !app.iconSrc) fail(`${label}: التطبيق بلا أيقونة (iconEmoji أو iconSrc).`);
    if (app.iconSrc && !fs.existsSync(path.join(__dirname, app.iconSrc))) fail(`${label}: ملف الأيقونة (${app.iconSrc}) غير موجود.`);
}

function validateSharedData() {
    Object.entries(shared.routeSegments).forEach(([segKey, stations]) => {
        if (!Array.isArray(stations) || stations.length === 0) fail(`المقطع المشترك (${segKey}) فارغ.`);
        stations.forEach((st, idx) => validateStation(st, `shared.${segKey}[${idx}]`));
    });
    if (!shared.destination || typeof shared.destination.distanceFromPrevKm !== 'number') fail('shared.destination مفقود أو بلا distanceFromPrevKm.');
    requireBilingual(shared.destination.name, 'shared.destination.name');
    validateCoords(shared.destination, 'shared.destination');

    shared.sharedApps.forEach((app, idx) => validateApp(app, `shared.sharedApps[${idx}]`));
    shared.checklistGroups.forEach((group, g) => {
        requireBilingual(group.title, `shared.checklistGroups[${g}].title`);
        group.items.forEach((item) => { if (!item.labelKey) requireBilingual(item.label, `checklist (${item.id})`); });
    });
    shared.pilgrimTips.forEach((tip, idx) => {
        requireBilingual(tip.title, `shared.pilgrimTips[${idx}].title`);
        if (!tip.textKey) requireBilingual(tip.text, `shared.pilgrimTips[${idx}].text`);
        if (tip.group !== 'road' && tip.group !== 'city') fail(`shared.pilgrimTips[${idx}]: الحقل group يجب أن يكون 'road' أو 'city'.`);
    });
    shared.places.forEach((group, g) => {
        requireBilingual(group.city, `shared.places[${g}].city`);
        group.items.forEach((place, idx) => requireBilingual(place.name, `shared.places[${g}].items[${idx}].name`));
    });

    if (!/^https:\/\/[^/]+/.test(shared.siteUrl) || shared.siteUrl.endsWith('/')) fail(`siteUrl غير صالح (${shared.siteUrl}): يجب أن يبدأ بـ https وألا ينتهي بـ /.`);
    if (/\.(test|local|localhost)(\/|$)/.test(shared.siteUrl)) fail(`siteUrl (${shared.siteUrl}) نطاق محلي لا يصلح للنشر.`);
}

/**
 * يبني سلسلة المسار الكاملة لدولة: الانطلاق ← محطات الذهاب ← المقطع المشترك ← مكة.
 * كل مقطع يحمل distanceFromPrevKm، ومنها تُشتق كل القيم الأخرى.
 * يعيد نقاط GPS بأسماء ثنائية اللغة.
 */
function buildRouteChain(country) {
    const label = `الدولة (${country.slug})`;

    const legs = [
        ...country.outboundStations.map((st, idx) => {
            if (typeof st.distanceFromPrevKm !== 'number' || st.distanceFromPrevKm <= 0) {
                fail(`${label}: محطة الذهاب [${idx}] (${st.title.ar}) بلا distanceFromPrevKm صالحة.`);
            }
            return st;
        }),
        ...shared.routeSegments.riyadhToMakkah.filter(st => typeof st.distanceFromPrevKm === 'number'),
        shared.destination
    ];

    const sumKm = legs.reduce((acc, leg) => acc + leg.distanceFromPrevKm, 0);
    if (sumKm !== country.totalDistanceKm) {
        fail(`${label}: مجموع مقاطع المسار (${sumKm} كم) لا يطابق المسافة الكلية totalDistanceKm (${country.totalDistanceKm} كم).`);
    }

    // الرقم المكتوب في شارة المحطة («تبعد ~N كم» / «~N km») يجب أن يطابق distanceFromPrevKm في اللغتين
    legs.forEach((leg) => {
        if (!leg.badge) return;
        LANGS.filter(lang => hasLang(leg.badge, lang)).forEach((lang) => {
            const badgeKm = leg.badge[lang].match(BADGE_KM_PATTERN[lang]);
            if (badgeKm && Number(badgeKm[1]) !== leg.distanceFromPrevKm) {
                fail(`${label}: شارة المحطة (${leg.title.ar}) [${lang}] تذكر ~${badgeKm[1]} بينما distanceFromPrevKm = ${leg.distanceFromPrevKm}.`);
            }
        });
        if (hasLang(leg.badge, 'en') && Boolean(leg.badge.ar.match(BADGE_KM_PATTERN.ar)) !== Boolean(leg.badge.en.match(BADGE_KM_PATTERN.en))) {
            fail(`${label}: شارة المحطة (${leg.title.ar}) تذكر المسافة في لغة دون الأخرى.`);
        }
    });

    // نقاط GPS: كل نقطة في السلسلة لها إحداثيات، مع المسافة المتبقية المحسوبة
    const gpsPoints = [{ km: sumKm, name: country.origin.name, lat: country.origin.lat, lon: country.origin.lon }];
    let remainingKm = sumKm;
    legs.forEach((leg) => {
        remainingKm -= leg.distanceFromPrevKm;
        if (hasCoords(leg)) {
            gpsPoints.push({ km: remainingKm, name: leg.gpsName || leg.name || leg.title, lat: leg.lat, lon: leg.lon });
        }
    });

    // المسافة المستقيمة بين نقطتين متتاليتين لا يمكن أن تتجاوز مسافة الطريق بينهما
    for (let i = 1; i < gpsPoints.length; i++) {
        const prev = gpsPoints[i - 1];
        const curr = gpsPoints[i];
        const roadKm = prev.km - curr.km;
        const straightKm = haversineKm(prev.lat, prev.lon, curr.lat, curr.lon);
        if (straightKm > roadKm * STRAIGHT_LINE_TOLERANCE) {
            fail(`${label}: المسافة المستقيمة بين (${prev.name.ar}) و(${curr.name.ar}) = ${Math.round(straightKm)} كم أكبر من مسافة الطريق المدخلة (${roadKm} كم). راجع الإحداثيات أو distanceFromPrevKm.`);
        }
    }

    return gpsPoints;
}

function formatDriveTime(totalMinutes, lang) {
    const t = makeT(lang);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return t('js.timeHM', { h, m });
    if (h > 0) return t('js.timeH', { h });
    return t('js.timeM', { m });
}

function validateCountryData(country, fileName) {
    ['slug', 'countryCode', 'flagFile', 'themeColor', 'themeColorRgb', 'themeColorDark', 'emergencyNumber'].forEach((key) => {
        if (!country[key] || typeof country[key] !== 'string') fail(`ملف الدولة (${fileName}): الحقل النصي المطلوب (${key}) مفقود.`);
    });
    const label = `الدولة (${country.slug})`;
    ['countryName', 'defaultCity', 'nationalIdLabel', 'metaDescription', 'pageTitle', 'printHeaderTitle', 'printHeaderSubtitle',
        'headerSubtitle', 'camelWarningText', 'outboundSummaryTitle', 'returnSummaryTitle', 'returnIntroText'].forEach((key) => {
        requireBilingual(country[key], `${label}.${key}`);
    });

    if (!Number.isInteger(country.totalDistanceKm) || country.totalDistanceKm <= 0) fail(`${label}: المسافة الكلية (totalDistanceKm) غير صالحة.`);
    if (typeof country.estimatedDriveHours !== 'number' || country.estimatedDriveHours <= 0) fail(`${label}: ساعات الرحلة (estimatedDriveHours) غير صالحة.`);
    // الزمن الشامل للتوقفات لا يصح أن يقل عن الزمن الصافي (100 كم/س)
    if (country.estimatedDriveHours < country.totalDistanceKm / 100) fail(`${label}: estimatedDriveHours (${country.estimatedDriveHours}) أقل من زمن القيادة الصافي (${(country.totalDistanceKm / 100).toFixed(1)} ساعة).`);

    if (!country.origin) fail(`${label}: نقطة الانطلاق (origin) مفقودة.`);
    requireBilingual(country.origin.name, `${label}.origin.name`);
    validateCoords(country.origin, `${label}.origin`);

    if (!Array.isArray(country.outboundStations) || country.outboundStations.length === 0) fail(`${label}: قائمة محطات الذهاب فارغة.`);
    if (!Array.isArray(country.returnStations) || country.returnStations.length === 0) fail(`${label}: قائمة محطات العودة فارغة.`);
    country.outboundStations.forEach((st, idx) => validateStation(st, `${country.slug}.outboundStations[${idx}]`));
    country.returnStations.forEach((st, idx) => validateStation(st, `${country.slug}.returnStations[${idx}]`));
    (country.extraApps || []).forEach((app, idx) => validateApp(app, `${country.slug}.extraApps[${idx}]`));

    if (!Array.isArray(country.routes) || country.routes.length === 0) fail(`${label}: لا توجد مسارات معرفة.`);
    country.routes.forEach((route, idx) => {
        ['title', 'itinerary', 'description'].forEach(key => requireBilingual(route[key], `${label}.routes[${idx}].${key}`));
    });
    if (country.routes[0].distanceKm !== country.totalDistanceKm) {
        fail(`${label}: مسافة المسار الرئيسي (${country.routes[0].distanceKm}) لا تطابق المسافة الكلية (${country.totalDistanceKm}).`);
    }
    if (!fs.existsSync(path.join(__dirname, 'assets', 'images', country.flagFile))) fail(`${label}: ملف العلم (${country.flagFile}) غير موجود في assets/images.`);
}

/** القيم المشتقة لصفحة الدولة بلغة معيّنة: تُحسب هنا ولا تُكتب في ملفات البيانات */
function deriveCountryValues(country, gpsPoints, lang) {
    const liters = (country.totalDistanceKm * shared.defaultFuelRate) / 100;
    return {
        gpsPoints: gpsPoints.map(p => ({ km: p.km, name: tr(p.name, lang), lat: p.lat, lon: p.lon })),
        fuelLitersText: liters.toFixed(1),
        fuelCostSar: Math.round(liters * shared.defaultFuelPrice),
        netDriveTimeText: formatDriveTime(Math.round((country.totalDistanceKm / 100) * 60), lang)
    };
}

function loadActiveCountries() {
    const files = fs.readdirSync(COUNTRIES_DIR).filter(f => f.endsWith('.js')).sort();
    const bySlug = new Map();
    for (const file of files) {
        const country = require(path.join(COUNTRIES_DIR, file));
        validateCountryData(country, file);
        if (bySlug.has(country.slug)) fail(`الـ slug (${country.slug}) مكرر في أكثر من ملف دولة.`);
        if (LANGS.includes(country.slug)) fail(`الـ slug (${country.slug}) محجوز لمسار اللغة.`);
        bySlug.set(country.slug, country);
    }
    return bySlug;
}

/**
 * يوحّد قائمة الدول: كل slug يُبنى مرة واحدة فقط، إما دليلاً كاملاً (إن كان له ملف بيانات)
 * أو صفحة «قريباً». فلا يمكن أن تُكتب صفحة «قريباً» فوق دليل دولة فعّالة.
 */
function resolveSiteCountries(activeBySlug) {
    const seen = new Set();
    const entries = countriesOrder.map((entry) => {
        if (!entry.slug) fail('عنصر في countriesOrder بلا slug.');
        if (seen.has(entry.slug)) fail(`الـ slug (${entry.slug}) مكرر في countriesOrder.`);
        seen.add(entry.slug);

        const active = activeBySlug.get(entry.slug);
        if (active) {
            return { slug: entry.slug, name: active.countryName, flag: active.flagFile, active: true, country: active };
        }
        requireBilingual(entry.countryName, `countriesOrder (${entry.slug}).countryName`);
        if (entry.heading !== undefined) requireBilingual(entry.heading, `countriesOrder (${entry.slug}).heading`);
        if (!entry.flagFile) fail(`الدولة (${entry.slug}) ليس لها ملف في data/countries وينقصها flagFile لصفحة «قريباً».`);
        return { slug: entry.slug, name: entry.countryName, flag: entry.flagFile, active: false, page: entry };
    });

    for (const slug of activeBySlug.keys()) {
        if (!seen.has(slug)) fail(`الدولة (${slug}) لها ملف بيانات لكنها غير مدرجة في countriesOrder (data/site.js).`);
    }
    return entries;
}

/* ---------- خريطة الموقع ---------- */

function renderSitemapXml(siteUrl, activeCountries, lastUpdatedIso) {
    // لكل صفحة مفهرسة نسختاها اللغويتان، مع روابط hreflang المتبادلة
    const slugs = [null, ...activeCountries.map(c => c.slug)];
    const itemsXml = slugs.flatMap(slug => LANGS.map((lang) => {
        const alternates = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${pagePath(slug, l)}"/>`).join('\n');
        return `  <url>
    <loc>${siteUrl}/${pagePath(slug, lang)}</loc>
${alternates}
    <lastmod>${lastUpdatedIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${slug ? '0.9' : '1.0'}</priority>
  </url>`;
    })).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${itemsXml}
</urlset>
`;
}

/* ---------- البناء ---------- */

function writeOutput(relPath, content) {
    const outPath = path.join(__dirname, relPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content, 'utf8');
}

function buildAll() {
    validateSharedData();
    const activeBySlug = loadActiveCountries();
    const siteCountries = resolveSiteCountries(activeBySlug);
    const activeCountries = siteCountries.filter(c => c.active).map(c => c.country);
    const routeChains = new Map(activeCountries.map(c => [c.slug, buildRouteChain(c)]));

    const lastUpdatedIso = getLastUpdatedIso();
    const assetHashes = {
        styleCss: getFileHash('css/style.css'),
        homeCss: getFileHash('css/home.css'),
        appJs: getFileHash('js/app.js')
    };

    const pages = [];
    for (const lang of LANGS) {
        const ctx = { lang, assetHashes, activeCountries, lastUpdatedText: formatDate(lastUpdatedIso, lang) };
        pages.push([`${pagePath(null, lang)}index.html`, renderHomePage(shared, siteCountries, ctx)]);
        for (const entry of siteCountries) {
            const html = entry.active
                ? renderCountryPage(entry.country, shared, { ...ctx, derived: deriveCountryValues(entry.country, routeChains.get(entry.slug), lang) })
                : renderComingSoonPage(entry.page, shared, ctx);
            pages.push([`${pagePath(entry.slug, lang)}index.html`, html]);
        }
    }
    pages.forEach(([relPath, html]) => writeOutput(relPath, html));
    console.log(`✅ Built ${pages.length} pages (${activeCountries.length} active countries × ${LANGS.length} languages) — آخر تحديث: ${formatDate(lastUpdatedIso, 'ar')}`);

    writeOutput('sitemap.xml', renderSitemapXml(shared.siteUrl, activeCountries, lastUpdatedIso));
    console.log('✅ Built sitemap.xml');

    const imageFiles = fs.readdirSync(path.join(__dirname, 'assets/images'))
        .filter(f => /\.(png|svg|jpg|jpeg|webp)$/i.test(f))
        .sort()
        .map(f => `./assets/images/${f}`);

    // الصفحات المخزّنة للعمل دون اتصال: الرئيسية وأدلة الدول الفعّالة باللغتين
    const offlinePages = LANGS.flatMap(lang => [null, ...activeCountries.map(c => c.slug)].flatMap((slug) => {
        const p = pagePath(slug, lang);
        return [`./${p}`, `./${p}index.html`];
    }));

    const coreAssets = [
        ...offlinePages,
        './manifest.json',
        `./css/style.css?v=${assetHashes.styleCss}`,
        `./css/home.css?v=${assetHashes.homeCss}`,
        `./js/app.js?v=${assetHashes.appJs}`,
        ...imageFiles
    ];

    // اسم الكاش يتغيّر مع أي تغيير في الصفحات أو الملفات الثابتة، فيُحدَّث المحتوى المخزّن للعمل دون اتصال
    const cacheHash = sha256Short(
        JSON.stringify(coreAssets) +
        pages.map(([, html]) => html).join('') +
        imageFiles.map(f => getFileHash(f)).join('') +
        getFileHash('manifest.json')
    );

    writeOutput('sw.js', renderServiceWorker(cacheHash, coreAssets));
    console.log(`✅ Built sw.js (cache: makkah-road-guide-${cacheHash})`);

    if (missingTranslations.length) {
        console.warn(`⚠️ ${missingTranslations.length} نص بلا ترجمة، عُرض مكانه النص العربي:`);
        missingTranslations.forEach(item => console.warn(`   - ${item}`));
    }
}

buildAll();
