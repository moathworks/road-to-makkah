/**
 * دليل السفر البري إلى مكة المكرمة - الملف البرمجي التفاعلي (Mobile-First Architecture)
 * يعمل على صفحات HTML المولّدة مسبقاً عبر build.js:
 * - صفحات الدول: تحمل window.COUNTRY_DATA فتُفعَّل كل الوظائف.
 * - الصفحة الرئيسية: بلا COUNTRY_DATA فتُفعَّل الوظائف المشتركة فقط (الطقس، المشاركة، Service Worker).
 */

const IS_COUNTRY_PAGE = Boolean(window.COUNTRY_DATA);
const CONFIG = window.COUNTRY_DATA || {};

// رابط هذا الملف: يُشتق منه مسار sw.js في جذر الموقع أياً كان عمق الصفحة
const APP_SCRIPT_URL = document.currentScript ? document.currentScript.src : '';

const CHECKLIST_STORAGE_KEY = `meccaTripChecklist_${CONFIG.countryCode}`;
// نصوص الواجهة بلغة الصفحة: يحقنها القالب في window.APP_I18N (مصدرها data/i18n.js)
const I18N = window.APP_I18N || {};
const DATE_LOCALE = I18N.locale || 'ar-u-nu-latn';

function tx(key, vars) {
    const text = I18N[key] === undefined ? key : I18N[key];
    return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m)) : text;
}

// 1. إدارة فتح وطي الأقسام (Accordions) - مغلقة في أول زيارة، ثم تُستعاد كما تركها المسافر
// (من يفتح الدليل عند كل توقف يجد قسم محطاته مفتوحاً دون البحث عنه من جديد)
const OPEN_SECTIONS_STORAGE_KEY = `guideOpenSections_${CONFIG.countryCode}`;
// نموذج الاقتراحات لا يُستعاد مفتوحاً: فتحه يحمّل الكابتشا الخارجية بلا حاجة
const NON_PERSISTENT_SECTIONS = ['section-suggestions'];
let isAllExpanded = false;

function loadOpenSections() {
    try {
        const ids = JSON.parse(localStorage.getItem(OPEN_SECTIONS_STORAGE_KEY));
        return Array.isArray(ids) ? ids : [];
    } catch (e) {
        return [];
    }
}

function saveOpenSections() {
    // أثناء الطباعة تُفتح كل الأقسام مؤقتاً: لا نحفظ هذه الحالة العابرة
    if (savedAccordionStatesBeforePrint) return;
    const ids = Array.from(document.querySelectorAll('details.custom-accordion[open][id]'))
        .map(details => details.id)
        .filter(id => !NON_PERSISTENT_SECTIONS.includes(id));
    try {
        localStorage.setItem(OPEN_SECTIONS_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) { /* التخزين غير متاح (تصفح خاص مثلاً): نكمل بلا حفظ */ }
}

function updateToggleIcon() {
    const accordions = document.querySelectorAll('details.custom-accordion');
    const openAccordions = document.querySelectorAll('details.custom-accordion[open]');
    const icon = document.getElementById('toggleAllIcon');

    if (!icon) return;

    if (openAccordions.length === 0) {
        icon.innerHTML = '<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>';
        isAllExpanded = false;
    } else if (openAccordions.length === accordions.length) {
        icon.innerHTML = '<polyline points="7 11 12 6 17 11"></polyline><polyline points="7 18 12 13 17 18"></polyline>';
        isAllExpanded = true;
    } else {
        icon.innerHTML = '<polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline>';
        isAllExpanded = false;
    }
}

function toggleAllAccordions() {
    const accordions = document.querySelectorAll('details.custom-accordion');
    const willExpand = !isAllExpanded;

    accordions.forEach((acc) => {
        if (willExpand) {
            acc.setAttribute('open', '');
        } else {
            acc.removeAttribute('open');
        }
    });

    updateToggleIcon();
}

function initAccordions() {
    const detailsElements = document.querySelectorAll('details.custom-accordion');
    const openIds = loadOpenSections();

    detailsElements.forEach((details) => {
        if (details.id && openIds.includes(details.id) && !NON_PERSISTENT_SECTIONS.includes(details.id)) {
            details.setAttribute('open', '');
        } else {
            details.removeAttribute('open');
        }
        details.addEventListener('toggle', () => {
            updateToggleIcon();
            saveOpenSections();
        });
    });

    updateToggleIcon();
}

// الانتقال السلس من شريط الجوال السفلي مع فتح القسم تلقائياً إن كان مطوياً
function navigateToSection(sectionId, btnEl) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    closeNavSheets();

    if (target.tagName.toLowerCase() === 'details' && !target.open) {
        target.setAttribute('open', '');
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (btnEl) setActiveNavButton(btnEl);
}

function setActiveNavButton(btnEl) {
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
}

// قوائم شريط الجوال («المحطات» و«المزيد»): قائمة صغيرة تظهر فوق الشريط لاختيار القسم
function closeNavSheets() {
    document.querySelectorAll('.nav-sheet.is-open').forEach(sheet => sheet.classList.remove('is-open'));
    document.querySelectorAll('.mobile-nav-btn[data-sheet]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    const backdrop = document.getElementById('navSheetBackdrop');
    if (backdrop) backdrop.classList.remove('is-open');
}

function toggleNavSheet(sheetId, btnEl) {
    const sheet = document.getElementById(sheetId);
    if (!sheet) return;

    const wasOpen = sheet.classList.contains('is-open');
    closeNavSheets();
    if (wasOpen) return;

    sheet.classList.add('is-open');
    const backdrop = document.getElementById('navSheetBackdrop');
    if (backdrop) backdrop.classList.add('is-open');
    if (btnEl) btnEl.setAttribute('aria-expanded', 'true');

    // التركيز على المقطع الحالي (إن عُرف من GPS) وإلا على أول خيار
    const firstItem = sheet.querySelector('.nav-sheet-item.is-current') || sheet.querySelector('.nav-sheet-item');
    if (firstItem) firstItem.focus({ preventScroll: true });
}

function navigateFromSheet(sectionId) {
    const sheet = document.querySelector('.nav-sheet.is-open');
    const opener = sheet ? document.querySelector(`.mobile-nav-btn[data-sheet="${sheet.id}"]`) : null;
    navigateToSection(sectionId, opener);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavSheets();
});

// 2. بدء الرحلة وفتح ملاحة خرائط جوجل
function startJourney() {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate', '_blank', 'noopener');
}

// 3. حساب وقت الوصول المتوقع (باستخدام setMinutes لدعم أنصاف الساعات بدقة دون اقتطاع)
function calcArrival() {
    const depInputEl = document.getElementById('dep-time');
    const arrDisplay = document.getElementById('arr-time');
    if (!depInputEl || !arrDisplay) return;

    const depInput = depInputEl.value;
    if (depInput) {
        const depDate = new Date(depInput);
        const totalMinutes = Math.round(CONFIG.estimatedDriveHours * 60);
        depDate.setMinutes(depDate.getMinutes() + totalMinutes);

        const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        arrDisplay.textContent = depDate.toLocaleDateString(DATE_LOCALE, options);
    } else {
        arrDisplay.textContent = tx('selectDeparture');
    }
}

// 4. حاسبة تكلفة الوقود التقديرية (بأرقام لاتينية موحدة)
function calculateFuel() {
    const distEl = document.getElementById('calc-distance');
    const rateEl = document.getElementById('calc-rate');
    const priceEl = document.getElementById('calc-price');
    const litersEl = document.getElementById('res-liters');
    const totalEl = document.getElementById('res-total');

    if (!distEl || !rateEl || !priceEl || !litersEl || !totalEl) return;

    const dist = parseFloat(distEl.value) || 0;
    const rate = parseFloat(rateEl.value) || 0;
    const price = parseFloat(priceEl.value) || 0;

    const liters = (dist * rate) / 100;
    const totalCost = liters * price;

    litersEl.textContent = liters.toFixed(1) + ' ' + tx('liter');
    totalEl.textContent = Math.round(totalCost).toLocaleString('en-US') + ' ' + tx('sar');
}

// 5. نظام قائمة المهام بسحّابات (Checklist) مع حفظ الحالة بمعرّف ثابت لكل بند
function initChecklist() {
    const toggles = document.querySelectorAll('.checklist-toggle');
    const progressBarFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');

    if (!toggles.length) return;

    function getToggleKey(toggle, index) {
        return toggle.dataset.checkId || toggle.id || ('check-' + index);
    }

    function updateProgress() {
        let checkedCount = 0;
        toggles.forEach(toggle => {
            const parent = toggle.closest('.switch-item');
            if (toggle.checked) {
                checkedCount++;
                if (parent) parent.classList.add('completed');
            } else {
                if (parent) parent.classList.remove('completed');
            }
        });
        const percent = Math.round((checkedCount / toggles.length) * 100);
        if (progressBarFill) progressBarFill.style.width = percent + '%';
        if (progressPercent) progressPercent.textContent = percent + '%';
        saveChecklistState();
    }

    function saveChecklistState() {
        const state = {};
        toggles.forEach((toggle, idx) => {
            state[getToggleKey(toggle, idx)] = toggle.checked;
        });
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
    }

    function loadChecklistState() {
        const savedState = localStorage.getItem(CHECKLIST_STORAGE_KEY)
            || (CONFIG.countryCode === 'qa' ? localStorage.getItem('meccaTripChecklist') : null);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                toggles.forEach((toggle, idx) => {
                    const stableKey = getToggleKey(toggle, idx);
                    const legacyKey = toggle.dataset.legacyId || ('check-' + idx);
                    if (state[stableKey] !== undefined) {
                        toggle.checked = Boolean(state[stableKey]);
                    } else if (state[legacyKey] !== undefined) {
                        toggle.checked = Boolean(state[legacyKey]);
                    }
                });
            } catch (e) {
                console.error('Error loading checklist state:', e);
            }
        }
        updateProgress();
    }

    toggles.forEach((toggle) => {
        toggle.addEventListener('change', updateProgress);

        const itemRow = toggle.closest('.switch-item');
        if (itemRow) {
            itemRow.addEventListener('click', (e) => {
                if (e.target.closest('label.switch')) return;
                toggle.checked = !toggle.checked;
                updateProgress();
            });
        }
    });

    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            toggles.forEach(toggle => { toggle.checked = true; });
            updateProgress();
        });
    }

    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', () => {
            toggles.forEach(toggle => { toggle.checked = false; });
            updateProgress();
        });
    }

    loadChecklistState();
}

// 6. إدارة المظهر (الوضع النهاري / الداكن) مع احترام تفضيل النظام افتراضياً
// كابتشا نموذج الاقتراحات تُبنى من جديد عند تغيّر المظهر، وهذا مكلف (iframe خارجي).
// لذلك لا نعيد بناءها إلا إذا كان القسم مفتوحاً، وإلا نؤجلها إلى حين فتحه.
let captchaThemeStale = false;

function toggleTheme() {
    const body = document.body;
    // تعطيل الحركات الانتقالية أثناء التبديل: وإلا تحرّكت ألوان مئات العناصر معاً لثلث ثانية فيبدو التبديل بطيئاً
    body.classList.add('theme-switching');
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('darkGuideTheme', isLight ? 'light' : 'dark');
    updateThemeBtn(isLight);
    void body.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => body.classList.remove('theme-switching')));

    const suggestions = document.getElementById('section-suggestions');
    if (suggestions && suggestions.open) {
        changehCaptchaTheme(isLight ? 'light' : 'dark');
    } else {
        captchaThemeStale = true;
    }
}

function changehCaptchaTheme(newTheme) {
    captchaThemeStale = false;
    if (typeof hcaptcha !== 'undefined') {
        const wrapper = document.getElementById('h-captcha-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '';
            const newWidget = document.createElement('div');
            newWidget.className = 'h-captcha';
            newWidget.id = 'h-captcha-widget';
            newWidget.setAttribute('data-captcha', 'true');
            newWidget.setAttribute('data-lang', tx('captchaLang'));
            newWidget.setAttribute('data-theme', newTheme);
            newWidget.setAttribute('data-sitekey', '50b2fe65-b00b-4b9e-ad62-3ba471098be2');
            wrapper.appendChild(newWidget);
            try {
                hcaptcha.render(newWidget, {
                    sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
                    theme: newTheme,
                    hl: tx('captchaLang')
                });
            } catch (e) {
                console.error('Error rendering hCaptcha:', e);
            }
        }
    }
}

function updateThemeBtn(isLight) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    if (isLight) {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
        btn.title = tx('themeToDark');
    } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
        btn.title = tx('themeToLight');
    }
}

// 7. جلب درجة الحرارة ومواقيت الصلاة الفعلية لمكة المكرمة (دون إبقاء قيم وهمية عند الفشل)
// يعمل على أي عنصر يحمل data-makkah-temp، وصيغة العرض ونص الفشل يحددهما القالب
async function getMakkahTemp() {
    const tempEls = document.querySelectorAll('[data-makkah-temp]');
    if (!tempEls.length) return;
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.4266&longitude=39.8261&current_weather=true');
        if (!response.ok) throw new Error('Weather HTTP error');
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        if (Number.isNaN(temp)) throw new Error('Weather data error');
        tempEls.forEach((el) => {
            el.textContent = (el.dataset.tempFormat || '{t}°C').replace('{t}', temp);
        });
    } catch (e) {
        tempEls.forEach((el) => {
            el.textContent = el.dataset.tempFallback || '—';
        });
    }
}

function formatTime12Ar(time24) {
    if (!time24) return '';
    const clean = time24.split(' ')[0];
    const parts = clean.split(':');
    if (parts.length < 2) return time24;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const suffix = h >= 12 ? tx('pm') : tx('am');
    h = h % 12 || 12;
    return `${h}:${m} ${suffix}`;
}

async function getMakkahPrayers() {
    const line1 = document.getElementById('prayer-line-1');
    const line2 = document.getElementById('prayer-line-2');
    if (!line1 || !line2) return;

    try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi%20Arabia&method=4');
        if (!response.ok) throw new Error('Prayers HTTP error');
        const json = await response.json();
        if (!json || !json.data || !json.data.timings) throw new Error('Prayers data error');
        const t = json.data.timings;
        line1.textContent = tx('prayerLine1', { a: formatTime12Ar(t.Fajr), b: formatTime12Ar(t.Sunrise) });
        line2.textContent = tx('prayerLine2', { a: formatTime12Ar(t.Maghrib), b: formatTime12Ar(t.Isha) });
    } catch (e) {
        line1.textContent = tx('prayerOffline1');
        line2.textContent = tx('prayerOffline2');
    }
}

// 8. تحديد الموقع على المسار (عند الطلب فقط) مع تتبّع مباشر
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// أقصى بُعد عن خط المسار يُعدّ بعده المستخدم «خارج المسار».
// الخط بين نقطتين متتاليتين مستقيم بينما الطريق ينحني، فالهامش يغطي هذا الانحناء.
const OFF_ROUTE_THRESHOLD_KM = 60;
// معامل تقريبي لتحويل المسافة المستقيمة إلى مسافة طريق لمن هو خارج المسار
const ROAD_DETOUR_FACTOR = 1.22;

/**
 * يُسقط موقع المستخدم على أقرب مقطع من المسار (بين نقطتين متتاليتين) ويحسب المسافة المتبقية
 * بالاستيفاء بينهما، بدل القفز إلى أقرب محطة. يعيد أيضاً بُعد المستخدم عن خط المسار.
 */
function locateOnRoute(userLat, userLon, points) {
    // إسقاط مستوٍ محلي حول موقع المستخدم (دقيق كفاية لمقاطع بمئات الكيلومترات)
    const kmPerDegLon = 111.32 * Math.cos(userLat * Math.PI / 180);
    const kmPerDegLat = 110.57;
    let best = null;

    for (let i = 0; i < points.length - 1; i++) {
        const ax = (points[i].lon - userLon) * kmPerDegLon;
        const ay = (points[i].lat - userLat) * kmPerDegLat;
        const bx = (points[i + 1].lon - userLon) * kmPerDegLon;
        const by = (points[i + 1].lat - userLat) * kmPerDegLat;
        const dx = bx - ax;
        const dy = by - ay;
        const lengthSq = dx * dx + dy * dy;
        const t = lengthSq > 0 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / lengthSq)) : 0;
        const offKm = Math.hypot(ax + t * dx, ay + t * dy);
        if (!best || offKm < best.offKm) {
            best = { offKm, t, from: points[i], to: points[i + 1] };
        }
    }

    best.remainingKm = best.from.km - best.t * (best.from.km - best.to.km);
    return best;
}

function describeRoutePosition(match) {
    if (match.t <= 0.08) return match.from.name;
    if (match.t >= 0.92) return match.to.name;
    return tx('gpsBetween', { a: match.from.name, b: match.to.name });
}

/**
 * قسم المحطات الذي يقع فيه المسافر الآن. نقاط المسار مرتبة:
 * الانطلاق ← محطات الذهاب (outboundPointCount نقطة) ← مخرج الرياض ← بقية الطريق إلى مكة.
 */
function stationSectionForMatch(match, points) {
    const toIndex = points.indexOf(match.to);
    const outboundCount = CONFIG.outboundPointCount || 0;
    if (toIndex <= outboundCount) return 'section-stations-start';
    // بين مدخل الرياض (آخر محطة ذهاب) ومخرجها الغربي: محطات داخل المدينة
    if (toIndex === outboundCount + 1) return 'section-stations-riyadh';
    return 'section-stations-makkah';
}

// يميّز المقطع الحالي في قائمة «المحطات» بشريط الجوال (null لإزالة التمييز)
function markCurrentStationSection(sectionId) {
    document.querySelectorAll('.nav-sheet-item[data-target]').forEach((item) => {
        item.classList.toggle('is-current', Boolean(sectionId) && item.dataset.target === sectionId);
    });
}

let locationWatchId = null;
let hasLocationFix = false;

function setLocateButtonTracking(isTracking) {
    const btnLocate = document.getElementById('btnLocateMe');
    if (btnLocate) btnLocate.textContent = isTracking ? tx('gpsStop') : tx('gpsLocate');
}

function handleUserPosition(position) {
    const locNameEl = document.getElementById('currentLocationName');
    const points = Array.isArray(CONFIG.stations) ? CONFIG.stations : [];
    if (!locNameEl || points.length < 2) return;

    hasLocationFix = true;
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const match = locateOnRoute(userLat, userLon, points);

    if (match.offKm > OFF_ROUTE_THRESHOLD_KM) {
        const destination = points[points.length - 1];
        const nearest = match.t < 0.5 ? match.from : match.to;
        locNameEl.textContent = tx('gpsOffRoute', { n: nearest.name });
        calcRemaining(haversineKm(userLat, userLon, destination.lat, destination.lon) * ROAD_DETOUR_FACTOR);
        markCurrentStationSection(null);
    } else {
        locNameEl.textContent = describeRoutePosition(match);
        calcRemaining(match.remainingKm);
        markCurrentStationSection(stationSectionForMatch(match, points));
    }
}

function handleUserPositionError() {
    // أثناء التتبّع قد يفشل تحديث عابر: لا نمسح آخر موقع صحيح معروض
    if (hasLocationFix) return;
    const locNameEl = document.getElementById('currentLocationName');
    if (locNameEl) locNameEl.textContent = tx('gpsFailed', { city: CONFIG.defaultCity });
    calcRemaining(CONFIG.totalDistanceKm);
    stopLocationTracking();
}

function stopLocationTracking() {
    if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
    setLocateButtonTracking(false);
}

// زر «حدّد موقعي»: يبدأ تتبّعاً مباشراً يحدّث المسافة أثناء السير، والضغطة الثانية توقفه
function toggleLocationTracking() {
    const locNameEl = document.getElementById('currentLocationName');
    if (!locNameEl) return;

    if (locationWatchId !== null) {
        stopLocationTracking();
        return;
    }

    if (!navigator.geolocation) {
        locNameEl.textContent = tx('gpsUnsupported');
        return;
    }

    hasLocationFix = false;
    locNameEl.textContent = tx('gpsLocating');
    setLocateButtonTracking(true);
    locationWatchId = navigator.geolocation.watchPosition(
        handleUserPosition,
        handleUserPositionError,
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
    );
}

function calcRemaining(kmVal) {
    const km = (kmVal !== undefined && kmVal !== null) ? Math.max(0, Math.round(kmVal)) : CONFIG.totalDistanceKm;
    const remDistEl = document.getElementById('remDist');
    const remTimeEl = document.getElementById('remTime');
    const remArrivalEl = document.getElementById('remArrival');

    if (remDistEl) remDistEl.textContent = km.toLocaleString('en-US') + ' ' + tx('km');

    // الزمن الصافي للقيادة بسرعة متوسطة 100 كم/س
    const netDriveHours = km / 100;
    const netTotalMinutes = Math.round(netDriveHours * 60);
    const h = Math.floor(netTotalMinutes / 60);
    const m = netTotalMinutes % 60;

    let timeStr = '';
    if (h > 0 && m > 0) {
        timeStr = tx('timeHM', { h, m });
    } else if (h > 0) {
        timeStr = tx('timeH', { h });
    } else {
        timeStr = tx('timeM', { m });
    }
    if (remTimeEl) remTimeEl.textContent = timeStr;

    // وقت الوصول المتوقع من الموقع الحالي (بإضافة نسبة التوقفات والمنفذ ليتطابق مع الحاسبة العلوية)
    const ratio = CONFIG.totalDistanceKm > 0 ? (km / CONFIG.totalDistanceKm) : 0;
    const totalTripMinutes = Math.round(ratio * CONFIG.estimatedDriveHours * 60);
    const arrivalDate = new Date();
    arrivalDate.setMinutes(arrivalDate.getMinutes() + totalTripMinutes);

    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    if (remArrivalEl) remArrivalEl.textContent = arrivalDate.toLocaleDateString(DATE_LOCALE, options);
}

// 9. طباعة مسار الرحلة: فتح الأقسام وإعادتها يتمّان عبر beforeprint/afterprint فقط،
// فيعمل زر الطباعة و Ctrl+P بالطريقة نفسها
let savedAccordionStatesBeforePrint = null;

function expandAccordionsForPrint() {
    // قد يُطلق المتصفح beforeprint أكثر من مرة: لا نستبدل الحالة الأصلية المحفوظة
    if (savedAccordionStatesBeforePrint) return;
    const accordions = document.querySelectorAll('details.custom-accordion');
    savedAccordionStatesBeforePrint = Array.from(accordions).map(acc => acc.open);
    accordions.forEach(acc => acc.setAttribute('open', ''));
}

function restoreAccordionsAfterPrint() {
    if (!savedAccordionStatesBeforePrint) return;
    const accordions = document.querySelectorAll('details.custom-accordion');
    accordions.forEach((acc, idx) => {
        if (!savedAccordionStatesBeforePrint[idx]) {
            acc.removeAttribute('open');
        }
    });
    savedAccordionStatesBeforePrint = null;
    updateToggleIcon();
}

window.addEventListener('beforeprint', expandAccordionsForPrint);
window.addEventListener('afterprint', restoreAccordionsAfterPrint);

function printRoute() {
    window.print();
}

// 10. مشاركة الصفحة
function sharePage() {
    const url = window.location.href;
    const title = document.title;
    const text = `${title} 🕋\n${tx('shareText')}`;

    if (window.location.protocol !== 'file:' && navigator.share && window.isSecureContext) {
        navigator.share({
            title: title,
            text: text + '\n',
            url: url
        }).catch(() => {});
    } else {
        const shareTextWithUrl = `${title}\n${tx('shareText')}\n${url}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareTextWithUrl).then(() => {
                alert(tx('copied'));
            }).catch(() => {
                fallbackCopy(shareTextWithUrl);
            });
        } else {
            fallbackCopy(shareTextWithUrl);
        }
    }
}

function fallbackCopy(text) {
    try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert(tx('copied'));
    } catch (err) {
        alert(tx('copyFailed'));
    }
}

// 11. معالجة نموذج الاقتراحات وإرساله بالـ AJAX (باستخدام textContent للأمان)
function initSuggestionForm() {
    const suggestForm = document.getElementById('suggestionForm');
    const suggestStatus = document.getElementById('suggestionStatus');
    const suggestBtn = document.getElementById('btnSubmitSuggest');

    if (!suggestForm || !suggestStatus || !suggestBtn) return;

    suggestForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const accessKeyVal = suggestForm.querySelector('input[name="access_key"]')?.value.trim();
        if (!accessKeyVal || accessKeyVal === 'YOUR_ACCESS_KEY_HERE') {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.textContent = tx('formNoKey');
            suggestStatus.style.display = 'block';
            return;
        }

        const msgVal = document.getElementById('suggest_message')?.value.trim();
        if (!msgVal) {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.textContent = tx('formNoMessage');
            suggestStatus.style.display = 'block';
            return;
        }

        const hCaptchaVal = suggestForm.querySelector('textarea[name=h-captcha-response]')?.value;
        if (!hCaptchaVal) {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.textContent = tx('formNoCaptcha');
            suggestStatus.style.display = 'block';
            return;
        }

        suggestBtn.disabled = true;
        const originalText = suggestBtn.innerHTML;
        suggestBtn.textContent = tx('formSending');
        suggestStatus.style.display = 'none';

        const formData = new FormData(suggestForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                const res = await response.json();
                if (response.status === 200) {
                    suggestStatus.className = 'suggestion-status success';
                    suggestStatus.textContent = tx('formSuccess');
                    suggestForm.reset();
                    if (typeof hcaptcha !== 'undefined') {
                        hcaptcha.reset();
                    }
                } else {
                    suggestStatus.className = 'suggestion-status error';
                    suggestStatus.textContent = '❌ ' + (res.message || tx('formError'));
                }
            })
            .catch(() => {
                suggestStatus.className = 'suggestion-status error';
                suggestStatus.textContent = tx('formNetwork');
            })
            .then(() => {
                suggestBtn.disabled = false;
                suggestBtn.innerHTML = originalText;
                suggestStatus.style.display = 'block';

                if (suggestStatus.classList.contains('success')) {
                    setTimeout(() => {
                        suggestStatus.style.display = 'none';
                    }, 8000);
                }
            });
    });
}

// 12. مراقبة التمرير لتحديث شريط الجوال السفلي وتسجيل Service Worker للعمل بدون إنترنت
function initMobileScrollSpy() {
    const navButtons = document.querySelectorAll('.mobile-nav-btn[data-spy]');
    if (!navButtons.length || !('IntersectionObserver' in window)) return;

    // data-spy يحمل معرّفات كل الأقسام التابعة للزر (الزر الواحد قد يغطي عدة أقسام)
    const targetMap = {};
    navButtons.forEach(btn => {
        btn.getAttribute('data-spy').split(' ').filter(Boolean).forEach((targetId) => { targetMap[targetId] = btn; });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && targetMap[entry.target.id]) {
                navButtons.forEach(b => b.classList.remove('active'));
                targetMap[entry.target.id].classList.add('active');
            }
        });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

    Object.keys(targetMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

function registerPWA() {
    if (!('serviceWorker' in navigator) || window.location.protocol === 'file:' || !APP_SCRIPT_URL) return;
    // js/app.js ← ../sw.js = جذر الموقع، فيصحّ المسار من الرئيسية ومن صفحات الدول
    navigator.serviceWorker.register(new URL('../sw.js', APP_SCRIPT_URL)).catch(() => {});
}

function bootstrapApp() {
    // وظائف مشتركة بين كل الصفحات
    getMakkahTemp();
    registerPWA();

    if (IS_COUNTRY_PAGE) bootstrapCountryPage();
}

function bootstrapCountryPage() {
    // المظهر يُطبَّق قبل أول رسم عبر سكربت صغير في الصفحة نفسها؛ هنا نطابق أيقونة الزر فقط
    const isLight = document.body.classList.contains('light-mode');
    updateThemeBtn(isLight);

    const captchaWidget = document.getElementById('h-captcha-widget');
    if (captchaWidget) {
        captchaWidget.setAttribute('data-theme', isLight ? 'light' : 'dark');
    }

    initAccordions();
    initChecklist();
    calcRemaining(CONFIG.totalDistanceKm);
    calculateFuel();
    getMakkahPrayers();
    initSuggestionForm();
    initMobileScrollSpy();

    const suggestionsDetails = document.getElementById('section-suggestions');
    if (suggestionsDetails) {
        suggestionsDetails.addEventListener('toggle', () => {
            if (suggestionsDetails.open) {
                const wrapper = document.getElementById('h-captcha-wrapper');
                if (wrapper && (captchaThemeStale || !wrapper.querySelector('iframe')) && typeof hcaptcha !== 'undefined') {
                    changehCaptchaTheme(document.body.classList.contains('light-mode') ? 'light' : 'dark');
                }
            }
        });
    }
}

bootstrapApp();
