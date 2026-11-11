/**
 * مُجمِّع المشروع (Zero-Dependency Static Builder)
 * يتحقق من صحة البيانات (Validation)، يحسب بصمات الملفات، ويولّد جميع صفحات HTML، sitemap.xml، robots.txt، وsw.js.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const shared = require('./data/shared');
const qaData = require('./data/countries/qa');
const bhData = require('./data/countries/bh');
const { upcomingPages, homeCountriesOrder } = require('./data/countries/upcoming');
const { renderCountryPage } = require('./templates/country');
const { renderComingSoonPage } = require('./templates/coming-soon');
const { renderHomePage } = require('./templates/home');
const { renderServiceWorker } = require('./templates/sw');

const ACTIVE_COUNTRIES = [qaData, bhData];

function getFileHash(relPath) {
    const fullPath = path.join(__dirname, relPath);
    const content = fs.readFileSync(fullPath);
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
}

function validateStation(station, contextLabel) {
    if (!station.title || typeof station.title !== 'string') {
        throw new Error(`[Validation Error] ${contextLabel}: المحطة تفتقر إلى الاسم (title).`);
    }
    if (!station.desc || typeof station.desc !== 'string') {
        throw new Error(`[Validation Error] ${contextLabel} (${station.title}): المحطة تفتقر إلى الوصف (desc).`);
    }
    if (!station.mapUrl || !/^https?:\/\//.test(station.mapUrl)) {
        throw new Error(`[Validation Error] ${contextLabel} (${station.title}): رابط الخريطة غير صالح (${station.mapUrl}).`);
    }
    if (typeof station.lat !== 'number' || typeof station.lon !== 'number' || Number.isNaN(station.lat) || Number.isNaN(station.lon)) {
        throw new Error(`[Validation Error] ${contextLabel} (${station.title}): إحداثيات المحطة (lat/lon) مفقودة أو غير رقمية.`);
    }
}

function validateSharedData(sharedData) {
    Object.entries(sharedData.routeSegments).forEach(([segKey, stations]) => {
        if (!Array.isArray(stations) || stations.length === 0) {
            throw new Error(`[Validation Error] المقطع المشترك (${segKey}) فارغ.`);
        }
        stations.forEach((st, idx) => validateStation(st, `shared.${segKey}[${idx}]`));
    });
}

function validateCountryData(country) {
    const requiredStrings = ['slug', 'countryCode', 'countryName', 'flagFile', 'themeColor', 'themeColorRgb', 'themeColorDark', 'locale', 'nationalIdLabel', 'emergencyNumber', 'metaDescription', 'pageTitle'];
    for (const key of requiredStrings) {
        if (!country[key] || typeof country[key] !== 'string') {
            throw new Error(`[Validation Error] الدولة (${country.slug || 'unknown'}): الحقل النصي المطلوب (${key}) مفقود.`);
        }
    }
    if (typeof country.totalDistanceKm !== 'number' || country.totalDistanceKm <= 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): المسافة الكلية (totalDistanceKm) غير صالحة.`);
    }
    if (typeof country.estimatedDriveHours !== 'number' || country.estimatedDriveHours <= 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): ساعات القيادة (estimatedDriveHours) غير صالحة.`);
    }
    if (!Array.isArray(country.outboundStations) || country.outboundStations.length === 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): قائمة محطات الذهاب فارغة.`);
    }
    if (!Array.isArray(country.returnStations) || country.returnStations.length === 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): قائمة محطات العودة فارغة.`);
    }

    country.outboundStations.forEach((st, idx) => validateStation(st, `${country.slug}.outboundStations[${idx}]`));
    country.returnStations.forEach((st, idx) => validateStation(st, `${country.slug}.returnStations[${idx}]`));

    if (!Array.isArray(country.routes) || country.routes.length === 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): لا توجد مسارات معرفة.`);
    }
    if (country.routes[0].distanceKm !== country.totalDistanceKm) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): مسافة المسار الرئيسي (${country.routes[0].distanceKm}) لا تطابق المسافة الكلية (${country.totalDistanceKm}).`);
    }

    // التحقق من مصفوفة محطات GPS وتدرج المسافات تنازلياً من المسافة الكلية حتى الصفر
    if (!Array.isArray(country.gpsStations) || country.gpsStations.length < 3) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): مصفوفة gpsStations مفقودة أو غير مكتملة.`);
    }
    if (country.gpsStations[0].km !== country.totalDistanceKm) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): أول نقطة في gpsStations (${country.gpsStations[0].km}) لا تطابق المسافة الكلية (${country.totalDistanceKm}).`);
    }
    if (country.gpsStations[country.gpsStations.length - 1].km !== 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): آخر نقطة في gpsStations يجب أن تكون 0 كم (مكة المكرمة).`);
    }
    for (let i = 1; i < country.gpsStations.length; i++) {
        if (country.gpsStations[i].km >= country.gpsStations[i - 1].km) {
            throw new Error(`[Validation Error] الدولة (${country.slug}): المسافات في gpsStations غير مرتبة تنازلياً عند (${country.gpsStations[i].name}).`);
        }
    }

    // التحقق من حساب الوقود الابتدائي
    const expectedLiters = ((country.totalDistanceKm * shared.defaultFuelRate) / 100).toFixed(1);
    const expectedCost = Math.round(parseFloat(expectedLiters) * shared.defaultFuelPrice);
    if (country.fuelLitersInitial !== expectedLiters || country.fuelCostInitialSar !== expectedCost) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): حساب الوقود الابتدائي (${country.fuelLitersInitial} لتر / ${country.fuelCostInitialSar} ريال) لا يطابق المسافة الكلية (${expectedLiters} لتر / ${expectedCost} ريال).`);
    }
}

function renderSitemapXml(siteUrl, activeCountries) {
    const todayIso = new Date().toISOString().split('T')[0];
    const urls = [
        { loc: `${siteUrl}/`, priority: '1.0' },
        ...activeCountries.map(c => ({ loc: `${siteUrl}/${c.slug}/`, priority: '0.9' }))
    ];
    const itemsXml = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${itemsXml}
</urlset>
`;
}

function renderRobotsTxt(siteUrl) {
    return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function buildAll() {
    validateSharedData(shared);
    ACTIVE_COUNTRIES.forEach(validateCountryData);

    const assetHashes = {
        styleCss: getFileHash('css/style.css'),
        appJs: getFileHash('js/app.js')
    };

    const homeHtml = renderHomePage(shared, homeCountriesOrder, assetHashes);
    fs.writeFileSync(path.join(__dirname, 'index.html'), homeHtml, 'utf8');
    console.log('✅ Built index.html');

    for (const country of ACTIVE_COUNTRIES) {
        const html = renderCountryPage(country, shared, assetHashes);
        const outPath = path.join(__dirname, country.slug, 'index.html');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html, 'utf8');
        console.log(`✅ Built ${country.slug}/index.html`);
    }

    for (const page of upcomingPages) {
        const html = renderComingSoonPage(page, shared, assetHashes);
        const outPath = path.join(__dirname, page.slug, 'index.html');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html, 'utf8');
        console.log(`✅ Built ${page.slug}/index.html`);
    }

    // توليد sitemap.xml و robots.txt
    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), renderSitemapXml(shared.siteUrl, ACTIVE_COUNTRIES), 'utf8');
    fs.writeFileSync(path.join(__dirname, 'robots.txt'), renderRobotsTxt(shared.siteUrl), 'utf8');
    console.log('✅ Built sitemap.xml & robots.txt');

    // توليد قائمة ملفات الكاش وبناء sw.js آلياً
    const imageFiles = fs.readdirSync(path.join(__dirname, 'assets/images'))
        .filter(f => /\.(png|svg|jpg|jpeg|webp)$/i.test(f))
        .sort()
        .map(f => `./assets/images/${f}`);

    const coreAssets = [
        './',
        './index.html',
        './manifest.json',
        `./css/style.css?v=${assetHashes.styleCss}`,
        `./js/app.js?v=${assetHashes.appJs}`,
        ...ACTIVE_COUNTRIES.flatMap(c => [`./${c.slug}/`, `./${c.slug}/index.html`]),
        ...imageFiles
    ];

    const combinedHash = crypto.createHash('sha256')
        .update(assetHashes.styleCss + assetHashes.appJs + JSON.stringify(coreAssets))
        .digest('hex')
        .slice(0, 8);

    const swContent = renderServiceWorker(combinedHash, coreAssets);
    fs.writeFileSync(path.join(__dirname, 'sw.js'), swContent, 'utf8');
    console.log(`✅ Built sw.js (cache: makkah-road-guide-${combinedHash})`);
}

buildAll();
