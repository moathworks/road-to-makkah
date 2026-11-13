/**
 * مُجمِّع المشروع (Zero-Dependency Static Builder)
 *
 * - يكتشف الدول الفعّالة تلقائياً من data/countries/*.js (ملف واحد لكل دولة).
 * - يبني كل صفحة بلغتين: العربية في جذر الموقع، والإنجليزية تحت en/.
 * - مسار كل دولة سلسلة أقسام تختارها في outbound و return (أقسام خاصة بها أو مقاطع مشتركة من
 *   shared.segments)، فلا يفترض البناء ممراً ثابتاً لكل الدول.
 * - يبني سلسلة المسار من distanceFromPrevKm فقط، ويشتق منها: المسافة المتبقية، نقاط GPS،
 *   الوقود والزمن الصافي. لا تُكتب أي قيمة مشتقة يدوياً في ملفات البيانات.
 * - يتحقق من البيانات ويفشل البناء عند أي تناقض (الترجمة الناقصة تنبيه فقط ويُعرض مكانها العربي).
 * - يحسب بصمات الملفات، ويولّد صفحات HTML و manifest.json و sw.js و sitemap.xml.
 *   (لا يُولَّد robots.txt: الموقع على مسار فرعي في GitHub Pages، ومحركات البحث لا تقرأ
 *   robots.txt إلا من جذر النطاق. تُرسَل خريطة الموقع عبر Google Search Console.)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const shared = require('./data/shared');
const ui = require('./data/i18n');
const { countriesOrder } = require('./data/site');
const { LANGS, tr, makeT, pagePath } = require('./templates/helpers');
const { renderCountryPage } = require('./templates/country');
const { renderComingSoonPage } = require('./templates/coming-soon');
const { renderHomePage } = require('./templates/home');
const { renderManifest } = require('./templates/manifest');
const { renderServiceWorker } = require('./templates/sw');

const COUNTRIES_DIR = path.join(__dirname, 'data', 'countries');

// المسارات التي يُعدّ تغيّرها «تحديثاً للمحتوى» (لحساب تاريخ آخر تحديث)
const CONTENT_PATHS = ['data', 'templates', 'css', 'js', 'assets'];

// هامش السماح عند مقارنة المسافة المستقيمة بمسافة الطريق (المسافات المعروضة تقريبية «~»)
const STRAIGHT_LINE_TOLERANCE = 1.03;

// صيغة المسافة داخل شارة المحطة في كل لغة: «~90 كم» / «~90 km»
const BADGE_KM_PATTERN = { ar: /~\s*(\d+)\s*كم/, en: /~\s*(\d+)\s*km/ };

// أدنى نسبة تباين بين لون هوية الدولة والأبيض (يُستخدم خلفيةً لنص أبيض ولوناً لنص على أبيض)
const MIN_BRAND_CONTRAST = 4.5;

// ملفات نصية تُوحَّد نهايات أسطرها قبل حساب البصمة، فتتطابق البصمة على أي نظام تشغيل
const TEXT_EXTENSIONS = /\.(css|js|json|svg|html|xml|txt)$/i;

function fail(message) {
    throw new Error(`[Validation Error] ${message}`);
}

function sha256Short(content) {
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
}

function getFileHash(relPath) {
    let content = fs.readFileSync(path.join(__dirname, relPath));
    if (TEXT_EXTENSIONS.test(relPath)) content = content.toString('utf8').replace(/\r\n/g, '\n');
    return sha256Short(content);
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

function isPositiveInt(value) {
    return Number.isInteger(value) && value > 0;
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

// صيغة التاريخ بلغة الصفحة نفسها التي يستخدمها js/app.js (js.locale) مع التقويم الميلادي
function formatDate(isoDate, lang) {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Intl.DateTimeFormat(tr(ui['js.locale'], lang), {
        day: 'numeric', month: 'long', year: 'numeric', calendar: 'gregory', numberingSystem: 'latn'
    }).format(new Date(y, m - 1, d));
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
const missingTranslations = new Set();
function requireBilingual(value, label) {
    if (!value || typeof value !== 'object') fail(`${label}: يجب أن يكون النص بصيغة { ar, en }.`);
    if (!hasLang(value, 'ar')) fail(`${label}: النص العربي مفقود.`);
    LANGS.forEach((lang) => {
        if (!hasLang(value, lang)) missingTranslations.add(`${label} [${lang}]`);
    });
}

function requireUrl(url, label) {
    if (typeof url !== 'string' || !/^https?:\/\//.test(url)) fail(`${label}: رابط غير صالح (${url}).`);
}

function requireUniqueIds(ids, label) {
    const seen = new Set();
    ids.forEach((id) => {
        if (!id || typeof id !== 'string') fail(`${label}: عنصر بلا id.`);
        if (seen.has(id)) fail(`${label}: المعرّف (${id}) مكرر.`);
        seen.add(id);
    });
}

function validateCoords(point, label) {
    if (!hasCoords(point) || Number.isNaN(point.lat) || Number.isNaN(point.lon)) fail(`${label}: الإحداثيات (lat/lon) مفقودة أو غير رقمية.`);
    // نطاق شبه الجزيرة العربية والدول المجاورة: يلتقط الأخطاء الفادحة مثل تبديل lat و lon
    if (point.lat < 12 || point.lat > 38 || point.lon < 34 || point.lon > 60) fail(`${label}: الإحداثيات (${point.lat}, ${point.lon}) خارج النطاق الجغرافي المتوقع.`);
}

/**
 * يتحقق من المحطة، ومن أن رقم الشارة («تبعد ~N كم» / «~N km») يطابق distanceFromPrevKm في اللغتين.
 * أي شارة تذكر مسافة يجب أن يكون لمحطتها distanceFromPrevKm، فلا توجد مسافة مكتوبة خارج المصدر الواحد.
 */
function validateStation(station, label) {
    requireBilingual(station.title, `${label}.title`);
    const name = station.title.ar;
    const where = `${label} (${name})`;
    requireBilingual(station.desc, `${where}.desc`);
    ['badge', 'gpsName', 'btnLabel'].forEach((key) => {
        if (station[key] !== undefined) requireBilingual(station[key], `${where}.${key}`);
    });
    requireUrl(station.mapUrl, `${where}.mapUrl`);

    if (station.distanceFromPrevKm !== undefined && !isPositiveInt(station.distanceFromPrevKm)) {
        fail(`${where}: distanceFromPrevKm يجب أن يكون عدداً صحيحاً موجباً (${station.distanceFromPrevKm}).`);
    }

    if (station.badge) {
        const badgeKm = {};
        LANGS.filter(lang => hasLang(station.badge, lang)).forEach((lang) => {
            const match = station.badge[lang].match(BADGE_KM_PATTERN[lang]);
            badgeKm[lang] = match ? Number(match[1]) : null;
            if (match && badgeKm[lang] !== station.distanceFromPrevKm) {
                fail(station.distanceFromPrevKm === undefined
                    ? `${where}: الشارة [${lang}] تذكر ~${badgeKm[lang]} كم لكن المحطة بلا distanceFromPrevKm.`
                    : `${where}: الشارة [${lang}] تذكر ~${badgeKm[lang]} بينما distanceFromPrevKm = ${station.distanceFromPrevKm}.`);
            }
        });
        if ('en' in badgeKm && (badgeKm.ar === null) !== (badgeKm.en === null)) {
            fail(`${where}: الشارة تذكر المسافة في لغة دون الأخرى.`);
        }
    }

    const hasLat = station.lat !== undefined;
    const hasLon = station.lon !== undefined;
    if (hasLat !== hasLon) fail(`${where}: يجب تحديد lat و lon معاً أو حذفهما معاً.`);
    if (hasLat) validateCoords(station, where);
}

function validateApp(app, label) {
    requireBilingual(app.title, `${label}.title`);
    requireBilingual(app.desc, `${label}.desc`);
    ['ariaName', 'webAriaLabel'].forEach((key) => {
        if (app[key] !== undefined) requireBilingual(app[key], `${label}.${key}`);
    });
    if (!app.iconEmoji && !app.iconSrc) fail(`${label}: التطبيق بلا أيقونة (iconEmoji أو iconSrc).`);
    if (app.iconSrc && !fs.existsSync(path.join(__dirname, app.iconSrc))) fail(`${label}: ملف الأيقونة (${app.iconSrc}) غير موجود.`);
    ['playUrl', 'appleUrl', 'webUrl'].forEach((key) => { if (app[key] !== undefined) requireUrl(app[key], `${label}.${key}`); });
    if (!app.playUrl && !app.appleUrl && !app.webUrl) fail(`${label}: التطبيق بلا أي رابط.`);
}

/** المحطة كما تُعرض: إما محطة كاملة، أو استدعاء { ref } لمحطة من shared.stations مع بيانات المقطع */
function resolveStation(stop, label) {
    if (!stop || typeof stop !== 'object') fail(`${label}: محطة غير صالحة.`);
    if (stop.ref === undefined) return stop;
    const base = shared.stations[stop.ref];
    if (!base) fail(`${label}: المحطة المشتركة (${stop.ref}) غير موجودة في shared.stations.`);
    return { ...base, ...stop, id: stop.id || stop.ref };
}

function resolveRoute(route, label) {
    if (route.ref === undefined) return route;
    const base = shared.routeTemplates[route.ref];
    if (!base) fail(`${label}: المسار المشترك (${route.ref}) غير موجود في shared.routeTemplates.`);
    return { ...base, ...route };
}

/**
 * يحوّل قائمة أقسام الدولة (outbound أو return) إلى أقسام كاملة جاهزة للعرض:
 * الاسم النصي يشير إلى مقطع مشترك في shared.segments، والكائن قسم خاص بالدولة.
 */
function resolveSections(list, phase, label) {
    if (!Array.isArray(list) || list.length === 0) fail(`${label}.${phase}: قائمة الأقسام فارغة.`);
    return list.map((entry, idx) => {
        const where = `${label}.${phase}[${idx}]`;
        let section;
        if (typeof entry === 'string') {
            if (!shared.segments[entry]) fail(`${where}: المقطع المشترك (${entry}) غير موجود في shared.segments.`);
            section = { ...shared.segments[entry], segmentKey: entry };
        } else if (entry && typeof entry === 'object') {
            section = { ...entry };
            requireBilingual(section.title, `${where}.title`);
            if (section.intro !== undefined) requireBilingual(section.intro, `${where}.intro`);
        } else {
            fail(`${where}: قسم غير صالح.`);
        }
        if (!/^section-[a-z0-9-]+$/.test(section.id || '')) fail(`${where}: معرّف القسم (${section.id}) يجب أن يبدأ بـ section- .`);
        if (section.numbering !== undefined && !['alternative', 'restart'].includes(section.numbering)) fail(`${where}: numbering غير معروف (${section.numbering}).`);
        if (!Array.isArray(section.stations) || section.stations.length === 0) fail(`${where} (${section.id}): القسم بلا محطات.`);

        section.chain = phase === 'outbound' && section.chain !== false;
        if (!section.chain && (section.startsFrom || section.toMakkahKm !== undefined)) {
            fail(`${where} (${section.id}): startsFrom و toMakkahKm لأقسام سلسلة الذهاب فقط.`);
        }
        section.stations = section.stations.map((stop, sIdx) => {
            const st = resolveStation(stop, `${where}.stations[${sIdx}]`);
            // محطات المقاطع المشتركة تُفحص مرة واحدة في validateSharedData
            if (!section.segmentKey) validateStation(st, `${label}.${section.id}[${sIdx}]`);
            return st;
        });
        return section;
    });
}

function validateSharedData() {
    Object.entries(shared.stations).forEach(([id, st]) => validateStation(st, `shared.stations.${id}`));
    Object.entries(shared.segments).forEach(([key, segment]) => {
        if (!Array.isArray(segment.stations) || segment.stations.length === 0) fail(`المقطع المشترك (${key}) فارغ.`);
        segment.stations.forEach((st, idx) => validateStation(resolveStation(st, `shared.segments.${key}[${idx}]`), `shared.segments.${key}[${idx}]`));
        ['titleKey', 'introKey'].forEach((k) => { if (segment[k] !== undefined && !ui[segment[k]]) fail(`المقطع (${key}): المفتاح ${segment[k]} غير معرّف في data/i18n.js.`); });
        if (segment.startsFrom !== undefined && !shared.stations[segment.startsFrom]) fail(`المقطع (${key}): startsFrom (${segment.startsFrom}) ليست محطة في shared.stations.`);
        if (segment.entryLegVia !== undefined && !shared.segments[segment.entryLegVia]) fail(`المقطع (${key}): entryLegVia (${segment.entryLegVia}) ليس مقطعاً معرّفاً.`);
        if (segment.toMakkahKm !== undefined && !isPositiveInt(segment.toMakkahKm)) fail(`المقطع (${key}): toMakkahKm غير صالح.`);
    });
    requireUniqueIds(Object.values(shared.segments).map(s => s.id), 'shared.segments');
    Object.entries(shared.routeTemplates).forEach(([key, route]) => {
        requireBilingual(route.title, `shared.routeTemplates.${key}.title`);
        requireBilingual(route.description, `shared.routeTemplates.${key}.description`);
        requireUrl(route.mapUrl, `shared.routeTemplates.${key}.mapUrl`);
    });

    requireBilingual(shared.destination.name, 'shared.destination.name');
    validateCoords(shared.destination, 'shared.destination');

    shared.sharedApps.forEach((app, idx) => validateApp(app, `shared.sharedApps[${idx}]`));
    requireUniqueIds(shared.sharedApps.map(a => a.id), 'shared.sharedApps');

    shared.checklistGroups.forEach((group, g) => {
        requireBilingual(group.title, `shared.checklistGroups[${g}].title`);
        group.items.forEach((item) => { if (!item.labelKey) requireBilingual(item.label, `checklist (${item.id})`); });
    });
    // معرّف البند مفتاح حفظ حالته لدى المستخدم: التكرار يدمج بندين في حالة واحدة
    requireUniqueIds(shared.checklistGroups.flatMap(g => g.items.map(i => i.id)), 'shared.checklistGroups');

    shared.prayers.forEach((prayer, idx) => {
        requireBilingual(prayer.label, `shared.prayers[${idx}].label`);
        if (prayer.note) {
            requireBilingual(prayer.note, `shared.prayers[${idx}].note`);
        } else if (typeof prayer.arabic !== 'string' || !prayer.arabic.trim() || typeof prayer.translation !== 'string' || !prayer.translation.trim()) {
            fail(`shared.prayers[${idx}]: يلزم note أو (arabic و translation).`);
        }
    });
    shared.pilgrimTips.forEach((tip, idx) => {
        requireBilingual(tip.title, `shared.pilgrimTips[${idx}].title`);
        if (!tip.textKey) requireBilingual(tip.text, `shared.pilgrimTips[${idx}].text`);
        if (tip.group !== 'road' && tip.group !== 'city') fail(`shared.pilgrimTips[${idx}]: الحقل group يجب أن يكون 'road' أو 'city'.`);
    });
    shared.places.forEach((group, g) => {
        requireBilingual(group.city, `shared.places[${g}].city`);
        group.items.forEach((place, idx) => {
            requireBilingual(place.name, `shared.places[${g}].items[${idx}].name`);
            requireUrl(place.mapUrl, `shared.places[${g}].items[${idx}].mapUrl`);
        });
    });

    if (!/^https:\/\/[^/]+/.test(shared.siteUrl) || shared.siteUrl.endsWith('/')) fail(`siteUrl غير صالح (${shared.siteUrl}): يجب أن يبدأ بـ https وألا ينتهي بـ /.`);
    if (/\.(test|local|localhost)(\/|$)/.test(shared.siteUrl)) fail(`siteUrl (${shared.siteUrl}) نطاق محلي لا يصلح للنشر.`);
}

/** نسبة التباين بين لونين (WCAG 2) */
function contrastRatio(hexA, hexB) {
    const luminance = (hex) => {
        const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
            .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [l1, l2] = [luminance(hexA), luminance(hexB)].sort((a, b) => b - a);
    return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * يبني سلسلة المسار الكاملة لدولة من أقسام الذهاب التي تدخل السلسلة (chain)، ثم الحرم المكي.
 * كل محطة مرقّمة في قسم من السلسلة تحمل distanceFromPrevKm، ومنها تُشتق كل القيم الأخرى.
 * يعيد نقاط GPS بأسماء ثنائية اللغة، ومع كل نقطة معرّف القسم الذي يقع فيه الطريق المؤدي إليها (leg).
 */
function buildRouteChain(country, outboundSections) {
    const label = `الدولة (${country.slug})`;
    const chainSections = outboundSections.filter(sec => sec.chain);
    if (chainSections.length === 0) fail(`${label}: لا توجد أقسام ذهاب تدخل سلسلة المسار.`);

    const legs = [];
    chainSections.forEach((sec, secIdx) => {
        const isLast = secIdx === chainSections.length - 1;
        if (sec.startsFrom) {
            const prev = legs[legs.length - 1];
            if (!prev || prev.station.ref !== sec.startsFrom) {
                fail(`${label}: المقطع (${sec.segmentKey || sec.id}) تُقاس مسافاته من المحطة المشتركة (${sec.startsFrom})، فيجب أن تكون آخر محطة قبله في السلسلة { ref: '${sec.startsFrom}' }.`);
            }
        }
        if (isLast !== (sec.toMakkahKm !== undefined)) {
            fail(`${label}: toMakkahKm مطلوبة في آخر قسم من سلسلة الذهاب فقط (القسم ${sec.id}).`);
        }

        // الطريق المؤدي إلى أول محطة في القسم قد يُنسب إلى قسم آخر (مثل محطات داخل الرياض)
        const via = sec.entryLegVia && outboundSections.find(s => s.segmentKey === sec.entryLegVia);
        let firstInSection = true;
        sec.stations.forEach((st) => {
            if (st.distanceFromPrevKm === undefined) {
                if (st.unnumbered) return;
                fail(`${label}: المحطة (${st.title.ar}) في قسم السلسلة (${sec.id}) بلا distanceFromPrevKm.`);
            }
            legs.push({ station: st, km: st.distanceFromPrevKm, leg: firstInSection && via ? via.id : sec.id });
            firstInSection = false;
        });
        if (isLast) {
            legs.push({ station: { ...shared.destination, title: shared.destination.name }, km: sec.toMakkahKm, leg: sec.id });
        }
    });

    const sumKm = legs.reduce((acc, l) => acc + l.km, 0);
    if (sumKm !== country.totalDistanceKm) {
        fail(`${label}: مجموع مقاطع المسار (${sumKm} كم) لا يطابق المسافة الكلية totalDistanceKm (${country.totalDistanceKm} كم).`);
    }

    // نقاط GPS: كل محطة لها إحداثيات في السلسلة، مع المسافة المتبقية المحسوبة
    const gpsPoints = [{ km: sumKm, name: country.origin.name, lat: country.origin.lat, lon: country.origin.lon, leg: chainSections[0].id }];
    let remainingKm = sumKm;
    legs.forEach((l) => {
        remainingKm -= l.km;
        const st = l.station;
        if (hasCoords(st)) {
            gpsPoints.push({ km: remainingKm, name: st.gpsName || st.name || st.title, lat: st.lat, lon: st.lon, leg: l.leg });
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

/** يتحقق من ملف الدولة ويعيده مع الأقسام والمسارات بعد حل الاستدعاءات (ref) */
function prepareCountry(country, fileName) {
    ['slug', 'countryCode', 'flagFile', 'themeColor', 'themeColorRgb', 'themeColorDark', 'emergencyNumber'].forEach((key) => {
        if (!country[key] || typeof country[key] !== 'string') fail(`ملف الدولة (${fileName}): الحقل النصي المطلوب (${key}) مفقود.`);
    });
    const label = `الدولة (${country.slug})`;
    ['countryName', 'defaultCity', 'nationalIdLabel', 'metaDescription', 'pageTitle', 'printHeaderTitle', 'printHeaderSubtitle',
        'headerSubtitle', 'camelWarningText'].forEach((key) => {
        requireBilingual(country[key], `${label}.${key}`);
    });

    if (!/^#[0-9a-f]{6}$/i.test(country.themeColor) || !/^#[0-9a-f]{6}$/i.test(country.themeColorDark)) fail(`${label}: themeColor و themeColorDark بصيغة #RRGGBB.`);
    const rgb = [1, 3, 5].map(i => parseInt(country.themeColor.slice(i, i + 2), 16)).join(', ');
    if (country.themeColorRgb.replace(/\s/g, '') !== rgb.replace(/\s/g, '')) fail(`${label}: themeColorRgb (${country.themeColorRgb}) لا يطابق themeColor (${rgb}).`);
    const contrast = contrastRatio(country.themeColor, '#FFFFFF');
    if (contrast < MIN_BRAND_CONTRAST) fail(`${label}: تباين لون الهوية ${country.themeColor} مع الأبيض ${contrast.toFixed(2)} أقل من ${MIN_BRAND_CONTRAST}. اختر درجة أغمق.`);

    if (!isPositiveInt(country.totalDistanceKm)) fail(`${label}: المسافة الكلية (totalDistanceKm) غير صالحة.`);
    if (typeof country.estimatedDriveHours !== 'number' || country.estimatedDriveHours <= 0) fail(`${label}: ساعات الرحلة (estimatedDriveHours) غير صالحة.`);
    // الزمن الشامل للتوقفات لا يصح أن يقل عن الزمن الصافي (100 كم/س)
    if (country.estimatedDriveHours < country.totalDistanceKm / 100) fail(`${label}: estimatedDriveHours (${country.estimatedDriveHours}) أقل من زمن القيادة الصافي (${(country.totalDistanceKm / 100).toFixed(1)} ساعة).`);

    if (!country.origin) fail(`${label}: نقطة الانطلاق (origin) مفقودة.`);
    requireBilingual(country.origin.name, `${label}.origin.name`);
    validateCoords(country.origin, `${label}.origin`);

    const outbound = resolveSections(country.outbound, 'outbound', label);
    const ret = resolveSections(country.return, 'return', label);
    requireUniqueIds([...outbound, ...ret].map(s => s.id), `${label}: معرّفات الأقسام`);

    (country.extraApps || []).forEach((app, idx) => validateApp(app, `${country.slug}.extraApps[${idx}]`));
    requireUniqueIds([...(country.extraApps || []), ...shared.sharedApps].map(a => a.id), `${label}: معرّفات التطبيقات`);

    if (!Array.isArray(country.routes) || country.routes.length === 0) fail(`${label}: لا توجد مسارات معرفة.`);
    const routes = country.routes.map((r, idx) => {
        const route = resolveRoute(r, `${label}.routes[${idx}]`);
        ['title', 'itinerary', 'description'].forEach(key => requireBilingual(route[key], `${label}.routes[${idx}].${key}`));
        if (!isPositiveInt(route.distanceKm)) fail(`${label}.routes[${idx}]: distanceKm غير صالحة.`);
        requireUrl(route.mapUrl, `${label}.routes[${idx}].mapUrl`);
        return route;
    });
    if (routes[0].distanceKm !== country.totalDistanceKm) {
        fail(`${label}: مسافة المسار الرئيسي (${routes[0].distanceKm}) لا تطابق المسافة الكلية (${country.totalDistanceKm}).`);
    }
    if (!fs.existsSync(path.join(__dirname, 'assets', 'images', country.flagFile))) fail(`${label}: ملف العلم (${country.flagFile}) غير موجود في assets/images.`);

    return { ...country, routes, outboundSections: outbound, returnSections: ret };
}

/** القيم المشتقة لصفحة الدولة بلغة معيّنة: تُحسب هنا ولا تُكتب في ملفات البيانات */
function deriveCountryValues(country, gpsPoints, lang) {
    const liters = (country.totalDistanceKm * shared.defaultFuelRate) / 100;
    return {
        gpsPoints: gpsPoints.map(p => ({ km: p.km, name: tr(p.name, lang), lat: p.lat, lon: p.lon, leg: p.leg })),
        fuelLitersText: liters.toFixed(1),
        fuelCostSar: Math.round(liters * shared.defaultFuelPrice),
        netDriveTimeText: formatDriveTime(Math.round((country.totalDistanceKm / 100) * 60), lang)
    };
}

function loadActiveCountries() {
    const files = fs.readdirSync(COUNTRIES_DIR).filter(f => f.endsWith('.js')).sort();
    const bySlug = new Map();
    for (const file of files) {
        const country = prepareCountry(require(path.join(COUNTRIES_DIR, file)), file);
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
        if (!fs.existsSync(path.join(__dirname, 'assets', 'images', entry.flagFile))) fail(`الدولة (${entry.slug}): ملف العلم (${entry.flagFile}) غير موجود.`);
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

function listFiles(relDir, pattern) {
    return fs.readdirSync(path.join(__dirname, relDir)).filter(f => pattern.test(f)).sort().map(f => `${relDir}/${f}`);
}

function buildAll() {
    validateSharedData();
    const activeBySlug = loadActiveCountries();
    const siteCountries = resolveSiteCountries(activeBySlug);
    const activeCountries = siteCountries.filter(c => c.active).map(c => c.country);
    const routeChains = new Map(activeCountries.map(c => [c.slug, buildRouteChain(c, c.outboundSections)]));

    const lastUpdatedIso = getLastUpdatedIso();
    const assetHashes = {
        styleCss: getFileHash('css/style.css'),
        homeCss: getFileHash('css/home.css'),
        fontsCss: getFileHash('css/fonts.css'),
        appJs: getFileHash('js/app.js')
    };

    const pages = [];
    for (const lang of LANGS) {
        const ctx = { lang, assetHashes, activeCountries, lastUpdatedText: formatDate(lastUpdatedIso, lang), lastUpdatedYear: lastUpdatedIso.slice(0, 4) };
        pages.push({ relPath: `${pagePath(null, lang)}index.html`, html: renderHomePage(shared, siteCountries, ctx), isHome: true });
        for (const entry of siteCountries) {
            const html = entry.active
                ? renderCountryPage(entry.country, shared, { ...ctx, derived: deriveCountryValues(entry.country, routeChains.get(entry.slug), lang) })
                : renderComingSoonPage(entry.page, shared, ctx);
            pages.push({ relPath: `${pagePath(entry.slug, lang)}index.html`, html });
        }
    }
    pages.forEach(p => writeOutput(p.relPath, p.html));
    console.log(`✅ Built ${pages.length} pages (${activeCountries.length} active countries × ${LANGS.length} languages) — آخر تحديث: ${formatDate(lastUpdatedIso, 'ar')}`);

    // ملف manifest لكل لغة: من يثبّت التطبيق من الصفحة الإنجليزية يحصل على اسم إنجليزي ويبدأ منها
    const manifests = LANGS.map(lang => ({ relPath: `${pagePath(null, lang)}manifest.json`, json: renderManifest(lang) }));
    manifests.forEach(m => writeOutput(m.relPath, m.json));
    console.log(`✅ Built ${manifests.map(m => m.relPath).join(', ')}`);

    writeOutput('sitemap.xml', renderSitemapXml(shared.siteUrl, activeCountries, lastUpdatedIso));
    console.log('✅ Built sitemap.xml');

    /*
     * Service Worker: يخزّن مسبقاً «القشرة» المشتركة فقط (الأنماط والسكربت والخطوط والصور والرئيسية).
     * صفحات الدول تُخزَّن عند زيارتها (الصفحة المفتوحة ونسختها باللغة الأخرى)، فلا يحمّل الزائر
     * أدلة كل الدول، ولا يتغيّر الكاش كله عند تعديل صفحة دولة واحدة.
     */
    const criticalAssets = [
        `./css/style.css?v=${assetHashes.styleCss}`,
        `./css/home.css?v=${assetHashes.homeCss}`,
        `./css/fonts.css?v=${assetHashes.fontsCss}`,
        `./js/app.js?v=${assetHashes.appJs}`,
        ...manifests.map(m => `./${m.relPath}`)
    ];
    const optionalFiles = [
        ...listFiles('assets/images', /\.(png|svg|jpg|jpeg|webp)$/i),
        ...listFiles('assets/fonts', /\.woff2$/i)
    ];
    const homePages = LANGS.map(lang => `./${pagePath(null, lang)}`);

    const cacheHash = sha256Short(JSON.stringify([criticalAssets, optionalFiles, homePages]) +
        optionalFiles.map(f => getFileHash(f)).join('') +
        manifests.map(m => m.json).join('') +
        pages.filter(p => p.isHome).map(p => p.html).join(''));

    writeOutput('sw.js', renderServiceWorker({
        cacheHash,
        criticalAssets,
        optionalAssets: optionalFiles.map(f => `./${f}`),
        homePages
    }));
    console.log(`✅ Built sw.js (shell cache: ${cacheHash})`);

    if (missingTranslations.size) {
        console.warn(`⚠️ ${missingTranslations.size} نص بلا ترجمة، عُرض مكانه النص العربي:`);
        missingTranslations.forEach(item => console.warn(`   - ${item}`));
    }
}

buildAll();
