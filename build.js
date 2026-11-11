/**
 * مُجمِّع المشروع (Zero-Dependency Static Builder)
 * يتحقق من صحة البيانات (Validation) ويولّد صفحات الدول وصفحات "قريباً".
 */

const fs = require('fs');
const path = require('path');

const shared = require('./data/shared');
const qaData = require('./data/countries/qa');
const bhData = require('./data/countries/bh');
const { upcomingPages, homeCountriesOrder } = require('./data/countries/upcoming');
const { renderCountryPage } = require('./templates/country');
const { renderComingSoonPage } = require('./templates/coming-soon');
const { renderHomePage } = require('./templates/home');

const ACTIVE_COUNTRIES = [qaData, bhData];

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

    // التحقق من تطابق مسافة المسار الرئيسي مع المسافة الكلية
    if (!Array.isArray(country.routes) || country.routes.length === 0) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): لا توجد مسارات معرفة.`);
    }
    if (country.routes[0].distanceKm !== country.totalDistanceKm) {
        throw new Error(`[Validation Error] الدولة (${country.slug}): مسافة المسار الرئيسي (${country.routes[0].distanceKm}) لا تطابق المسافة الكلية (${country.totalDistanceKm}).`);
    }
}

function buildAll() {
    validateSharedData(shared);
    ACTIVE_COUNTRIES.forEach(validateCountryData);

    const homeHtml = renderHomePage(shared, homeCountriesOrder);
    fs.writeFileSync(path.join(__dirname, 'index.html'), homeHtml, 'utf8');
    console.log('✅ Built index.html');

    for (const country of ACTIVE_COUNTRIES) {
        const html = renderCountryPage(country, shared);
        const outPath = path.join(__dirname, country.slug, 'index.html');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html, 'utf8');
        console.log(`✅ Built ${country.slug}/index.html`);
    }

    for (const page of upcomingPages) {
        const html = renderComingSoonPage(page);
        const outPath = path.join(__dirname, page.slug, 'index.html');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html, 'utf8');
        console.log(`✅ Built ${page.slug}/index.html`);
    }
}

buildAll();
