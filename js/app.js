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

// التخزين المحلي قد يكون معطلاً أو ممتلئاً (تصفح خاص، إعدادات صارمة): لا نترك ذلك يوقف أي وظيفة
function storageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) { /* نكمل بلا حفظ */ }
}

// طلب شبكة بمهلة: على تغطية الطريق الضعيفة لا نترك النص معلقاً على «جاري التحديث» أو «جاري الإرسال» طويلاً
function fetchWithTimeout(url, timeoutMs, options = {}) {
    if (typeof AbortController === 'undefined') return fetch(url, options);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * المسارات الكاملة للدولة (الأول افتراضي). الدولة ذات المنافذ المختلفة لها أكثر من مسار، ولكل مسار
 * مسافته وزمنه ونقاط GPS. المسار المختار محفوظ في body[data-route] (يضبطه سكربت صغير قبل أول رسم).
 * (الصفحات المخزّنة قبل دعم المسارات المتعددة تحمل الحقول القديمة مباشرة في COUNTRY_DATA.)
 */
const ROUTES = Array.isArray(CONFIG.routes) && CONFIG.routes.length
    ? CONFIG.routes
    : [{ id: 'main', totalDistanceKm: CONFIG.totalDistanceKm, estimatedDriveHours: CONFIG.estimatedDriveHours, stations: CONFIG.stations || [] }];
const ROUTE_STORAGE_KEY = `selectedRoute_${CONFIG.countryCode}`;

function activeRoute() {
    const id = document.body.dataset.route;
    return ROUTES.find(r => r.id === id) || ROUTES[0];
}

const PREFERS_REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. إدارة فتح وطي الأقسام (Accordions) - مغلقة في أول زيارة، ثم تُستعاد كما تركها المسافر
// (من يفتح الدليل عند كل توقف يجد قسم محطاته مفتوحاً دون البحث عنه من جديد)
const OPEN_SECTIONS_STORAGE_KEY = `guideOpenSections_${CONFIG.countryCode}`;
// نموذج الاقتراحات لا يُستعاد مفتوحاً: فتحه يحمّل الكابتشا الخارجية بلا حاجة
const NON_PERSISTENT_SECTIONS = ['section-suggestions'];
let isAllExpanded = false;

function loadOpenSections() {
    try {
        const ids = JSON.parse(storageGet(OPEN_SECTIONS_STORAGE_KEY));
        return Array.isArray(ids) ? ids : [];
    } catch (e) {
        return [];
    }
}

// «فتح/طي الكل» يطلق حدث toggle لكل قسم: نجمع الحفظ في كتابة واحدة بعد انتهائها
let saveOpenSectionsTimer = null;

function saveOpenSections() {
    clearTimeout(saveOpenSectionsTimer);
    saveOpenSectionsTimer = setTimeout(() => {
        // أثناء الطباعة تُفتح كل الأقسام مؤقتاً: لا نحفظ هذه الحالة العابرة
        if (savedAccordionStatesBeforePrint) return;
        const ids = Array.from(document.querySelectorAll('details.custom-accordion[open][id]'))
            .map(details => details.id)
            .filter(id => !NON_PERSISTENT_SECTIONS.includes(id));
        storageSet(OPEN_SECTIONS_STORAGE_KEY, JSON.stringify(ids));
    }, 50);
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

    target.scrollIntoView({ behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });

    if (btnEl) setActiveNavButton(btnEl);
}

function setActiveNavButton(btnEl) {
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
}

// قوائم شريط الجوال («المحطات» و«المزيد»): قائمة صغيرة تظهر فوق الشريط لاختيار القسم
// returnFocus: عند الإغلاق دون اختيار (Escape أو الخلفية) يعود التركيز إلى الزر الذي فتح القائمة
function closeNavSheets(returnFocus) {
    const openSheet = document.querySelector('.nav-sheet.is-open');
    const opener = openSheet ? document.querySelector(`.mobile-nav-btn[data-sheet="${openSheet.id}"]`) : null;
    document.querySelectorAll('.nav-sheet.is-open').forEach(sheet => sheet.classList.remove('is-open'));
    document.querySelectorAll('.mobile-nav-btn[data-sheet]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    const backdrop = document.getElementById('navSheetBackdrop');
    if (backdrop) backdrop.classList.remove('is-open');
    if (returnFocus === true && opener) opener.focus({ preventScroll: true });
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
    const openSheet = document.querySelector('.nav-sheet.is-open');
    if (!openSheet) return;
    if (e.key === 'Escape') {
        closeNavSheets(true);
        return;
    }
    // حصر التنقل بـ Tab داخل القائمة المفتوحة (role="dialog")
    if (e.key === 'Tab') {
        const items = Array.from(openSheet.querySelectorAll('button'));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        } else if (!openSheet.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        }
    }
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
    const depDate = depInput ? new Date(depInput) : null;
    if (depDate && !Number.isNaN(depDate.getTime())) {
        const totalMinutes = Math.round(activeRoute().estimatedDriveHours * 60);
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
        storageSet(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
    }

    function loadChecklistState() {
        // meccaTripChecklist: مفتاح الإصدار الأول (قطر فقط) قبل فصل الحالة لكل دولة
        const savedState = storageGet(CHECKLIST_STORAGE_KEY)
            || (CONFIG.countryCode === 'qa' ? storageGet('meccaTripChecklist') : null);
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
let captchaRendered = false;

function toggleTheme() {
    const body = document.body;
    // تعطيل الحركات الانتقالية أثناء التبديل: وإلا تحرّكت ألوان مئات العناصر معاً لثلث ثانية فيبدو التبديل بطيئاً
    body.classList.add('theme-switching');
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    storageSet('darkGuideTheme', isLight ? 'light' : 'dark');
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

/**
 * كابتشا نموذج الاقتراحات (hCaptcha بمفتاح Web3Forms العام). سكربتها الخارجي لا يُحمَّل مع الصفحة،
 * بل عند أول فتح لقسم الاقتراحات، فلا تُطلب أي موارد خارجية لمن لا يستخدم النموذج.
 */
let hcaptchaLoading = null;

function loadHcaptcha() {
    if (typeof hcaptcha !== 'undefined') return Promise.resolve();
    if (!hcaptchaLoading) {
        hcaptchaLoading = new Promise((resolve, reject) => {
            window.onHcaptchaLoad = resolve;
            const script = document.createElement('script');
            script.src = `https://js.hcaptcha.com/1/api.js?render=explicit&onload=onHcaptchaLoad&recaptchacompat=off&hl=${encodeURIComponent(tx('captchaLang'))}`;
            script.async = true;
            script.onerror = () => {
                hcaptchaLoading = null;
                reject(new Error('hCaptcha failed to load'));
            };
            document.head.appendChild(script);
        });
    }
    return hcaptchaLoading;
}

function renderCaptcha(theme) {
    const wrapper = document.getElementById('h-captcha-wrapper');
    if (!wrapper || !wrapper.dataset.sitekey) return;
    captchaThemeStale = false;
    loadHcaptcha().then(() => {
        wrapper.innerHTML = '';
        const widget = document.createElement('div');
        widget.className = 'h-captcha';
        widget.id = 'h-captcha-widget';
        wrapper.appendChild(widget);
        hcaptcha.render(widget, { sitekey: wrapper.dataset.sitekey, theme, hl: tx('captchaLang') });
        captchaRendered = true;
    }).catch((e) => {
        // بلا إنترنت: يبقى النموذج ظاهراً، ويُعاد المحاولة عند فتح القسم مرة أخرى
        console.error('Error rendering hCaptcha:', e);
    });
}

function changehCaptchaTheme(newTheme) {
    renderCaptcha(newTheme);
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
        const response = await fetchWithTimeout('https://api.open-meteo.com/v1/forecast?latitude=21.4266&longitude=39.8261&current_weather=true', 8000);
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

// مواقيت اليوم تُحفظ محلياً بتاريخ مكة، فتظهر فوراً (وبلا إنترنت) عند فتح الدليل مرة أخرى في اليوم نفسه
const PRAYERS_STORAGE_KEY = 'makkahPrayerTimes';

function makkahToday() {
    try {
        return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date());
    } catch (e) {
        return new Date().toISOString().slice(0, 10);
    }
}

function renderPrayers(timings) {
    document.getElementById('prayer-line-1').textContent = tx('prayerLine1', { a: formatTime12Ar(timings.Fajr), b: formatTime12Ar(timings.Sunrise) });
    document.getElementById('prayer-line-2').textContent = tx('prayerLine2', { a: formatTime12Ar(timings.Maghrib), b: formatTime12Ar(timings.Isha) });
}

async function getMakkahPrayers() {
    const line1 = document.getElementById('prayer-line-1');
    const line2 = document.getElementById('prayer-line-2');
    if (!line1 || !line2) return;

    const today = makkahToday();
    try {
        const cached = JSON.parse(storageGet(PRAYERS_STORAGE_KEY));
        if (cached && cached.day === today && cached.timings) {
            renderPrayers(cached.timings);
            return;
        }
    } catch (e) { /* كاش تالف: نجلب من جديد */ }

    try {
        const response = await fetchWithTimeout('https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi%20Arabia&method=4', 8000);
        if (!response.ok) throw new Error('Prayers HTTP error');
        const json = await response.json();
        if (!json || !json.data || !json.data.timings) throw new Error('Prayers data error');
        const { Fajr, Sunrise, Maghrib, Isha } = json.data.timings;
        const timings = { Fajr, Sunrise, Maghrib, Isha };
        renderPrayers(timings);
        storageSet(PRAYERS_STORAGE_KEY, JSON.stringify({ day: today, timings }));
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
 * قسم المحطات الذي يقع فيه المسافر الآن: كل نقطة مسار تحمل (leg) معرّف القسم الذي يقع فيه
 * الطريق المؤدي إليها، ويحسبه build.js من أقسام الدولة نفسها، فلا يفترض الكود أي ممر ثابت.
 */
function stationSectionForMatch(match) {
    return match.to.leg || null;
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

let lastPosition = null;

/**
 * يُسقط الموقع على المسار المختار. إن كان المسافر خارجه لكنه على مسار كامل آخر للدولة
 * (منفذ آخر)، يُختار ذلك المسار تلقائياً. أما على مقطع يشترك فيه المساران فيبقى اختيار المسافر.
 */
function matchUserOnRoutes(userLat, userLon) {
    let route = activeRoute();
    let match = route.stations.length >= 2 ? locateOnRoute(userLat, userLon, route.stations) : null;
    if (ROUTES.length > 1 && (!match || match.offKm > OFF_ROUTE_THRESHOLD_KM)) {
        ROUTES.forEach((candidate) => {
            if (candidate === route || candidate.stations.length < 2) return;
            const m = locateOnRoute(userLat, userLon, candidate.stations);
            if (m.offKm <= OFF_ROUTE_THRESHOLD_KM && (!match || m.offKm < match.offKm)) {
                route = candidate;
                match = m;
            }
        });
        if (route !== activeRoute()) selectRoute(route.id, true);
    }
    return { route, match };
}

function handleUserPosition(position) {
    const locNameEl = document.getElementById('currentLocationName');
    if (!locNameEl) return;

    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const { route, match } = matchUserOnRoutes(userLat, userLon);
    if (!match) return;
    const points = route.stations;

    hasLocationFix = true;
    lastPosition = position;

    if (match.offKm > OFF_ROUTE_THRESHOLD_KM) {
        const destination = points[points.length - 1];
        const nearest = match.t < 0.5 ? match.from : match.to;
        locNameEl.textContent = tx('gpsOffRoute', { n: nearest.name });
        calcRemaining(haversineKm(userLat, userLon, destination.lat, destination.lon) * ROAD_DETOUR_FACTOR);
        markCurrentStationSection(null);
    } else {
        locNameEl.textContent = describeRoutePosition(match);
        calcRemaining(match.remainingKm);
        markCurrentStationSection(stationSectionForMatch(match));
    }
}

function handleUserPositionError() {
    // أثناء التتبّع قد يفشل تحديث عابر: لا نمسح آخر موقع صحيح معروض
    if (hasLocationFix) return;
    const locNameEl = document.getElementById('currentLocationName');
    if (locNameEl) locNameEl.textContent = tx('gpsFailed', { city: CONFIG.defaultCity });
    calcRemaining(activeRoute().totalDistanceKm);
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
    const route = activeRoute();
    const km = (kmVal !== undefined && kmVal !== null) ? Math.max(0, Math.round(kmVal)) : route.totalDistanceKm;
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
    const ratio = route.totalDistanceKm > 0 ? (km / route.totalDistanceKm) : 0;
    const totalTripMinutes = Math.round(ratio * route.estimatedDriveHours * 60);
    const arrivalDate = new Date();
    arrivalDate.setMinutes(arrivalDate.getMinutes() + totalTripMinutes);

    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    if (remArrivalEl) remArrivalEl.textContent = arrivalDate.toLocaleDateString(DATE_LOCALE, options);
}

/**
 * يعتمد مساراً كاملاً: تُخفى أقسام المسارات الأخرى (قواعد CSS مولّدة حسب body[data-route])،
 * وتتبعه المسافة الكلية وحاسبة الوقود ووقت الوصول. fromGps: الاختيار جاء من موقع المسافر نفسه.
 */
function selectRoute(routeId, fromGps) {
    const route = ROUTES.find(r => r.id === routeId);
    if (!route || ROUTES.length < 2) return;
    document.body.dataset.route = route.id;
    storageSet(ROUTE_STORAGE_KEY, route.id);
    syncRouteUi();

    const calcDistEl = document.getElementById('calc-distance');
    if (calcDistEl) {
        calcDistEl.value = route.totalDistanceKm;
        calculateFuel();
    }
    calcArrival();
    // اختيار يدوي أثناء التتبّع: يُعاد حساب الموقع على المسار الجديد
    if (!fromGps) {
        if (lastPosition) handleUserPosition(lastPosition);
        else calcRemaining(route.totalDistanceKm);
    }
}

function syncRouteUi() {
    const route = activeRoute();
    document.querySelectorAll('[data-route-select]').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.routeSelect === route.id));
    });
    document.querySelectorAll('[data-route-total]').forEach((el) => {
        el.textContent = route.totalDistanceKm.toLocaleString('en-US') + ' ' + tx('km');
    });
}

function initRouteSwitch() {
    if (ROUTES.length < 2) return;
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-route-select]');
        if (btn) selectRoute(btn.dataset.routeSelect, false);
    });
    syncRouteUi();
    const calcDistEl = document.getElementById('calc-distance');
    if (calcDistEl) calcDistEl.value = activeRoute().totalDistanceKm;
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
// مهلة الإرسال: بعدها تظهر رسالة تعذّر الاتصال بدل بقاء الزر على «جاري الإرسال»
const SUBMIT_TIMEOUT_MS = 20000;
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

        fetchWithTimeout('https://api.web3forms.com/submit', SUBMIT_TIMEOUT_MS, {
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

/**
 * الصفحة المفتوحة ونسختها باللغة الأخرى تُطلب من Service Worker تخزينها للعمل دون اتصال.
 * (أول زيارة تسبق تثبيت Service Worker، فلا تمر الصفحة عبره ولا تُخزَّن تلقائياً.)
 */
function pagesToCacheOffline() {
    const urls = [window.location.href];
    document.querySelectorAll('link[rel="alternate"][hreflang]:not([hreflang="x-default"])').forEach((link) => {
        try {
            const url = new URL(link.href, window.location.href);
            if (url.origin === window.location.origin) urls.push(url.href);
        } catch (e) { /* رابط غير صالح: نتجاهله */ }
    });
    return urls;
}

function registerPWA() {
    if (!('serviceWorker' in navigator) || window.location.protocol === 'file:' || !APP_SCRIPT_URL) return;
    // js/app.js ← ../sw.js = جذر الموقع، فيصحّ المسار من الرئيسية ومن صفحات الدول
    navigator.serviceWorker.register(new URL('../sw.js', APP_SCRIPT_URL)).catch(() => {});
    navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) registration.active.postMessage({ type: 'CACHE_PAGES', urls: pagesToCacheOffline() });
    }).catch(() => {});
}

/**
 * تنبيه «تثبيت التطبيق» أعلى الصفحة: يظهر فقط حين يعرض المتصفح التثبيت فعلاً (حدث beforeinstallprompt
 * في Chrome و Edge وأندرويد)، فلا يظهر في متصفح لا يدعمه ولا بعد التثبيت.
 * الإغلاق يخفيه 30 يوماً، والتثبيت يخفيه نهائياً.
 */
const INSTALL_DISMISSED_KEY = 'installBannerDismissedAt';
const INSTALL_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

function installBannerSnoozed() {
    const at = Number(storageGet(INSTALL_DISMISSED_KEY));
    return at > 0 && (at === Infinity || Date.now() - at < INSTALL_SNOOZE_MS);
}

function initInstallBanner() {
    let deferredPrompt = null;
    let banner = null;

    // التنبيه ثابت أعلى الشاشة: نزيح محتوى الصفحة بقدر ارتفاعه فلا يغطي عنوانها
    const basePadding = () => {
        document.body.style.paddingTop = '';
        return parseFloat(getComputedStyle(document.body).paddingTop) || 0;
    };
    const reserveSpace = () => {
        if (banner) document.body.style.paddingTop = `${basePadding() + banner.offsetHeight}px`;
    };

    const hide = () => {
        if (banner) banner.remove();
        banner = null;
        document.body.style.paddingTop = '';
        window.removeEventListener('resize', reserveSpace);
    };

    const show = () => {
        if (banner) return;
        banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', tx('installTitle'));
        const text = document.createElement('div');
        text.className = 'install-banner-text';
        const title = document.createElement('strong');
        title.textContent = tx('installTitle');
        const desc = document.createElement('span');
        desc.textContent = tx('installText');
        text.append(title, desc);

        const installBtn = document.createElement('button');
        installBtn.type = 'button';
        installBtn.className = 'install-banner-btn';
        installBtn.textContent = tx('installBtn');
        installBtn.addEventListener('click', () => {
            if (!deferredPrompt) return hide();
            const promptEvent = deferredPrompt;
            deferredPrompt = null;
            hide();
            promptEvent.prompt();
            // رفض نافذة المتصفح نفسها يُعامل كالإغلاق
            promptEvent.userChoice.then((choice) => {
                if (choice && choice.outcome === 'dismissed') storageSet(INSTALL_DISMISSED_KEY, String(Date.now()));
            }).catch(() => {});
        });

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'install-banner-close';
        closeBtn.setAttribute('aria-label', tx('installClose'));
        closeBtn.title = tx('installClose');
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
            storageSet(INSTALL_DISMISSED_KEY, String(Date.now()));
            hide();
        });

        banner.append(text, installBtn, closeBtn);
        document.body.prepend(banner);
        reserveSpace();
        window.addEventListener('resize', reserveSpace);
    };

    window.addEventListener('beforeinstallprompt', (e) => {
        if (installBannerSnoozed()) return; // يبقى خيار المتصفح نفسه (في شريط العنوان أو القائمة) كما هو
        e.preventDefault();
        deferredPrompt = e;
        show();
    });
    window.addEventListener('appinstalled', () => {
        storageSet(INSTALL_DISMISSED_KEY, 'Infinity');
        deferredPrompt = null;
        hide();
    });
}

function bootstrapApp() {
    // وظائف مشتركة بين كل الصفحات
    initInstallBanner();
    getMakkahTemp();
    registerPWA();

    if (IS_COUNTRY_PAGE) bootstrapCountryPage();
}

function bootstrapCountryPage() {
    // المظهر يُطبَّق قبل أول رسم عبر سكربت صغير في الصفحة نفسها؛ هنا نطابق أيقونة الزر فقط
    const isLight = document.body.classList.contains('light-mode');
    updateThemeBtn(isLight);

    initAccordions();
    initChecklist();
    initRouteSwitch();
    calcRemaining(activeRoute().totalDistanceKm);
    calculateFuel();
    getMakkahPrayers();
    initSuggestionForm();
    initMobileScrollSpy();

    const suggestionsDetails = document.getElementById('section-suggestions');
    if (suggestionsDetails) {
        suggestionsDetails.addEventListener('toggle', () => {
            if (suggestionsDetails.open && (!captchaRendered || captchaThemeStale)) {
                renderCaptcha(document.body.classList.contains('light-mode') ? 'light' : 'dark');
            }
        });
    }
}

bootstrapApp();
