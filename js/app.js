/**
 * دليل السفر البري إلى مكة المكرمة - الملف البرمجي التفاعلي (Mobile-First Architecture)
 * يعمل على صفحات HTML المولّدة مسبقاً عبر build.js
 */

const CONFIG = Object.assign(
    {
        countryCode: 'qa',
        countryName: 'قطر',
        defaultCity: 'الدوحة (افتراضي)',
        totalDistanceKm: 1480,
        estimatedDriveHours: 16,
        locale: 'ar-QA',
        stations: []
    },
    window.COUNTRY_DATA || {}
);

const CHECKLIST_STORAGE_KEY = `meccaTripChecklist_${CONFIG.countryCode}`;
const LATIN_AR_LOCALE = 'ar-u-nu-latn';

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

    detailsElements.forEach((details) => {
        details.removeAttribute('open');
        details.addEventListener('toggle', () => {
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
        arrDisplay.textContent = depDate.toLocaleDateString(LATIN_AR_LOCALE, options);
    } else {
        arrDisplay.textContent = 'حدد وقت الانطلاق';
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

    litersEl.textContent = liters.toFixed(1) + ' لتر';
    totalEl.textContent = Math.round(totalCost).toLocaleString('en-US') + ' ريال';
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
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('darkGuideTheme', isLight ? 'light' : 'dark');
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

// 7. جلب درجة الحرارة ومواقيت الصلاة الفعلية لمكة المكرمة (دون إبقاء قيم وهمية عند الفشل)
async function getMakkahTemp() {
    const tempEl = document.getElementById('makkah-temp');
    if (!tempEl) return;
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.4266&longitude=39.8261&current_weather=true');
        if (!response.ok) throw new Error('Weather HTTP error');
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        tempEl.textContent = `${temp}°C`;
    } catch (e) {
        tempEl.textContent = 'غير متاح';
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
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi%20Arabia&method=4');
        if (!response.ok) throw new Error('Prayers HTTP error');
        const json = await response.json();
        if (json && json.data && json.data.timings) {
            const t = json.data.timings;
            line1.textContent = `الفجر ${formatTime12Ar(t.Fajr)} | الشروق ${formatTime12Ar(t.Sunrise)}`;
            line2.textContent = `المغرب ${formatTime12Ar(t.Maghrib)} | العشاء ${formatTime12Ar(t.Isha)}`;
        }
    } catch (e) {
        line1.textContent = 'مواقيت الصلاة بمكة المكرمة';
        line2.textContent = 'تتطلب اتصالاً بالإنترنت';
    }
}

// 8. حساب المسافة الجغرافية بمعادلة Haversine الدقيقة وتحديد الموقع عند الطلب فقط
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function requestUserLocation() {
    const locNameEl = document.getElementById('currentLocationName');
    const btnLocate = document.getElementById('btnLocateMe');
    if (!locNameEl) return;

    if (!navigator.geolocation) {
        locNameEl.textContent = 'المتصفح لا يدعم GPS';
        return;
    }

    locNameEl.textContent = 'جاري تحديد الموقع...';
    if (btnLocate) btnLocate.disabled = true;

    navigator.geolocation.getCurrentPosition(function (position) {
        if (btnLocate) btnLocate.disabled = false;
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const stations = Array.isArray(CONFIG.stations) && CONFIG.stations.length ? CONFIG.stations : [];
        let closestStation = stations[0] || { km: CONFIG.totalDistanceKm, name: CONFIG.defaultCity, lat: 21.4225, lon: 39.8262 };
        let minDistance = Infinity;

        stations.forEach(station => {
            const dist = haversineKm(userLat, userLon, station.lat, station.lon);
            if (dist < minDistance) {
                minDistance = dist;
                closestStation = station;
            }
        });

        const makkahLat = 21.4225;
        const makkahLon = 39.8262;
        const directToMakkahKm = haversineKm(userLat, userLon, makkahLat, makkahLon);

        // إذا كان المستخدم بعيداً أكثر من 120 كم عن أقرب نقطة في المسار، نوضح أنه خارج المسار ونحسب المسافة التقديرية لمكة
        if (minDistance > 120) {
            const estimatedRoadKm = Math.round(directToMakkahKm * 1.22);
            locNameEl.textContent = `خارج المسار (قرب ${closestStation.name})`;
            calcRemaining(estimatedRoadKm);
        } else {
            locNameEl.textContent = closestStation.name;
            calcRemaining(closestStation.km);
        }
    }, function () {
        if (btnLocate) btnLocate.disabled = false;
        locNameEl.textContent = `${CONFIG.defaultCity} (تعذر جلب GPS)`;
        calcRemaining(CONFIG.totalDistanceKm);
    }, { timeout: 8000, maximumAge: 60000 });
}

function calcRemaining(kmVal) {
    const km = (kmVal !== undefined && kmVal !== null) ? Math.max(0, Math.round(kmVal)) : CONFIG.totalDistanceKm;
    const remDistEl = document.getElementById('remDist');
    const remTimeEl = document.getElementById('remTime');
    const remArrivalEl = document.getElementById('remArrival');

    if (remDistEl) remDistEl.textContent = km.toLocaleString('en-US') + ' كم';

    // الزمن الصافي للقيادة بسرعة متوسطة 100 كم/س
    const netDriveHours = km / 100;
    const netTotalMinutes = Math.round(netDriveHours * 60);
    const h = Math.floor(netTotalMinutes / 60);
    const m = netTotalMinutes % 60;

    let timeStr = '';
    if (h > 0 && m > 0) {
        timeStr = `${h} ساعة و ${m} دقيقة`;
    } else if (h > 0) {
        timeStr = `${h} ساعة`;
    } else {
        timeStr = `${m} دقيقة`;
    }
    if (remTimeEl) remTimeEl.textContent = timeStr;

    // وقت الوصول المتوقع من الموقع الحالي (بإضافة نسبة التوقفات والمنفذ ليتطابق مع الحاسبة العلوية)
    const ratio = CONFIG.totalDistanceKm > 0 ? (km / CONFIG.totalDistanceKm) : 0;
    const totalTripMinutes = Math.round(ratio * CONFIG.estimatedDriveHours * 60);
    const arrivalDate = new Date();
    arrivalDate.setMinutes(arrivalDate.getMinutes() + totalTripMinutes);

    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    if (remArrivalEl) remArrivalEl.textContent = arrivalDate.toLocaleDateString(LATIN_AR_LOCALE, options);
}

// 9. طباعة مسار الرحلة (يدعم زر الطباعة واختصار Ctrl+P عبر beforeprint/afterprint)
let savedAccordionStatesBeforePrint = null;

function expandAccordionsForPrint() {
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
    expandAccordionsForPrint();
    window.print();
    restoreAccordionsAfterPrint();
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
            suggestStatus.textContent = '⚠️ الرجاء تهيئة مفتاح الوصول الخاص بـ Web3Forms في الكود أولاً.';
            suggestStatus.style.display = 'block';
            return;
        }

        const msgVal = document.getElementById('suggest_message')?.value.trim();
        if (!msgVal) {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.textContent = '⚠️ الرجاء كتابة الاقتراح أو الاستفسار أولاً.';
            suggestStatus.style.display = 'block';
            return;
        }

        const hCaptchaVal = suggestForm.querySelector('textarea[name=h-captcha-response]')?.value;
        if (!hCaptchaVal) {
            suggestStatus.className = 'suggestion-status error';
            suggestStatus.textContent = '⚠️ الرجاء التحقق من اختبار الكابتشا (أنا لست برنامج روبوت) أولاً.';
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
                    suggestStatus.textContent = '✅ تم إرسال اقتراحك بنجاح! شكراً جزيلاً لك على مشاركتنا رأيك لتطوير الدليل.';
                    suggestForm.reset();
                    if (typeof hcaptcha !== 'undefined') {
                        hcaptcha.reset();
                    }
                } else {
                    suggestStatus.className = 'suggestion-status error';
                    suggestStatus.textContent = '❌ ' + (res.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى لاحقاً.');
                }
            })
            .catch(() => {
                suggestStatus.className = 'suggestion-status error';
                suggestStatus.textContent = '❌ عذراً، تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.';
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

function bootstrapApp() {
    // 1. استعادة المظهر المفضل أو احترام تفضيل النظام (prefers-color-scheme)
    const savedTheme = localStorage.getItem('darkGuideTheme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLight = savedTheme ? savedTheme === 'light' : !prefersDark;

    if (!isLight) {
        document.body.classList.remove('light-mode');
        updateThemeBtn(false);
    } else {
        document.body.classList.add('light-mode');
        updateThemeBtn(true);
    }

    const captchaWidget = document.getElementById('h-captcha-widget');
    if (captchaWidget) {
        captchaWidget.setAttribute('data-theme', isLight ? 'light' : 'dark');
    }

    initAccordions();
    initChecklist();
    calcRemaining(CONFIG.totalDistanceKm);
    calculateFuel();
    getMakkahTemp();
    getMakkahPrayers();
    initSuggestionForm();
    initMobileScrollSpy();
    registerPWA();

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

bootstrapApp();
