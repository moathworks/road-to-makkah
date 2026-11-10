/**
 * دليل السفر البري إلى مكة المكرمة - الملف البرمجي الموحد (Mobile-First Architecture)
 * يدعم تعدد الدول، حساب المسافات بمعادلة Haversine، حاسبة الوقود، الطقس ومواقيت الصلاة الحية، والعمل دون اتصال (PWA)
 */

// قوالب الإعدادات الجاهزة لجميع دول المشروع (تُفعل تلقائياً عبر data-country على وسم body أو window.COUNTRY_CONFIG)
const COUNTRY_PRESETS = {
    qa: {
        countryCode: 'qa',
        countryName: 'قطر',
        defaultCity: 'الدوحة (افتراضي)',
        totalDistanceKm: 1480,
        estimatedDriveHours: 16,
        locale: 'ar-QA',
        fuelPriceDefault: 2.18,
        nationalIdLabel: 'البطاقة الشخصية القطرية QID',
        emergencyNumber: '999',
        flagFile: 'qa-flag.png',
        camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد سلوى وحتى خريص، وبعد القويعية وحتى الطائف.',
        stations: [
            { km: 1480, name: 'الانطلاق (الدوحة)', lat: 25.2854, lon: 51.5310 },
            { km: 1390, name: 'منفذ أبو سمرة / سلوى', lat: 24.7441, lon: 50.8354 },
            { km: 1210, name: 'محطة ساسكو (طريق خريص)', lat: 25.1278, lon: 48.1633 },
            { km: 1040, name: 'محطة جو ستيشن (طريق 80)', lat: 25.0500, lon: 47.4500 },
            { km: 950, name: 'بداية الرياض (الدريس)', lat: 24.8333, lon: 46.8500 },
            { km: 900, name: 'مخرج الرياض (طويق / القدية)', lat: 24.5800, lon: 46.3500 },
            { km: 770, name: 'محطة ساسكو (القويعية)', lat: 24.0489, lon: 45.2494 },
            { km: 600, name: 'محطة ساسكو (الخاصرة)', lat: 23.4500, lon: 43.9500 },
            { km: 455, name: 'محطة ساسكو (الحوميات)', lat: 22.9500, lon: 42.8500 },
            { km: 380, name: 'محطة ساسكو (ظلم)', lat: 22.6500, lon: 42.1800 },
            { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6267, lon: 40.4267 },
            { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
        ]
    },
    ae: {
        countryCode: 'ae',
        countryName: 'الإمارات',
        defaultCity: 'أبوظبي (افتراضي)',
        totalDistanceKm: 1550,
        estimatedDriveHours: 16.5,
        locale: 'ar-AE',
        fuelPriceDefault: 2.18,
        nationalIdLabel: 'بطاقة الهوية الإماراتية',
        emergencyNumber: '999',
        flagFile: 'ae-flag.png',
        camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد منفذ البطحاء وحتى حرض/الأحساء، وبعد القويعية وحتى الطائف.',
        stations: [
            { km: 1550, name: 'الانطلاق (أبوظبي)', lat: 24.4539, lon: 54.3773 },
            { km: 1210, name: 'منفذ الغويفات / البطحاء', lat: 24.1322, lon: 51.5739 },
            { km: 950, name: 'الرياض', lat: 24.7136, lon: 46.6753 },
            { km: 770, name: 'محطة ساسكو (القويعية)', lat: 24.0489, lon: 45.2494 },
            { km: 380, name: 'محطة ساسكو (ظلم)', lat: 22.6500, lon: 42.1800 },
            { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6267, lon: 40.4267 },
            { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
        ]
    },
    bh: {
        countryCode: 'bh',
        countryName: 'البحرين',
        defaultCity: 'المنامة (افتراضي)',
        totalDistanceKm: 1280,
        estimatedDriveHours: 13.5,
        locale: 'ar-BH',
        fuelPriceDefault: 2.18,
        nationalIdLabel: 'البطاقة الشخصية البحرينية',
        emergencyNumber: '999',
        flagFile: 'bh-flag.png',
        camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد القويعية وحتى الطائف.',
        stations: [
            { km: 1280, name: 'الانطلاق (المنامة - جسر الملك فهد)', lat: 26.1856, lon: 50.3267 },
            { km: 950, name: 'بداية الرياض (الدريس)', lat: 24.8333, lon: 46.8500 },
            { km: 770, name: 'محطة ساسكو (القويعية)', lat: 24.0489, lon: 45.2494 },
            { km: 380, name: 'محطة ساسكو (ظلم)', lat: 22.6500, lon: 42.1800 },
            { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6267, lon: 40.4267 },
            { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
        ]
    },
    kw: {
        countryCode: 'kw',
        countryName: 'الكويت',
        defaultCity: 'مدينة الكويت (افتراضي)',
        totalDistanceKm: 1250,
        estimatedDriveHours: 13.5,
        locale: 'ar-KW',
        fuelPriceDefault: 2.18,
        nationalIdLabel: 'البطاقة المدنية الكويتية',
        emergencyNumber: '112',
        flagFile: 'kw-flag.png',
        camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد منفذ السالمي/الرقعي، وعلى طريق شقراء - المويه - الطائف.',
        stations: [
            { km: 1250, name: 'الانطلاق (الكويت)', lat: 29.3759, lon: 47.9774 },
            { km: 1140, name: 'منفذ السالمي / الرقعي', lat: 29.0789, lon: 46.6631 },
            { km: 730, name: 'المجمعة / شقراء', lat: 25.9044, lon: 45.3447 },
            { km: 380, name: 'ظلم / المويه', lat: 22.6500, lon: 42.1800 },
            { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6267, lon: 40.4267 },
            { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
        ]
    },
    om: {
        countryCode: 'om',
        countryName: 'عُمان',
        defaultCity: 'مسقط (افتراضي)',
        totalDistanceKm: 1950,
        estimatedDriveHours: 20,
        locale: 'ar-OM',
        fuelPriceDefault: 2.18,
        nationalIdLabel: 'البطاقة الشخصية العُمانية',
        emergencyNumber: '9999',
        flagFile: 'om-flag.png',
        camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة والرمال المتحركة على طريق الربع الخالي - شيبة - البطحاء، وبعد القويعية وحتى الطائف.',
        stations: [
            { km: 1950, name: 'الانطلاق (مسقط)', lat: 23.5880, lon: 58.3829 },
            { km: 1620, name: 'منفذ الربع الخالي (رملة خيلة)', lat: 22.0083, lon: 55.5667 },
            { km: 950, name: 'الرياض / الخرج', lat: 24.1483, lon: 47.3050 },
            { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6267, lon: 40.4267 },
            { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
        ]
    },
    sa: {
        countryCode: 'sa',
        countryName: 'السعودية',
        defaultCity: 'الرياض (افتراضي)',
        totalDistanceKm: 870,
        estimatedDriveHours: 9,
        locale: 'ar-SA',
        fuelPriceDefault: 2.18,
        nationalIdLabel: 'الهوية الوطنية السعودية / الإقامة',
        emergencyNumber: '911',
        flagFile: 'sa-flag.png',
        camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد القويعية وحتى الطائف.',
        stations: [
            { km: 870, name: 'الانطلاق (الرياض)', lat: 24.7136, lon: 46.6753 },
            { km: 770, name: 'محطة ساسكو (القويعية)', lat: 24.0489, lon: 45.2494 },
            { km: 380, name: 'محطة ساسكو (ظلم)', lat: 22.6500, lon: 42.1800 },
            { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6267, lon: 40.4267 },
            { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
        ]
    }
};

const bodyCountryKey = (typeof document !== 'undefined' && document.body && document.body.dataset.country) || 'qa';
const DEFAULT_CONFIG = COUNTRY_PRESETS[bodyCountryKey] || COUNTRY_PRESETS.qa;

const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.COUNTRY_CONFIG || {});
const CHECKLIST_STORAGE_KEY = `meccaTripChecklist_${CONFIG.countryCode}`;

// 1. إدارة فتح وطي الأقسام (Accordions) - مغلقة افتراضياً لتجربة تصفح نظيفة وسريعة
let isAllExpanded = false;

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

    accordions.forEach((acc, index) => {
        const id = getAccordionKey(acc, index);
        if (willExpand) {
            acc.setAttribute('open', '');
            localStorage.setItem(id, 'open');
        } else {
            acc.removeAttribute('open');
            localStorage.setItem(id, 'closed');
        }
    });

    updateToggleIcon();
}

function getAccordionKey(details, index) {
    if (details.id) return `detailsState_v2_${CONFIG.countryCode}_${details.id}`;
    const titleElement = details.querySelector('summary');
    const slug = titleElement ? titleElement.textContent.trim().replace(/\s+/g, '_') : index;
    return `detailsState_v2_${CONFIG.countryCode}_${slug}`;
}

function initAccordions() {
    const detailsElements = document.querySelectorAll('details.custom-accordion');

    detailsElements.forEach((details, index) => {
        const storageKey = getAccordionKey(details, index);
        const savedState = localStorage.getItem(storageKey);

        if (savedState === 'open') {
            details.setAttribute('open', '');
        } else {
            // مغلقة بشكل افتراضي في جميع الشاشات ما لم يقم المستخدم بفتحها
            details.removeAttribute('open');
        }

        details.addEventListener('toggle', () => {
            localStorage.setItem(storageKey, details.open ? 'open' : 'closed');
            updateToggleIcon();
        });
    });

    updateToggleIcon();
}

// الانتقال السلس من شريط الجوال السفلي مع فتح القسم تلقائياً إن كان مطوياً
function navigateToSection(sectionId, btnEl) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (target.tagName.toLowerCase() === 'details' && !target.open) {
        target.setAttribute('open', '');
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (btnEl) {
        document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
}

// 2. بدء الرحلة وفتح ملاحة خرائط جوجل
function startJourney() {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate', '_blank', 'noopener');
}

// 3. حساب وقت الوصول المتوقع
function calcArrival() {
    const depInputEl = document.getElementById('dep-time');
    const arrDisplay = document.getElementById('arr-time');
    if (!depInputEl || !arrDisplay) return;

    const depInput = depInputEl.value;
    if (depInput) {
        const depDate = new Date(depInput);
        depDate.setHours(depDate.getHours() + CONFIG.estimatedDriveHours);

        const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        arrDisplay.textContent = depDate.toLocaleDateString(CONFIG.locale, options);
    } else {
        arrDisplay.textContent = 'حدد وقت الانطلاق';
    }
}

// 4. حاسبة تكلفة الوقود التقديرية
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

    litersEl.textContent = liters.toFixed(1) + ' لتر';
    totalEl.textContent = Math.round(totalCost).toLocaleString() + ' ريال';
}

// 5. نظام قائمة المهام بسحّابات (Checklist)
function initChecklist() {
    const toggles = document.querySelectorAll('.checklist-toggle');
    const progressBarFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');

    if (!toggles.length) return;

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
        toggles.forEach(toggle => { state[toggle.id] = toggle.checked; });
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
        // توافق مع المفتاح القديم
        localStorage.setItem('meccaTripChecklist', JSON.stringify(state));
    }

    function loadChecklistState() {
        const savedState = localStorage.getItem(CHECKLIST_STORAGE_KEY) || localStorage.getItem('meccaTripChecklist');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                toggles.forEach(toggle => {
                    if (state[toggle.id] !== undefined) toggle.checked = state[toggle.id];
                });
            } catch (e) {
                console.error('Error loading checklist state:', e);
            }
        }
        updateProgress();
    }

    toggles.forEach((toggle, index) => {
        toggle.id = 'check-' + index;
        toggle.addEventListener('change', updateProgress);

        // السماح بالنقر على كامل سطر البند في الجوال لتبديل الحالة بسهولة
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
    window.updateProgress = updateProgress;
}

// 6. إدارة المظهر (الوضع النهاري / الداكن)
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('darkGuideTheme', isLight ? 'light' : 'dark');
    localStorage.setItem('makkahDarkMode', isLight ? 'false' : 'true');
    updateThemeBtn(isLight);
    changehCaptchaTheme(isLight ? 'light' : 'dark');
}

function changehCaptchaTheme(newTheme) {
    if (typeof hcaptcha !== 'undefined') {
        const wrapper = document.getElementById('h-captcha-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '';
            const newWidget = document.createElement('div');
            newWidget.className = 'h-captcha';
            newWidget.id = 'h-captcha-widget';
            newWidget.setAttribute('data-captcha', 'true');
            newWidget.setAttribute('data-lang', 'ar');
            newWidget.setAttribute('data-theme', newTheme);
            newWidget.setAttribute('data-sitekey', '50b2fe65-b00b-4b9e-ad62-3ba471098be2');
            wrapper.appendChild(newWidget);
            try {
                hcaptcha.render(newWidget, {
                    sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
                    theme: newTheme,
                    hl: 'ar'
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
        btn.title = 'تفعيل المظهر الداكن';
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
        btn.title = 'تفعيل المظهر النهاري';
    }
}

// 7. جلب درجة الحرارة ومواقيت الصلاة الفعلية لمكة المكرمة
async function getMakkahTemp() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.4266&longitude=39.8261&current_weather=true');
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const tempEl = document.getElementById('makkah-temp');
        if (tempEl) tempEl.textContent = `${temp}°C`;
    } catch (e) {
        // الإبقاء على القيمة الافتراضية عند عدم توفر الإنترنت
    }
}

function formatTime12Ar(time24) {
    if (!time24) return '';
    const clean = time24.split(' ')[0];
    const parts = clean.split(':');
    if (parts.length < 2) return time24;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const suffix = h >= 12 ? 'م' : 'ص';
    h = h % 12 || 12;
    return `${h}:${m} ${suffix}`;
}

async function getMakkahPrayers() {
    const line1 = document.getElementById('prayer-line-1');
    const line2 = document.getElementById('prayer-line-2');
    if (!line1 || !line2) return;

    try {
        // method=4 هو تقويم أم القرى بمكة المكرمة
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi%20Arabia&method=4');
        const json = await response.json();
        if (json && json.data && json.data.timings) {
            const t = json.data.timings;
            line1.textContent = `الفجر ${formatTime12Ar(t.Fajr)} | الشروق ${formatTime12Ar(t.Sunrise)}`;
            line2.textContent = `المغرب ${formatTime12Ar(t.Maghrib)} | العشاء ${formatTime12Ar(t.Isha)}`;
        }
    } catch (e) {
        // الإبقاء على القيم الافتراضية في حال عدم الاتصال بالإنترنت
    }
}

// 8. حساب المسافة الجغرافية بمعادلة Haversine الدقيقة
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initGeolocation() {
    const locNameEl = document.getElementById('currentLocationName');
    if (!locNameEl) return;

    if (!navigator.geolocation) {
        locNameEl.innerText = CONFIG.defaultCity;
        calcRemaining(CONFIG.totalDistanceKm);
        return;
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        let closestStation = CONFIG.stations[0];
        let minDistance = Infinity;

        CONFIG.stations.forEach(station => {
            const dist = haversineKm(userLat, userLon, station.lat, station.lon);
            if (dist < minDistance) {
                minDistance = dist;
                closestStation = station;
            }
        });

        locNameEl.innerText = closestStation.name;
        calcRemaining(closestStation.km);
    }, function () {
        locNameEl.innerText = CONFIG.defaultCity;
        calcRemaining(CONFIG.totalDistanceKm);
    }, { timeout: 8000, maximumAge: 60000 });
}

function calcRemaining(kmVal) {
    const km = (kmVal !== undefined && kmVal !== null) ? kmVal : CONFIG.totalDistanceKm;
    const remDistEl = document.getElementById('remDist');
    const remTimeEl = document.getElementById('remTime');
    const remArrivalEl = document.getElementById('remArrival');

    if (remDistEl) remDistEl.innerText = km.toLocaleString() + ' كم';

    const hours = Math.round((km / 100) * 10) / 10;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    let timeStr = '';
    if (h > 0 && m > 0) {
        timeStr = h + ' ساعة و ' + m + ' دقيقة';
    } else if (h > 0) {
        timeStr = h + ' ساعة';
    } else {
        timeStr = m + ' دقيقة';
    }
    if (remTimeEl) remTimeEl.innerText = timeStr;

    const now = new Date();
    const totalMinutes = Math.round(hours * 60);
    now.setMinutes(now.getMinutes() + totalMinutes);

    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    if (remArrivalEl) remArrivalEl.innerText = now.toLocaleDateString(CONFIG.locale, options);
}

// 9. طباعة مسار الرحلة مع فتح جميع الأقسام مؤقتاً للطباعة الكاملة
function printRoute() {
    const accordions = document.querySelectorAll('details.custom-accordion');
    const previousStates = [];

    accordions.forEach(acc => {
        previousStates.push(acc.open);
        acc.setAttribute('open', '');
    });

    window.print();

    accordions.forEach((acc, idx) => {
        if (!previousStates[idx]) {
            acc.removeAttribute('open');
        }
    });
}

// 10. مشاركة الصفحة
function sharePage() {
    const url = window.location.href;
    const title = document.title;
    const text = `${title} 🕋\nتذكرونا بدعوة صالحة 🤲`;

    if (window.location.protocol !== 'file:' && navigator.share && window.isSecureContext) {
        navigator.share({
            title: title,
            text: text + '\n',
            url: url
        }).catch(() => {});
    } else {
        const shareTextWithUrl = `${title}\nتذكرونا بدعوة صالحة 🤲\n${url}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareTextWithUrl).then(() => {
                alert('✅ تم نسخ العنوان والرابط بنجاح!\nيمكنك الآن لصقه ومشاركته مع من تحب.');
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
        alert('✅ تم نسخ العنوان والرابط بنجاح!\nيمكنك الآن لصقه ومشاركته مع من تحب.');
    } catch (err) {
        alert('تعذر النسخ التلقائي. يرجى نسخ الرابط من شريط المتصفح يدوياً.');
    }
}

// 11. معالجة نموذج الاقتراحات وإرساله بالـ AJAX
function initSuggestionForm() {
    const suggestForm = document.getElementById('suggestionForm');
    const suggestStatus = document.getElementById('suggestionStatus');
    const suggestBtn = document.getElementById('btnSubmitSuggest');

    if (!suggestForm) return;

    suggestForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const accessKeyVal = suggestForm.querySelector('input[name="access_key"]')?.value.trim();
        if (!accessKeyVal || accessKeyVal === 'YOUR_ACCESS_KEY_HERE') {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.innerHTML = '⚠️ الرجاء تهيئة مفتاح الوصول الخاص بـ Web3Forms في الكود أولاً.';
            suggestStatus.style.display = 'block';
            return;
        }

        const msgVal = document.getElementById('suggest_message')?.value.trim();
        if (!msgVal) {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.innerHTML = '⚠️ الرجاء كتابة الاقتراح أو الاستفسار أولاً.';
            suggestStatus.style.display = 'block';
            return;
        }

        const hCaptchaVal = suggestForm.querySelector('textarea[name=h-captcha-response]')?.value;
        if (!hCaptchaVal) {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.innerHTML = '⚠️ الرجاء التحقق من اختبار الكابتشا (أنا لست برنامج روبوت) أولاً.';
            suggestStatus.style.display = 'block';
            return;
        }

        suggestBtn.disabled = true;
        const originalText = suggestBtn.innerHTML;
        suggestBtn.innerHTML = '<span>جاري الإرسال...</span>';
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
                    suggestStatus.innerHTML = '✅ تم إرسال اقتراحك بنجاح! شكراً جزيلاً لك على مشاركتنا رأيك لتطوير الدليل.';
                    suggestForm.reset();
                    if (typeof hcaptcha !== 'undefined') {
                        hcaptcha.reset();
                    }
                } else {
                    suggestStatus.className = 'suggestion-status error';
                    suggestStatus.innerHTML = '❌ ' + (res.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى لاحقاً.');
                }
            })
            .catch(() => {
                suggestStatus.className = 'suggestion-status error';
                suggestStatus.innerHTML = '❌ عذراً، تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.';
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
    const navButtons = document.querySelectorAll('.mobile-nav-btn[data-target]');
    if (!navButtons.length || !('IntersectionObserver' in window)) return;

    const targetMap = {};
    navButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        if (targetId) targetMap[targetId] = btn;
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
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
        navigator.serviceWorker.register('../sw.js').catch(() => {});
    }
}

// تهيئة الأقسام المشتركة والمظهر فور تحميل الملف في نهاية الـ body (قبل تشغيل سكربت Web3Forms/hCaptcha)
function bootstrapApp() {
    // 1. حقن الأقسام والمحطات المشتركة فوراً في الـ DOM لتراها مكتبة Web3Forms hCaptcha
    if (typeof window.renderSharedContent === 'function') {
        window.renderSharedContent(CONFIG);
    }

    // 2. استعادة المظهر المفضل
    const savedTheme = localStorage.getItem('darkGuideTheme');
    const isLight = savedTheme !== 'dark';
    if (!isLight) {
        document.body.classList.remove('light-mode');
        updateThemeBtn(false);
    } else {
        document.body.classList.add('light-mode');
        updateThemeBtn(true);
    }

    // ضبط مظهر الكابتشا الافتراضي بحسب الوضع الحالي
    const captchaWidget = document.getElementById('h-captcha-widget');
    if (captchaWidget) {
        captchaWidget.setAttribute('data-theme', isLight ? 'light' : 'dark');
    }

    initAccordions();
    initChecklist();
    initGeolocation();
    calculateFuel();
    getMakkahTemp();
    getMakkahPrayers();
    initSuggestionForm();
    initMobileScrollSpy();
    registerPWA();

    // التأكد من رندر الـ hCaptcha في حال تم تحميل سكربت hcaptcha مسبقاً
    const suggestionsDetails = document.getElementById('section-suggestions');
    if (suggestionsDetails) {
        suggestionsDetails.addEventListener('toggle', () => {
            if (suggestionsDetails.open) {
                const wrapper = document.getElementById('h-captcha-wrapper');
                if (wrapper && !wrapper.querySelector('iframe') && typeof hcaptcha !== 'undefined') {
                    changehCaptchaTheme(document.body.classList.contains('light-mode') ? 'light' : 'dark');
                }
            }
        });
    }
}

if (document.body && document.querySelector('.container')) {
    bootstrapApp();
} else {
    document.addEventListener('DOMContentLoaded', bootstrapApp);
}

