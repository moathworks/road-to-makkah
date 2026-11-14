/**
 * قالب صفحات الدول (HTML ثابت كامل المحتوى، بالعربية أو الإنجليزية حسب ctx.lang)
 */

const {
    CHEVRON_SVG, PLAY_STORE_SVG, APP_STORE_SVG, EXTERNAL_LINK_SVG, APPS_GRID_SVG,
    escapeHtml, formatNumber, tr, makeT, runtimeStrings, pagePath, rootPrefix, jsonForScript,
    renderHead, renderLangSwitch, LANG_META
} = require('./helpers');

// يُطبَّق المظهر المحفوظ (أو تفضيل النظام) قبل أول رسم للصفحة حتى لا تومض بالمظهر النهاري ثم تتحول
const THEME_PREPAINT_SCRIPT = `<script>try{var s=localStorage.getItem('darkGuideTheme');if(s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches)document.body.classList.remove('light-mode')}catch(e){}</script>`;

// يظهر العنصر مع هذه المسارات فقط (للدول ذات المسارات الكاملة المتعددة)؛ null = مع كل المسارات
function routesAttr(routeIds) {
    return routeIds ? ` data-routes="${routeIds.join(' ')}"` : '';
}

function accordion({ id, extraClass = '', title, body, routeIds = null }) {
    const idAttr = id ? ` id="${id}"` : '';
    const cls = extraClass ? `custom-accordion ${extraClass}` : 'custom-accordion';
    return `        <details class="${cls}"${idAttr}${routesAttr(routeIds)}>
            <summary>
                <h2 class="accordion-title">${title}</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
${body}
            </div>
        </details>`;
}

/**
 * يحسب رقم أول محطة في كل قسم: الترقيم متصل داخل المرحلة (الذهاب أو العودة)،
 * والقسم البديل ('alternative') يبدأ برقم القسم السابق نفسه ولا يغيّر العدّاد، و'restart' يبدأ من 1.
 */
function numberSections(sections) {
    let next = 1;
    let prevStart = 1;
    return sections.map((sec) => {
        let start;
        if (sec.numbering === 'alternative') {
            start = prevStart;
        } else {
            start = sec.numbering === 'restart' ? 1 : next;
            prevStart = start;
            next = start + sec.stations.filter(s => !s.unnumbered).length;
        }
        return { ...sec, start };
    });
}

function renderStationCards(stations, startNumber, lang, t) {
    let currentNum = startNumber;
    return stations.map((st) => {
        const title = escapeHtml(tr(st.title, lang));
        const displayTitle = st.unnumbered ? title : `${currentNum++}. ${title}`;
        const btnLabel = escapeHtml(st.btnLabel ? tr(st.btnLabel, lang) : t('station.mapBtn'));

        let cardClass = 'station-card';
        let badgeClass = 'distance-badge-dark';
        if (st.variant === 'food') {
            cardClass += ' station-card-food';
            badgeClass += ' badge-food';
        } else if (st.variant === 'miqat') {
            cardClass += ' station-card-miqat';
            badgeClass += ' badge-miqat';
        }

        const badgeHtml = st.badge
            ? `\n                            <div class="${badgeClass}">${escapeHtml(tr(st.badge, lang))}</div>`
            : '';
        return `                    <div class="${cardClass}">
                        <div>${badgeHtml}
                            <h3>${displayTitle}</h3>
                            <p>${escapeHtml(tr(st.desc, lang))}</p>
                        </div>
                        <a href="${escapeHtml(st.mapUrl)}" target="_blank" rel="noopener noreferrer" class="btn-station-map">${btnLabel}</a>
                    </div>`;
    }).join('\n\n');
}

function stationsGrid(cardsHtml, gridClass = 'stations-grid', introText = '', introClass = '') {
    const cls = introClass ? `section-intro ${introClass}` : 'section-intro';
    const intro = introText ? `                <p class="${cls}">${escapeHtml(introText)}</p>\n` : '';
    return `${intro}                <div class="${gridClass}">
${cardsHtml}
                </div>`;
}

function renderPrayersSection(shared, lang, t) {
    const items = shared.prayers.map((p) => {
        const label = `<strong>${escapeHtml(tr(p.label, lang))}</strong>`;
        if (p.note) return `                <p class="text-block">${label} ${escapeHtml(tr(p.note, lang))}</p>`;
        if (lang === 'ar') return `                <p class="text-block">${label} ${escapeHtml(p.arabic)}</p>`;
        // في الصفحة الإنجليزية: نص الدعاء بالعربية كما يُقرأ، وتحته معناه
        return `                <p class="text-block">${label}
                    <span class="dua-arabic" lang="ar" dir="rtl">${escapeHtml(p.arabic)}</span>
                    <span class="dua-translation">${escapeHtml(p.translation)}</span>
                </p>`;
    }).join('\n');
    return accordion({ id: 'section-prayers', title: escapeHtml(t('section.prayers')), body: items });
}

function renderChecklistSection(country, shared, lang, t) {
    let flatIndex = 0;
    const gridContent = shared.checklistGroups.map((group) => {
        const itemsHtml = group.items.map((item) => {
            const labelText = tr(item.labelKey ? country[item.labelKey] : item.label, lang);
            const legacyIdx = flatIndex++;
            return `                        <div class="switch-item">
                            <span class="switch-label">${escapeHtml(labelText)}</span>
                            <label class="switch">
                                <input type="checkbox" class="checklist-toggle" id="check-${escapeHtml(item.id)}" data-check-id="${escapeHtml(item.id)}" data-legacy-id="check-${legacyIdx}" aria-label="${escapeHtml(labelText)}">
                                <span class="slider"></span>
                            </label>
                        </div>`;
        }).join('\n');
        return `                        <div class="checklist-section-title">${escapeHtml(tr(group.title, lang))}</div>\n${itemsHtml}`;
    }).join('\n');

    return accordion({
        id: 'section-checklist',
        title: escapeHtml(t('section.checklist')),
        body: `                <div class="checklist-wrapper">
                    <div class="progress-container">
                        <div class="progress-header">
                            <span>${escapeHtml(t('checklist.progress'))}</span>
                            <span id="progress-percent">0%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" id="progress-fill"></div>
                        </div>
                    </div>

                    <div class="checklist-btn-group">
                        <button type="button" class="checklist-btn" id="selectAllBtn">${escapeHtml(t('checklist.selectAll'))}</button>
                        <button type="button" class="checklist-btn" id="deselectAllBtn">${escapeHtml(t('checklist.deselectAll'))}</button>
                    </div>

                    <div class="checklist-grid">
${gridContent}
                    </div>
                </div>`
    });
}

/**
 * بطاقة «رحلتي الآن»: ظاهرة دائماً أعلى الصفحة لأنها الأكثر استخداماً أثناء السير
 * (الموقع على المسار، المسافة المتبقية، وقت الوصول، وزر الملاحة).
 */
function renderTripNowSection(country, derived, lang, t) {
    const routeSwitch = renderRouteSwitch(country, lang, t);
    const totalText = `${formatNumber(country.totalDistanceKm)} ${escapeHtml(t('unit.km'))}`;
    const netTimeHtml = escapeHtml(t('calc.netTime', { time: '%%TIME%%' }))
        .replace('%%TIME%%', `<span id="remTime">${escapeHtml(derived.netDriveTimeText)}</span>`);

    return `        <section class="hero-section trip-now" id="section-trip" aria-labelledby="trip-now-title">
            <h2 class="hero-title" id="trip-now-title">${escapeHtml(t('section.trip'))}</h2>${routeSwitch ? `\n${routeSwitch}` : ''}
            <div class="trip-planner">
                <div class="planner-group trip-loc">
                    <div class="trip-loc-text">
                        <span>${escapeHtml(t('calc.location'))}</span>
                        <strong id="currentLocationName">${escapeHtml(tr(country.defaultCity, lang))}</strong>
                    </div>
                    <button type="button" id="btnLocateMe" class="checklist-btn btn-locate" onclick="toggleLocationTracking()">${escapeHtml(t('js.gpsLocate'))}</button>
                </div>
                <div class="planner-group">
                    <span>${escapeHtml(t('calc.remaining'))}</span>
                    <strong id="remDist">${totalText}</strong>
                </div>
                <div class="planner-group">
                    <span>${escapeHtml(t('calc.arrivalFromHere'))}</span>
                    <strong id="remArrival" class="planner-highlight">--:--</strong>
                    <span class="planner-note">${netTimeHtml}</span>
                </div>
            </div>
            <button type="button" class="btn-launch" onclick="startJourney()">${escapeHtml(t('calc.start'))}</button>
        </section>`;
}

function renderCalculatorSection(country, shared, derived, lang, t) {
    const totalText = `${formatNumber(country.totalDistanceKm)} ${escapeHtml(t('unit.km'))}`;

    return `        <details class="custom-accordion hero-section" id="section-calculator">
            <summary>
                <h2 class="hero-title">${escapeHtml(t('section.calculator'))}</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">

                <!-- 1. وقت الانطلاق والوصول -->
                <div class="trip-planner">
                    <div class="planner-group">
                        <label for="dep-time">${escapeHtml(t('calc.departure'))}</label>
                        <input type="datetime-local" id="dep-time" class="planner-input" onchange="calcArrival()">
                    </div>
                    <div class="planner-group">
                        <span>${escapeHtml(t('calc.distance'))}</span>
                        <strong data-route-total>${totalText}</strong>
                    </div>
                    <div class="planner-group">
                        <span>${escapeHtml(t('calc.arrival'))}</span>
                        <strong id="arr-time" class="planner-highlight">${escapeHtml(t('js.selectDeparture'))}</strong>
                    </div>
                </div>

                <!-- 2. تكلفة الوقود التقديرية -->
                <div class="trip-planner trip-planner-fuel">
                    <div class="planner-group">
                        <label for="calc-distance">${escapeHtml(t('calc.fuelDistance'))}</label>
                        <input type="number" id="calc-distance" class="planner-input" value="${country.totalDistanceKm}" min="0" step="10" oninput="calculateFuel()">
                    </div>
                    <div class="planner-group">
                        <label for="calc-rate">${escapeHtml(t('calc.fuelRate'))}</label>
                        <input type="number" id="calc-rate" class="planner-input" value="${shared.defaultFuelRate}" min="1" max="35" step="0.5" oninput="calculateFuel()">
                    </div>
                    <div class="planner-group">
                        <label for="calc-price">${escapeHtml(t('calc.fuelPrice'))}</label>
                        <input type="number" id="calc-price" class="planner-input" value="${shared.defaultFuelPrice}" min="0.5" max="10" step="0.05" oninput="calculateFuel()">
                    </div>
                    <div class="planner-group">
                        <span>${escapeHtml(t('calc.fuelResult'))}</span>
                        <strong id="res-total" class="planner-highlight planner-total">${formatNumber(derived.fuelCostSar)} ${escapeHtml(t('unit.sar'))}</strong>
                        <span id="res-liters" class="fuel-liters">${escapeHtml(derived.fuelLitersText)} ${escapeHtml(t('unit.liter'))}</span>
                    </div>
                </div>
            </div>
        </details>`;
}

/**
 * مبدّل المسار للدول ذات المنافذ المختلفة: الزر المختار يُلوَّن بقاعدة CSS مولّدة لكل مسار
 * (body[data-route])، فيظهر الاختيار المحفوظ صحيحاً من أول رسم قبل تحميل js/app.js.
 */
function renderRouteSwitch(country, lang, t, extraClass = '') {
    if (country.fullRoutes.length < 2) return '';
    const label = escapeHtml(t('route.switchLabel'));
    const buttons = country.fullRoutes.map(r => `<button type="button" class="route-switch-btn" data-route-select="${r.id}" aria-pressed="${r === country.fullRoutes[0]}">${escapeHtml(tr(r.switchLabel, lang))}</button>`).join('');
    return `            <div class="route-switch${extraClass}" role="group" aria-label="${label}">
                <span class="route-switch-label">${label}</span>
                <div class="route-switch-options">${buttons}</div>
            </div>`;
}

function renderRoutesSection(country, lang, t) {
    const multi = country.fullRoutes.length > 1;
    const cards = country.routes.map((r) => {
        const full = multi && country.fullRoutes.find(fr => fr.card === r);
        const selectBtn = full
            ? `\n                    <button type="button" class="route-switch-btn route-card-select" data-route-select="${full.id}" aria-pressed="${full === country.fullRoutes[0]}">${escapeHtml(t('route.use'))}</button>`
            : '';
        return `            <div class="route-card">
                <div>
                    <h3>${escapeHtml(tr(r.title, lang))}</h3>
                    <p><strong>${escapeHtml(t('route.itinerary'))}</strong> ${escapeHtml(tr(r.itinerary, lang))}</p>
                    <p class="route-desc">${escapeHtml(tr(r.description, lang))}</p>
                </div>
                <div class="route-card-footer">
                    <div class="route-badge">${escapeHtml(t('route.distance', { km: formatNumber(r.distanceKm) }))}</div>
                    <a href="${escapeHtml(r.mapUrl)}" target="_blank" rel="noopener noreferrer" class="route-card-link">${escapeHtml(t('route.start'))}</a>${selectBtn}
                </div>
            </div>`;
    }).join('\n');

    return `        <h2 class="section-header" id="section-routes">${escapeHtml(t('section.routes'))}</h2>
        <div class="carousel-container">
${cards}
        </div>`;
}

// نصائح المعتمر مقسّمة حسب المرحلة: group = 'road' (في الطريق) أو 'city' (في مكة والمدينة)
function renderTipsSection(country, shared, group, id, titleKey, lang, t) {
    const tips = shared.pilgrimTips.filter(tip => tip.group === group).map((tip) => {
        const text = escapeHtml(tr(tip.textKey ? country[tip.textKey] : tip.text, lang));
        const link = tip.link
            ? `<a href="${escapeHtml(tip.link.url)}" target="_blank" rel="noopener noreferrer" class="inline-link">${escapeHtml(tr(tip.link.label, lang))}</a>${escapeHtml(tr(tip.after, lang))}`
            : '';
        return `                <p class="info-tip">${tip.icon} <strong>${escapeHtml(tr(tip.title, lang))}</strong> ${text}${link}</p>`;
    }).join('\n                <hr class="info-divider">\n');
    return accordion({ id, title: escapeHtml(t(titleKey)), body: tips });
}

function renderPlacesSection(shared, lang, t) {
    const groups = shared.places.map((group) => {
        const items = group.items.map((place) => {
            const noteHtml = place.note ? `\n                                <div class="place-note">${escapeHtml(tr(place.note, lang))}</div>` : '';
            const extraHtml = place.extra ? `
                                <div class="place-extra">
                                    ${place.extra.icon} <a href="${escapeHtml(place.extra.url)}" target="_blank" rel="noopener noreferrer" class="inline-link">${escapeHtml(tr(place.extra.label, lang))}</a> <span class="place-extra-note">${escapeHtml(tr(place.extra.note, lang))}</span>
                                </div>` : '';
            return `                            <li>
                                <span class="place-pin" aria-hidden="true">📍</span><a href="${escapeHtml(place.mapUrl)}" target="_blank" rel="noopener noreferrer" class="place-link">${escapeHtml(tr(place.name, lang))}</a>${noteHtml}${extraHtml}
                            </li>`;
        }).join('\n');
        return `                    <div class="places-group">
                        <h3 class="places-title">
                            <span>${group.icon}</span> <strong>${escapeHtml(tr(group.city, lang))}</strong>
                        </h3>
                        <ul class="places-list">
${items}
                        </ul>
                    </div>`;
    }).join('\n\n');

    return accordion({
        id: 'section-places',
        title: escapeHtml(t('section.places')),
        body: `                <div class="places-wrap">
${groups}
                </div>`
    });
}

function renderAppCard(app, root, lang, t) {
    const title = tr(app.title, lang);
    const iconMarkup = app.iconEmoji
        ? `<div class="app-icon app-icon-emoji">${escapeHtml(app.iconEmoji)}</div>`
        : `<img loading="lazy" src="${root}${escapeHtml(app.iconSrc)}" alt="${escapeHtml(app.iconAlt || title)}" class="${app.iconContain ? 'app-icon app-icon-contain' : 'app-icon'}">`;

    const ariaBase = app.ariaName ? tr(app.ariaName, lang) : title;
    const webLabel = app.webAriaLabel ? tr(app.webAriaLabel, lang) : t('app.websiteOf', { name: title });
    const links = [
        app.playUrl && `<a href="${escapeHtml(app.playUrl)}" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="${escapeHtml(t('app.onGooglePlay', { name: ariaBase }))}">${PLAY_STORE_SVG}</a>`,
        app.appleUrl && `<a href="${escapeHtml(app.appleUrl)}" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="${escapeHtml(t('app.onAppStore', { name: ariaBase }))}">${APP_STORE_SVG}</a>`,
        app.webUrl && `<a href="${escapeHtml(app.webUrl)}" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="${escapeHtml(t('app.website'))}" aria-label="${escapeHtml(webLabel)}">${EXTERNAL_LINK_SVG}</a>`
    ].filter(Boolean).join('\n                        ');

    return `                <div class="app-item">
                    <div class="app-info">
                        ${iconMarkup}
                        <div>
                            <div class="app-title">${escapeHtml(title)}</div>
                            <div class="app-desc">${escapeHtml(tr(app.desc, lang))}</div>
                        </div>
                    </div>
                    <div class="app-links">
                        ${links}
                    </div>
                </div>`;
}

function renderAppsSection(country, shared, root, lang, t) {
    const allApps = [...(country.extraApps || []), ...shared.sharedApps];
    const cardsHtml = allApps.map(app => renderAppCard(app, root, lang, t)).join('\n\n');

    return `        <details class="custom-accordion apps-section" id="section-apps">
            <summary>
                <h2 class="accordion-title summary-with-icon">
                    ${APPS_GRID_SVG}${escapeHtml(t('section.apps'))}
                </h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
${cardsHtml}
            </div>
        </details>`;
}

function renderEmergencySection(country, root, lang, t) {
    const countryName = tr(country.countryName, lang);
    const saFlag = `<img loading="lazy" src="${root}assets/images/sa-flag.png" alt="${escapeHtml(t('country.saudi'))}" class="flag-img">`;
    const box = (cls, flagHtml, heading, tel, callTitle, extra = '', numClass = 'emergency-number') => `
                    <div class="emergency-box ${cls}">
                        <h3>
                            ${flagHtml}
                            ${escapeHtml(heading)}
                        </h3>
                        <a href="tel:${escapeHtml(tel)}" class="${numClass}" title="${escapeHtml(callTitle)}"><span aria-hidden="true">📞</span> ${escapeHtml(tel)}</a>${extra}
                    </div>`;

    const localBox = country.countryCode !== 'sa'
        ? box('country-local',
            `<img loading="lazy" src="${root}assets/images/${escapeHtml(country.flagFile)}" alt="${escapeHtml(countryName)}" class="flag-img">`,
            t('emergency.local', { country: countryName }),
            country.emergencyNumber,
            t('emergency.callLocal', { country: countryName, number: country.emergencyNumber }))
        : '';

    return `        <div class="emergency-section" id="section-emergency">
            <div class="emergency-header-title">
                <h2 class="accordion-title">${escapeHtml(t('section.emergency'))}</h2>
            </div>
            <div class="emergency-body">
                <div class="emergency-grid">${localBox}${box('saudi', saFlag, t('emergency.saudiRoad'), '911', t('emergency.callRoad'))}${box('saudi', saFlag, t('emergency.redCrescent'), '997', t('emergency.callAmbulance'))}${box('saudi', saFlag, t('emergency.najm'), '920000560', t('emergency.callNajm'), `\n                        <p class="emergency-note">${escapeHtml(t('emergency.najmNote'))}</p>`, 'emergency-number emergency-number-long')}
                </div>
            </div>
        </div>`;
}

function renderSuggestionsSection(country, shared, lang, t) {
    const countryName = tr(country.countryName, lang);
    const fromPage = t('suggest.fromPage', { country: countryName });
    const required = '<span class="required-mark">*</span>';

    return `        <details class="custom-accordion suggestions-wrapper" id="section-suggestions">
            <summary>
                <h2 class="accordion-title">${escapeHtml(t('section.suggestions'))}</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="suggestions-header">
                    <p>${escapeHtml(t('suggest.intro'))}</p>
                </div>

                <form id="suggestionForm" class="suggestion-form" action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="${escapeHtml(shared.web3formsAccessKey)}">
                    <input type="checkbox" name="botcheck" class="hidden">
                    <input type="hidden" name="from_page" value="${escapeHtml(fromPage)}">
                    <input type="hidden" name="from_name" value="${escapeHtml(fromPage)} 🕋">
                    <input type="hidden" name="subject" value="${escapeHtml(t('suggest.subject', { country: countryName }))}">

                    <div class="form-group">
                        <label for="suggest_name" class="form-label">${escapeHtml(t('suggest.name'))} ${required}</label>
                        <input type="text" id="suggest_name" name="name" class="form-input" required placeholder="${escapeHtml(t('suggest.namePh'))}">
                    </div>

                    <div class="form-group">
                        <label for="suggest_email" class="form-label">${escapeHtml(t('suggest.email'))} ${required}</label>
                        <input type="email" id="suggest_email" name="email" class="form-input" required placeholder="name@example.com">
                    </div>

                    <div class="form-group-full">
                        <label for="suggest_message" class="form-label">${escapeHtml(t('suggest.message'))} ${required}</label>
                        <textarea id="suggest_message" name="message" class="form-textarea" required placeholder="${escapeHtml(t('suggest.messagePh'))}"></textarea>
                    </div>

                    <!-- الكابتشا تُحمَّل عند فتح القسم فقط (js/app.js)، فلا تُطلب سكربتات خارجية مع كل زيارة -->
                    <div class="captcha-container" id="h-captcha-wrapper" data-sitekey="${escapeHtml(shared.hcaptchaSiteKey)}"></div>

                    <div class="btn-submit-container">
                        <button type="submit" id="btnSubmitSuggest" class="btn-submit-suggestion">
                            <span>${escapeHtml(t('suggest.send'))}</span>
                        </button>
                    </div>

                    <div id="suggestionStatus" class="suggestion-status"></div>
                </form>
            </div>
        </details>`;
}

/**
 * شريط الجوال السفلي: خاناته مرتبة حسب ما يحتاجه المسافر أثناء السير.
 * - «رحلتي» و«مكة والمدينة» و«الطوارئ» تنقل مباشرة.
 * - «المحطات» و«المزيد» تفتحان قائمة صغيرة فوق الشريط (sheet) لاختيار القسم.
 * data-spy: معرّفات الأقسام التي تُفعّل الزر عند المرور بها أثناء التمرير.
 */
function renderMobileNav(stationSections, moreSections, t) {
    const hereLabel = escapeHtml(t('nav.youAreHere'));
    const sheet = (id, titleKey, sections) => `    <div class="nav-sheet" id="${id}" role="dialog" aria-label="${escapeHtml(t(titleKey))}">
        <div class="nav-sheet-title">${escapeHtml(t(titleKey))}</div>
${sections.map(sec => `        <button type="button" class="nav-sheet-item${sec.separator ? ' nav-sheet-sep' : ''}" data-target="${sec.id}"${routesAttr(sec.routeIds || null)} data-here="${hereLabel}" onclick="navigateFromSheet('${sec.id}')">${sec.title}</button>`).join('\n')}
    </div>`;

    const spy = (ids) => ids.join(' ');
    const direct = (target, icon, labelKey, spyIds, extraClass = '') => `        <button type="button" class="mobile-nav-btn${extraClass}" data-spy="${spy(spyIds)}" onclick="navigateToSection('${target}', this)">
            <span class="nav-icon" aria-hidden="true">${icon}</span>
            <span class="nav-label">${escapeHtml(t(labelKey))}</span>
        </button>`;
    const opener = (sheetId, icon, labelKey, sections) => `        <button type="button" class="mobile-nav-btn" data-sheet="${sheetId}" data-spy="${spy(sections.map(sec => sec.id))}" aria-haspopup="dialog" aria-expanded="false" onclick="toggleNavSheet('${sheetId}', this)">
            <span class="nav-icon" aria-hidden="true">${icon}</span>
            <span class="nav-label">${escapeHtml(t(labelKey))}</span>
        </button>`;

    return `    <div class="nav-sheet-backdrop" id="navSheetBackdrop" onclick="closeNavSheets(true)"></div>
${sheet('navSheet-stations', 'nav.stationsSheet', stationSections)}
${sheet('navSheet-more', 'nav.moreSheet', moreSections)}
    <nav class="mobile-bottom-nav" aria-label="${escapeHtml(t('nav.label'))}">
${[
        direct('section-trip', '🧭', 'nav.trip', ['section-trip'], ' active'),
        opener('navSheet-stations', '⛽', 'nav.stations', stationSections),
        direct('phase-city', '🕋', 'nav.city', ['phase-city', 'section-city-info', 'section-places']),
        opener('navSheet-more', '☰', 'nav.more', moreSections),
        direct('section-emergency', '📞', 'nav.emergency', ['section-emergency'], ' nav-emergency')
    ].join('\n')}
    </nav>`;
}

function renderQuickActions(country, lang, t) {
    const svg = (inner, id = '') => `<svg${id ? ` id="${id}"` : ''} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${inner}</svg>`;
    const label = (key) => { const text = escapeHtml(t(key)); return `title="${text}" aria-label="${text}"`; };

    return `            <div class="quick-actions-row">
                <a href="../" class="quick-access-btn" ${label('action.home')}>
                    ${svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>')}
                </a>
                <button type="button" id="themeToggleBtn" onclick="toggleTheme()" ${label('action.theme')}>
                    ${svg('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>')}
                </button>
                <button type="button" class="quick-access-btn" onclick="printRoute()" ${label('action.print')}>
                    ${svg('<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>')}
                </button>
                <button type="button" class="quick-access-btn" onclick="sharePage()" ${label('action.share')}>
                    ${svg('<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>')}
                </button>
                <button type="button" class="quick-access-btn" onclick="toggleAllAccordions()" ${label('action.toggleAll')}>
                    ${svg('<polyline points="7 11 12 6 17 11"></polyline><polyline points="7 18 12 13 17 18"></polyline>', 'toggleAllIcon')}
                </button>
                ${renderLangSwitch(country.slug, lang, 'quick-access-btn lang-toggle')}
            </div>`;
}

function renderCountryPage(country, shared, ctx) {
    const { assetHashes, derived, lastUpdatedText, lastUpdatedYear, lang } = ctx;
    const t = makeT(lang);
    const root = rootPrefix(pagePath(country.slug, lang));
    const countryName = tr(country.countryName, lang);
    const phase = (num, id, key) => `        <h2 class="phase-header" id="${id}"><span class="phase-num" aria-hidden="true">${num}</span>${escapeHtml(t(key))}</h2>`;

    // قسم المحطات كما يُعرض: المقاطع المشتركة تأخذ نصوصها من data/i18n.js، وأقسام الدولة من ملفها
    const toAccordion = routeIds => (sec) => {
        const title = sec.titleKey ? t(sec.titleKey) : tr(sec.title, lang);
        const intro = sec.introKey ? t(sec.introKey) : (sec.intro ? tr(sec.intro, lang) : '');
        return {
            id: sec.id,
            routeIds,
            extraClass: sec.extraClass || '',
            title: escapeHtml(title),
            body: stationsGrid(renderStationCards(sec.stations, sec.start, lang, t), sec.grid || 'stations-grid', intro, sec.introClass || '')
        };
    };
    // أقسام المحطات بترتيب الرحلة (كما اختارتها الدولة): مصدر واحد للأكورديونات ولقائمة «المحطات» في شريط الجوال.
    // كل كتلة تخص مساراً كاملاً أو أكثر (routeIds)، وتُرقَّم وحدها.
    const blocksToAccordions = blocks => blocks.flatMap(b => numberSections(b.sections).map(toAccordion(b.routeIds)));
    const outboundAccordions = blocksToAccordions(country.outboundBlocks);
    const returnAccordions = blocksToAccordions(country.returnBlocks);
    // أول قسم عودة لكل مسار يُفصل بخط عن أقسام الذهاب في القائمة
    returnAccordions.forEach((acc, idx) => {
        const prev = returnAccordions[idx - 1];
        if (idx === 0 || String(prev.routeIds) !== String(acc.routeIds)) acc.separator = true;
    });
    const stationSections = [...outboundAccordions, ...returnAccordions];
    const renderAccordions = list => list.map(accordion).join('\n\n');

    // بقية الأقسام التي تصل إليها خانة «المزيد» في شريط الجوال
    const moreSections = [
        { id: 'section-routes', title: escapeHtml(t('section.routes')) },
        { id: 'section-calculator', title: escapeHtml(t('section.calculator')) },
        { id: 'section-checklist', title: escapeHtml(t('section.checklist')) },
        { id: 'section-apps', title: `📱 ${escapeHtml(t('section.apps'))}` },
        { id: 'section-road-tips', separator: true, title: escapeHtml(t('section.roadTips')) },
        { id: 'section-prayers', title: escapeHtml(t('section.prayers')) },
        { id: 'section-suggestions', separator: true, title: escapeHtml(t('section.suggestions')) }
    ];

    const runtimeConfig = {
        countryCode: country.countryCode,
        defaultCity: tr(country.defaultCity, lang),
        // المسارات الكاملة (الأول افتراضي): لكل منها مسافته وزمنه ونقاط GPS بترتيبه،
        // ومع كل نقطة (leg) معرّف قسم المحطات الذي يقع فيه الطريق المؤدي إليها
        routes: derived.routes
    };

    // للدول ذات المسارات المتعددة: إخفاء أقسام المسارات الأخرى وتلوين الزر المختار حسب body[data-route]
    const routeIds = country.fullRoutes.map(r => r.id);
    const multiRoute = routeIds.length > 1;
    const routeStyles = multiRoute ? routeIds.map(id => `
        body[data-route="${id}"] [data-routes]:not([data-routes~="${id}"]) { display: none !important; }
        body[data-route="${id}"] [data-route-select="${id}"] { background: var(--route-on-bg); color: var(--route-on-fg); border-color: var(--route-on-bg); }`).join('') : '';
    const routePrepaint = multiRoute
        ? `<script>try{var r=localStorage.getItem('selectedRoute_${escapeHtml(country.countryCode)}');if(${jsonForScript(routeIds)}.indexOf(r)>-1)document.body.setAttribute('data-route',r)}catch(e){}</script>`
        : '';

    const head = renderHead({
        lang,
        slug: country.slug,
        title: tr(country.pageTitle, lang),
        description: tr(country.metaDescription, lang),
        siteName: t('site.name'),
        siteUrl: shared.siteUrl,
        themeColor: country.themeColor,
        stylesheet: `css/style.css?v=${assetHashes.styleCss}`,
        fontsStylesheet: `css/fonts.css?v=${assetHashes.fontsCss}`,
        extra: `
    <style>
        /* لون هوية الدولة */
        :root {
            --brand: ${escapeHtml(country.themeColor)};
            --brand-rgb: ${escapeHtml(country.themeColorRgb)};
            --brand-dark: ${escapeHtml(country.themeColorDark)};
        }${routeStyles}
    </style>`
    });

    return `<!-- AUTO-GENERATED BY build.js - DO NOT EDIT MANUALLY -->
<!DOCTYPE html>
<html lang="${lang}" dir="${LANG_META[lang].dir}">

<head>
${head}
</head>

<body class="light-mode" data-country="${escapeHtml(country.countryCode)}"${multiRoute ? ` data-route="${routeIds[0]}"` : ''}>
    ${THEME_PREPAINT_SCRIPT}${routePrepaint}

    <div class="container">

        <!-- هيدر خاص للطباعة فقط -->
        <div class="print-only print-header">
            <div class="print-title">${escapeHtml(tr(country.printHeaderTitle, lang))}</div>
            <p>${escapeHtml(tr(country.printHeaderSubtitle, lang))} ${escapeHtml(lastUpdatedYear)}</p>
        </div>

        <header>
            <div class="header-title-block">
                <h1 class="header-h1">
                    <a href="../" class="header-logo">
                        <img src="${root}assets/images/${escapeHtml(country.flagFile)}" alt="" class="flag-img">
                        ${escapeHtml(t('country.headerLogo', { country: countryName }))}
                    </a>
                </h1>
                <div class="last-updated">${escapeHtml(t('common.lastUpdated', { date: lastUpdatedText }))}</div>
            </div>
${renderQuickActions(country, lang, t)}
            <p class="header-subtitle">${escapeHtml(tr(country.headerSubtitle, lang))}</p>
        </header>

        <!-- مواقيت الصلاة الحية في مكة + الطقس المباشر -->
        <div class="top-info-bar">
            <div class="info-item prayer">
                <span class="info-icon">🔔</span>
                <div class="prayer-lines">
                    <span id="prayer-line-1">${escapeHtml(t('info.prayerLoading'))}</span>
                    <span id="prayer-line-2">--:--</span>
                </div>
            </div>
            <div class="info-item weather">
                <div class="weather-now">
                    <span class="info-icon">☀️</span>
                    <span id="makkah-temp" data-makkah-temp data-temp-format="{t}°C" data-temp-fallback="${escapeHtml(t('info.tempFallback'))}">--°C</span>
                </div>
                <span class="weather-city">${escapeHtml(t('info.makkah'))}</span>
            </div>
        </div>

        <!-- الأقسام مرتبة حسب مراحل الرحلة: ما يُحتاج أثناء السير أولاً، ثم قبل السفر ← في الطريق ← في مكة والمدينة ← العودة -->
${renderTripNowSection(country, derived, lang, t)}

${phase(1, 'phase-before', 'phase.before')}

${renderRoutesSection(country, lang, t)}

${renderCalculatorSection(country, shared, derived, lang, t)}

${renderChecklistSection(country, shared, lang, t)}

${renderAppsSection(country, shared, root, lang, t)}

${phase(2, 'phase-road', 'phase.road')}

${renderTipsSection(country, shared, 'road', 'section-road-tips', 'section.roadTips', lang, t)}

${renderPrayersSection(shared, lang, t)}

${multiRoute ? `${renderRouteSwitch(country, lang, t, ' route-switch-stations')}\n\n` : ''}${renderAccordions(outboundAccordions)}

${renderEmergencySection(country, root, lang, t)}

${phase(3, 'phase-city', 'phase.city')}

${renderTipsSection(country, shared, 'city', 'section-city-info', 'section.cityInfo', lang, t)}

${renderPlacesSection(shared, lang, t)}

${phase(4, 'phase-return', 'phase.return')}

${renderAccordions(returnAccordions)}

${renderSuggestionsSection(country, shared, lang, t)}
        <footer>
            <p class="footer-greeting">${escapeHtml(t('footer.greeting'))}</p>
            <p class="footer-dua">${escapeHtml(t('footer.dua'))}</p>
            <p class="footer-credit">${escapeHtml(t('footer.credit'))}</p>
        </footer>

    </div>

${renderMobileNav(stationSections, moreSections, t)}

    <script>window.COUNTRY_DATA = ${jsonForScript(runtimeConfig)}; window.APP_I18N = ${jsonForScript(runtimeStrings(lang))};</script>
    <script src="${root}js/app.js?v=${escapeHtml(assetHashes.appJs)}"></script>
</body>

</html>
`;
}

module.exports = {
    renderCountryPage
};
