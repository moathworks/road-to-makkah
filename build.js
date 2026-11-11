/**
 * مُجمِّع المشروع (Zero-Dependency Static Builder)
 *
 * - يكتشف الدول الفعّالة تلقائياً من data/countries/*.js (ملف واحد لكل دولة).
 * - يبني سلسلة المسار من distanceFromPrevKm فقط، ويشتق منها: المسافة المتبقية، نقاط GPS،
 *   الوقود والزمن الصافي. لا تُكتب أي قيمة مشتقة يدوياً في ملفات البيانات.
 * - يتحقق من البيانات ويفشل البناء عند أي تناقض.
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
const { renderCountryPage } = require('./templates/country');
const { renderComingSoonPage } = require('./templates/coming-soon');
const { renderHomePage } = require('./templates/home');
const { renderServiceWorker } = require('./templates/sw');

const COUNTRIES_DIR = path.join(__dirname, 'data', 'countries');

// المسارات التي يُعدّ تغيّرها «تحديثاً للمحتوى» (لحساب تاريخ آخر تحديث)
const CONTENT_PATHS = ['data', 'templates', 'css', 'js', 'assets', 'manifest.json'];

// هامش السماح عند مقارنة المسافة المستقيمة بمسافة الطريق (المسافات المعروضة تقريبية «~»)
const STRAIGHT_LINE_TOLERANCE = 1.03;

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

function formatArabicDate(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Intl.DateTimeFormat('ar-u-nu-latn-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' })
        .format(new Date(y, m - 1, d));
}

/* ---------- التحقق من البيانات ---------- */

function validateStation(station, label) {
    if (!station.title || typeof station.title !== 'string') fail(`${label}: المحطة تفتقر إلى الاسم (title).`);
    if (!station.desc || typeof station.desc !== 'string') fail(`${label} (${station.title}): المحطة تفتقر إلى الوصف (desc).`);
    if (!station.mapUrl || !/^https?:\/\//.test(station.mapUrl)) fail(`${label} (${station.title}): رابط الخريطة غير صالح (${station.mapUrl}).`);

    const hasLat = station.lat !== undefined;
    const hasLon = station.lon !== undefined;
    if (hasLat !== hasLon) fail(`${label} (${station.title}): يجب تحديد lat و lon معاً أو حذفهما معاً.`);
    if (hasLat) validateCoords(station, `${label} (${station.title})`);
}

function validateCoords(point, label) {
    if (!hasCoords(point) || Number.isNaN(point.lat) || Number.isNaN(point.lon)) fail(`${label}: الإحداثيات (lat/lon) مفقودة أو غير رقمية.`);
    // نطاق شبه الجزيرة العربية والدول المجاورة: يلتقط الأخطاء الفادحة مثل تبديل lat و lon
    if (point.lat < 12 || point.lat > 38 || point.lon < 34 || point.lon > 60) fail(`${label}: الإحداثيات (${point.lat}, ${point.lon}) خارج النطاق الجغرافي المتوقع.`);
}

function validateSharedData() {
    Object.entries(shared.routeSegments).forEach(([segKey, stations]) => {
        if (!Array.isArray(stations) || stations.length === 0) fail(`المقطع المشترك (${segKey}) فارغ.`);
        stations.forEach((st, idx) => validateStation(st, `shared.${segKey}[${idx}]`));
    });
    if (!shared.destination || typeof shared.destination.distanceFromPrevKm !== 'number') fail('shared.destination مفقود أو بلا distanceFromPrevKm.');
    validateCoords(shared.destination, 'shared.destination');
    if (!/^https:\/\/[^/]+/.test(shared.siteUrl) || shared.siteUrl.endsWith('/')) fail(`siteUrl غير صالح (${shared.siteUrl}): يجب أن يبدأ بـ https وألا ينتهي بـ /.`);
    if (/\.(test|local|localhost)(\/|$)/.test(shared.siteUrl)) fail(`siteUrl (${shared.siteUrl}) نطاق محلي لا يصلح للنشر.`);
}

/**
 * يبني سلسلة المسار الكاملة لدولة: الانطلاق ← محطات الذهاب ← المقطع المشترك ← مكة.
 * كل مقطع يحمل distanceFromPrevKm، ومنها تُشتق كل القيم الأخرى.
 */
function buildRouteChain(country) {
    const label = `الدولة (${country.slug})`;

    const legs = [
        ...country.outboundStations.map((st, idx) => {
            if (typeof st.distanceFromPrevKm !== 'number' || st.distanceFromPrevKm <= 0) {
                fail(`${label}: محطة الذهاب [${idx}] (${st.title}) بلا distanceFromPrevKm صالحة.`);
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

    // الرقم المكتوب في شارة المحطة «تبعد ~N كم» يجب أن يطابق distanceFromPrevKm
    legs.forEach((leg) => {
        const badgeKm = leg.badge && leg.badge.match(/~\s*(\d+)\s*كم/);
        if (badgeKm && Number(badgeKm[1]) !== leg.distanceFromPrevKm) {
            fail(`${label}: شارة المحطة (${leg.title}) تذكر ~${badgeKm[1]} كم بينما distanceFromPrevKm = ${leg.distanceFromPrevKm}.`);
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
            fail(`${label}: المسافة المستقيمة بين (${prev.name}) و(${curr.name}) = ${Math.round(straightKm)} كم أكبر من مسافة الطريق المدخلة (${roadKm} كم). راجع الإحداثيات أو distanceFromPrevKm.`);
        }
    }

    return gpsPoints;
}

function formatDriveTime(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `${h} ساعة و ${m} دقيقة`;
    if (h > 0) return `${h} ساعة`;
    return `${m} دقيقة`;
}

function validateCountryData(country, fileName) {
    const requiredStrings = ['slug', 'countryCode', 'countryName', 'defaultCity', 'flagFile', 'themeColor', 'themeColorRgb', 'themeColorDark', 'nationalIdLabel', 'emergencyNumber', 'metaDescription', 'pageTitle'];
    for (const key of requiredStrings) {
        if (!country[key] || typeof country[key] !== 'string') fail(`ملف الدولة (${fileName}): الحقل النصي المطلوب (${key}) مفقود.`);
    }
    const label = `الدولة (${country.slug})`;

    if (!Number.isInteger(country.totalDistanceKm) || country.totalDistanceKm <= 0) fail(`${label}: المسافة الكلية (totalDistanceKm) غير صالحة.`);
    if (typeof country.estimatedDriveHours !== 'number' || country.estimatedDriveHours <= 0) fail(`${label}: ساعات الرحلة (estimatedDriveHours) غير صالحة.`);
    // الزمن الشامل للتوقفات لا يصح أن يقل عن الزمن الصافي (100 كم/س)
    if (country.estimatedDriveHours < country.totalDistanceKm / 100) fail(`${label}: estimatedDriveHours (${country.estimatedDriveHours}) أقل من زمن القيادة الصافي (${(country.totalDistanceKm / 100).toFixed(1)} ساعة).`);

    if (!country.origin || !country.origin.name) fail(`${label}: نقطة الانطلاق (origin) مفقودة.`);
    validateCoords(country.origin, `${label}.origin`);

    if (!Array.isArray(country.outboundStations) || country.outboundStations.length === 0) fail(`${label}: قائمة محطات الذهاب فارغة.`);
    if (!Array.isArray(country.returnStations) || country.returnStations.length === 0) fail(`${label}: قائمة محطات العودة فارغة.`);
    country.outboundStations.forEach((st, idx) => validateStation(st, `${country.slug}.outboundStations[${idx}]`));
    country.returnStations.forEach((st, idx) => validateStation(st, `${country.slug}.returnStations[${idx}]`));

    if (!Array.isArray(country.routes) || country.routes.length === 0) fail(`${label}: لا توجد مسارات معرفة.`);
    if (country.routes[0].distanceKm !== country.totalDistanceKm) {
        fail(`${label}: مسافة المسار الرئيسي (${country.routes[0].distanceKm}) لا تطابق المسافة الكلية (${country.totalDistanceKm}).`);
    }
    if (!fs.existsSync(path.join(__dirname, 'assets', 'images', country.flagFile))) fail(`${label}: ملف العلم (${country.flagFile}) غير موجود في assets/images.`);
}

/** القيم المشتقة لصفحة الدولة: تُحسب هنا ولا تُكتب في ملفات البيانات */
function deriveCountryValues(country) {
    const gpsPoints = buildRouteChain(country);
    const liters = (country.totalDistanceKm * shared.defaultFuelRate) / 100;
    return {
        gpsPoints,
        fuelLitersText: liters.toFixed(1),
        fuelCostSar: Math.round(liters * shared.defaultFuelPrice),
        netDriveTimeText: formatDriveTime(Math.round((country.totalDistanceKm / 100) * 60))
    };
}

function loadActiveCountries() {
    const files = fs.readdirSync(COUNTRIES_DIR).filter(f => f.endsWith('.js')).sort();
    const bySlug = new Map();
    for (const file of files) {
        const country = require(path.join(COUNTRIES_DIR, file));
        validateCountryData(country, file);
        if (bySlug.has(country.slug)) fail(`الـ slug (${country.slug}) مكرر في أكثر من ملف دولة.`);
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
        for (const key of ['countryName', 'flagFile', 'pageTitle', 'heading']) {
            if (!entry[key]) fail(`الدولة (${entry.slug}) ليس لها ملف في data/countries وينقصها الحقل (${key}) لصفحة «قريباً».`);
        }
        return { slug: entry.slug, name: entry.countryName, flag: entry.flagFile, active: false, page: entry };
    });

    for (const slug of activeBySlug.keys()) {
        if (!seen.has(slug)) fail(`الدولة (${slug}) لها ملف بيانات لكنها غير مدرجة في countriesOrder (data/site.js).`);
    }
    return entries;
}

/* ---------- ملفات الأرشفة ---------- */

function renderSitemapXml(siteUrl, activeCountries, lastUpdatedIso) {
    const urls = [
        { loc: `${siteUrl}/`, priority: '1.0' },
        ...activeCountries.map(c => ({ loc: `${siteUrl}/${c.slug}/`, priority: '0.9' }))
    ];
    const itemsXml = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastUpdatedIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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

    const lastUpdatedIso = getLastUpdatedIso();
    const ctx = {
        assetHashes: {
            styleCss: getFileHash('css/style.css'),
            homeCss: getFileHash('css/home.css'),
            appJs: getFileHash('js/app.js')
        },
        lastUpdatedText: formatArabicDate(lastUpdatedIso),
        activeCountries
    };

    const pages = [];
    pages.push(['index.html', renderHomePage(shared, siteCountries, ctx)]);
    for (const entry of siteCountries) {
        const html = entry.active
            ? renderCountryPage(entry.country, shared, { ...ctx, derived: deriveCountryValues(entry.country) })
            : renderComingSoonPage(entry.page, shared, ctx);
        pages.push([`${entry.slug}/index.html`, html]);
    }
    pages.forEach(([relPath, html]) => writeOutput(relPath, html));
    console.log(`✅ Built ${pages.length} pages (${activeCountries.length} active countries) — آخر تحديث: ${ctx.lastUpdatedText}`);

    writeOutput('sitemap.xml', renderSitemapXml(shared.siteUrl, activeCountries, lastUpdatedIso));
    console.log('✅ Built sitemap.xml');

    const imageFiles = fs.readdirSync(path.join(__dirname, 'assets/images'))
        .filter(f => /\.(png|svg|jpg|jpeg|webp)$/i.test(f))
        .sort()
        .map(f => `./assets/images/${f}`);

    const coreAssets = [
        './',
        './index.html',
        './manifest.json',
        `./css/style.css?v=${ctx.assetHashes.styleCss}`,
        `./css/home.css?v=${ctx.assetHashes.homeCss}`,
        `./js/app.js?v=${ctx.assetHashes.appJs}`,
        ...activeCountries.flatMap(c => [`./${c.slug}/`, `./${c.slug}/index.html`]),
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
}

buildAll();
