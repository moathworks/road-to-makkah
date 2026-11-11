/**
 * قالب توليد صفحات الدول (HTML ثابت وكامل المحتوى بدون حقن DOM عبر JavaScript)
 */

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

const CHEVRON_SVG = `<svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const PLAY_STORE_SVG = `<svg viewBox="0 0 512 512" width="20" height="20"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>`;
const APP_STORE_SVG = `<svg viewBox="0 0 384 512" width="20" height="20"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>`;
const EXTERNAL_LINK_SVG = `<svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>`;

function renderStationCards(stations, startNumber = 1) {
    let currentNum = startNumber;
    return stations.map((st) => {
        const displayTitle = st.unnumbered
            ? escapeHtml(st.title)
            : `${currentNum++}. ${escapeHtml(st.title)}`;
        const btnLabel = escapeHtml(st.btnLabel || '🗺️ موقع المحطة');

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
            ? `\n                            <div class="${badgeClass}">${escapeHtml(st.badge)}</div>`
            : '';
        return `                    <div class="${cardClass}">
                        <div>${badgeHtml}
                            <h3>${displayTitle}</h3>
                            <p>${escapeHtml(st.desc)}</p>
                        </div>
                        <a href="${escapeHtml(st.mapUrl)}" target="_blank" rel="noopener noreferrer" class="btn-station-map">${btnLabel}</a>
                    </div>`;
    }).join('\n\n');
}

function renderPrayersSection() {
    return `        <details class="custom-accordion" id="section-prayers">
            <summary>
                <h2 class="accordion-title">🤲 أدعية وأذكار السفر</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p class="text-block"><strong>دعاء السفر:</strong> "الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخر لنا هذا وما كنا
                    له مقرنين وإنا إلى ربنا لمنقلبون. اللهم إنا نسألك في سفرنا هذا البر والتقوى ومن العمل ما ترضى، اللهم هوّن علينا سفرنا هذا، واطوِ عنا بعده، اللهم أنت الصاحب في السفر، والخليفة في الأهل، اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل" وإذا رجع قالهنّ وزاد فيهنّ: آيبون، تائبون، عابدون، لربنا حامدون.
                </p>
                <p class="text-block"><strong>عند نزول منزل أو استراحة:</strong> "أعوذ بكلمات الله التامات من شر ما خلق"</p>
                <p><strong>أثناء القيادة بالطريق:</strong> التكبير (الله أكبر) عند صعود المرتفعات والتسبيح (سبحان الله) عند النزول.</p>
            </div>
        </details>`;
}

function renderChecklistSection(country, shared) {
    let flatIndex = 0;
    const gridContent = shared.checklistGroups.map((group) => {
        const itemsHtml = group.items.map((item) => {
            const labelText = item.labelKey ? country[item.labelKey] : item.label;
            const legacyIdx = flatIndex++;
            return `                            <div class="switch-item">
                                <span class="switch-label">${escapeHtml(labelText)}</span>
                                <label class="switch">
                                    <input type="checkbox" class="checklist-toggle" id="check-${escapeHtml(item.id)}" data-check-id="${escapeHtml(item.id)}" data-legacy-id="check-${legacyIdx}" aria-label="${escapeHtml(labelText)}">
                                    <span class="slider"></span>
                                </label>
                            </div>`;
        }).join('\n');
        return `                            <div class="checklist-section-title">${escapeHtml(group.title)}</div>\n${itemsHtml}`;
    }).join('\n');

    return `        <details class="custom-accordion" id="section-checklist">
            <summary>
                <h2 class="accordion-title">✅ قائمة الفحص الذكية قبل السفر</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="checklist-wrapper">
                    <div class="progress-container">
                        <div class="progress-header">
                            <span>مدى جاهزيتك للرحلة</span>
                            <span id="progress-percent">0%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" id="progress-fill"></div>
                        </div>
                    </div>

                    <div class="checklist-btn-group">
                        <button type="button" class="checklist-btn" id="selectAllBtn">✅ تحديد الكل</button>
                        <button type="button" class="checklist-btn" id="deselectAllBtn">❌ إلغاء تحديد الكل</button>
                    </div>

                    <div class="checklist-grid">
${gridContent}
                    </div>
                </div>
            </div>
        </details>`;
}

function renderPilgrimInfoSection(country) {
    return `        <details class="custom-accordion" id="section-pilgrim-info">
            <summary>
                <h2 class="accordion-title">ℹ️ معلومات تهم المعتمر والزائر</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p class="info-tip">😴 <strong>الإرهاق والنعاس:</strong> لا تكابر أبداً بالقيادة عند شعورك بالنعاس. توقف فوراً عند أقرب محطة خدمة وخذ غفوة لمدة 20 دقيقة.</p>
                <hr class="info-divider">
                <p class="info-tip">☕ <strong>التوقف للاستراحة:</strong> يُفضل التوقف كل 250-300 كم (كل ساعتين إلى 3 ساعات) لتمديد العضلات وتجديد النشاط. تجنب القيادة المتواصلة لأكثر من 3 ساعات، وتبادل القيادة إن أمكن.</p>
                <hr class="info-divider">
                <p class="info-tip">📸 <strong>كاميرات ساهر:</strong> السرعة محددة بـ 140 كم/ساعة في معظم الطرق السريعة للسيارات الصغيرة. التزم بحزام الأمان وتفادى استخدام الجوال أثناء القيادة.</p>
                <hr class="info-divider">
                <p class="info-tip">🐪 <strong>الجمال السائبة:</strong> ${escapeHtml(country.camelWarningText)}</p>
                <hr class="info-divider">
                <p class="info-tip">📱 <strong>شرائح الاتصالات:</strong> تتوفر شركات (STC, Mobily, Zain). يُنصح بتفعيل باقة تجوال أو اقتناء شريحة إنترنت أو شريحة إلكترونية (eSIM) لتسهيل استخدام الخرائط وتطبيقات التوصيل.</p>
                <hr class="info-divider">
                <p class="info-tip">🏨 <strong>الفنادق والمواقف:</strong> تأكد من حجز الفنادق مسبقاً مع التأكد من توفر موقف للسيارة في الفندق، أو استخدام مواقف مداخل مكة الرسمية (مثل موقف كدي أو الزاهر) واستقلال حافلات مكة الترددية للحرم.</p>
                <hr class="info-divider">
                <p class="info-tip">🚕 <strong>المواصلات:</strong> اعتمد على تطبيقات مثل Uber و Careem للتنقل داخل مكة والمدينة بأسعار واضحة ومعتمدة.</p>
                <hr class="info-divider">
                <p class="info-tip">🚄 <strong>قطار الحرمين السريع:</strong> وسيلة ممتازة ومريحة للتنقل بين مكة المكرمة والمدينة المنورة (يستغرق حوالي ساعتين و20 دقيقة). يُنصح بحجز التذاكر مبكراً عبر تطبيق أو موقع قطار الحرمين.</p>
                <hr class="info-divider">
                <p class="info-tip">💧 <strong>ماء زمزم:</strong> يمكن شراء عبوات ماء زمزم المعبأ رسمياً من 📍 <a href="https://maps.app.goo.gl/yce1oqD2uAk5T7gn8" target="_blank" rel="noopener noreferrer" class="inline-link">مشروع الملك عبدالله بن عبدالعزيز لسقيا زمزم</a> في مكة المكرمة (حي كدي).</p>
            </div>
        </details>`;
}

function renderPlacesSection() {
    return `        <details class="custom-accordion" id="section-places">
            <summary>
                <h2 class="accordion-title">🕌 الأماكن التاريخية والدينية للزيارة</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="places-wrap">
                    <div class="places-group">
                        <h3 class="places-title">
                            <span>🕋</span> <strong>مكة المكرمة:</strong>
                        </h3>
                        <ul class="places-list">
                            <li><a href="https://maps.app.goo.gl/q8VcxANhQNgSPaJ36" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> غار ثور</li>
                            <li><a href="https://maps.app.goo.gl/TNMGNBzyxWRseN5y6" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> غار حراء (جبل النور)</li>
                            <li><a href="https://maps.app.goo.gl/suRzhpC1ZehUrzJP7" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> حي حراء الثقافي</li>
                            <li><a href="https://maps.app.goo.gl/HNgT1xdR7fmmoK5U8" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مسجد السيدة عائشة (ميقات التنعيم)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="places-title">
                            <span>🕌</span> <strong>المدينة المنورة:</strong>
                        </h3>
                        <ul class="places-list">
                            <li><a href="https://maps.app.goo.gl/f5cViWhDRbNprjN76" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> المعرض والمتحف الدولي للسيرة النبوية</li>
                            <li>
                                <a href="https://maps.app.goo.gl/hyXifHzKYRpVnqY78" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مسجد قباء
                                <div class="place-note">💡 بجانبه جادة قباء ومجموعة متنوعة من الأكشاك والمقاهي</div>
                                <div class="place-extra">
                                    🌴 <a href="https://maps.app.goo.gl/zCtxTyRjiR93MdJd7" target="_blank" rel="noopener noreferrer" class="inline-link">محل تمور "بستان العجوة"</a> <span class="place-extra-note">(مميز وقريب من مسجد قباء)</span>
                                </div>
                            </li>
                            <li><a href="https://maps.app.goo.gl/ci7CuEkf32CNRvQW8" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مقبرة شهداء أحد وجبل الرماة</li>
                            <li><a href="https://maps.app.goo.gl/eMzkh1SU2zmkgfVo7" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مطل أحد</li>
                            <li><a href="https://maps.app.goo.gl/qSRrnmKypC3yPRE88" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مسجد القبلتين</li>
                        </ul>
                    </div>
                </div>
            </div>
        </details>`;
}

function renderAppCard(app) {
    let iconMarkup = '';
    if (app.iconEmoji) {
        iconMarkup = `<div class="app-icon app-icon-emoji">${escapeHtml(app.iconEmoji)}</div>`;
    } else {
        const iconClass = app.iconContain ? 'app-icon app-icon-contain' : 'app-icon';
        iconMarkup = `<img loading="lazy" src="../${escapeHtml(app.iconSrc)}" alt="${escapeHtml(app.iconAlt || app.title)}" class="${iconClass}">`;
    }

    const ariaBase = app.ariaName || app.title;
    const playLink = app.playUrl
        ? `<a href="${escapeHtml(app.playUrl)}" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="${escapeHtml(ariaBase)} على Google Play">${PLAY_STORE_SVG}</a>`
        : '';
    const appleLink = app.appleUrl
        ? `<a href="${escapeHtml(app.appleUrl)}" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="${escapeHtml(ariaBase)} على App Store">${APP_STORE_SVG}</a>`
        : '';
    const webLink = app.webUrl
        ? `<a href="${escapeHtml(app.webUrl)}" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="الموقع الإلكتروني" aria-label="${escapeHtml(app.webAriaLabel || `موقع ${app.title}`)}">${EXTERNAL_LINK_SVG}</a>`
        : '';

    const links = [playLink, appleLink, webLink].filter(Boolean).join('\n                        ');

    return `                <div class="app-item">
                    <div class="app-info">
                        ${iconMarkup}
                        <div>
                            <div class="app-title">${escapeHtml(app.title)}</div>
                            <div class="app-desc">${escapeHtml(app.desc)}</div>
                        </div>
                    </div>
                    <div class="app-links">
                        ${links}
                    </div>
                </div>`;
}

function renderAppsSection(country, shared) {
    const allApps = [...(country.extraApps || []), ...shared.sharedApps];
    const cardsHtml = allApps.map(renderAppCard).join('\n\n');

    return `        <details class="custom-accordion apps-section" id="section-apps">
            <summary>
                <h2 class="accordion-title summary-with-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 0120.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>تطبيقات وروابط مهمة
                </h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
${cardsHtml}
            </div>
        </details>`;
}

function renderEmergencySection(country) {
    const localEmergencyCard = country.countryCode !== 'sa' ? `
                    <div class="emergency-box country-local">
                        <h3>
                            <img loading="lazy" src="../assets/images/${escapeHtml(country.flagFile)}" alt="${escapeHtml(country.countryName)}" class="flag-img">
                            في ${escapeHtml(country.countryName)} (طوارئ عامة)
                        </h3>
                        <a href="tel:${escapeHtml(country.emergencyNumber)}" class="emergency-number" title="اتصال بطوارئ ${escapeHtml(country.countryName)} ${escapeHtml(country.emergencyNumber)}">📞 ${escapeHtml(country.emergencyNumber)}</a>
                    </div>` : '';

    return `        <div class="emergency-section" id="section-emergency">
            <div class="emergency-header-title">
                <h2 class="accordion-title">📞 أرقام الطوارئ (اضغط على الرقم للاتصال المباشر)</h2>
            </div>
            <div class="emergency-body">
                <div class="emergency-grid">${localEmergencyCard}
                    <div class="emergency-box saudi">
                        <h3>
                            <img loading="lazy" src="../assets/images/sa-flag.png" alt="السعودية" class="flag-img">
                            في السعودية (أمن الطرق)
                        </h3>
                        <a href="tel:911" class="emergency-number" title="اتصال بأمن الطرق 911">📞 911</a>
                    </div>
                    <div class="emergency-box saudi">
                        <h3>
                            <img loading="lazy" src="../assets/images/sa-flag.png" alt="السعودية" class="flag-img">
                            الهلال الأحمر (إسعاف)
                        </h3>
                        <a href="tel:997" class="emergency-number" title="اتصال بالإسعاف 997">📞 997</a>
                    </div>
                    <div class="emergency-box saudi">
                        <h3>
                            <img loading="lazy" src="../assets/images/sa-flag.png" alt="السعودية" class="flag-img">
                            نجم للحوادث (السعودية)
                        </h3>
                        <a href="tel:920000560" class="emergency-number emergency-number-long" title="اتصال بنجم للحوادث">📞 920000560</a>
                        <p class="emergency-note">المنصة الوطنية لإدارة حوادث السير للمركبات المؤمنة</p>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderSuggestionsSection(country, shared) {
    return `        <details class="custom-accordion suggestions-wrapper" id="section-suggestions">
            <summary>
                <h2 class="accordion-title">💡 اقتراحاتك واستفساراتك</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="suggestions-header">
                    <p>يسعدنا سماع رأيك أو أي تعديل تقترحه لتطوير هذا الدليل</p>
                </div>

                <form id="suggestionForm" class="suggestion-form" action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="${escapeHtml(shared.web3formsAccessKey)}">
                    <input type="checkbox" name="botcheck" class="hidden">
                    <input type="hidden" name="from_page" value="دليل ${escapeHtml(country.countryName)} - مكة المكرمة">
                    <input type="hidden" name="from_name" value="دليل ${escapeHtml(country.countryName)} - مكة المكرمة 🕋">
                    <input type="hidden" name="subject" value="اقتراح/استفسار من دليل ${escapeHtml(country.countryName)} - مكة المكرمة 🕋">

                    <div class="form-group">
                        <label for="suggest_name" class="form-label">الاسم الكريم <span class="required-mark">*</span></label>
                        <input type="text" id="suggest_name" name="name" class="form-input" required placeholder="مثال: محمد">
                    </div>

                    <div class="form-group">
                        <label for="suggest_email" class="form-label">البريد الإلكتروني <span class="required-mark">*</span></label>
                        <input type="email" id="suggest_email" name="email" class="form-input" required placeholder="name@example.com">
                    </div>

                    <div class="form-group-full">
                        <label for="suggest_message" class="form-label">اقتراحك أو رسالتك <span class="required-mark">*</span></label>
                        <textarea id="suggest_message" name="message" class="form-textarea" required placeholder="اكتب اقتراحك أو تفاصيل التعديل الذي ترغب بإضافته هنا..."></textarea>
                    </div>

                    <div class="captcha-container" id="h-captcha-wrapper">
                        <div class="h-captcha" id="h-captcha-widget" data-captcha="true" data-lang="ar" data-theme="light"></div>
                    </div>

                    <div class="btn-submit-container">
                        <button type="submit" id="btnSubmitSuggest" class="btn-submit-suggestion">
                            <span>إرسال ✉️</span>
                        </button>
                    </div>

                    <div id="suggestionStatus" class="suggestion-status"></div>
                </form>
            </div>
        </details>`;
}

function renderFooterSection() {
    return `        <footer>
            <p class="footer-greeting">عمرة مقبولة ورحلة آمنة بإذن الله 🕋</p>
            <p class="footer-dua">تذكرونا بدعوة صالحة 🤲</p>
            <p class="footer-credit">تم تصميم الدليل بواسطة معاذ بلال</p>
        </footer>`;
}

function renderMobileNav() {
    return `    <nav class="mobile-bottom-nav" aria-label="التنقل السريع للجوال">
        <button type="button" class="mobile-nav-btn active" data-target="section-calculator" onclick="navigateToSection('section-calculator', this)">
            <span class="nav-icon">⏱️</span>
            <span>الحاسبة</span>
        </button>
        <button type="button" class="mobile-nav-btn" data-target="section-stations-start" onclick="navigateToSection('section-stations-start', this)">
            <span class="nav-icon">⛽</span>
            <span>المحطات</span>
        </button>
        <button type="button" class="mobile-nav-btn" data-target="section-checklist" onclick="navigateToSection('section-checklist', this)">
            <span class="nav-icon">✅</span>
            <span>الفحص</span>
        </button>
        <button type="button" class="mobile-nav-btn" data-target="section-prayers" onclick="navigateToSection('section-prayers', this)">
            <span class="nav-icon">🤲</span>
            <span>الأدعية</span>
        </button>
        <button type="button" class="mobile-nav-btn" data-target="section-emergency" onclick="navigateToSection('section-emergency', this)">
            <span class="nav-icon">📞</span>
            <span>الطوارئ</span>
        </button>
    </nav>`;
}

function renderCountryPage(country, shared, ctx) {
    const { assetHashes, derived, lastUpdatedText } = ctx;
    const cssVersion = assetHashes.styleCss;
    const jsVersion = assetHashes.appJs;

    const outboundCount = country.outboundStations.filter(s => !s.unnumbered).length;
    const riyadhStartNum = outboundCount + 1;
    const riyadhMainCount = shared.routeSegments.riyadhMain.filter(s => !s.unnumbered).length;
    const riyadhToMakkahStartNum = riyadhStartNum + riyadhMainCount;

    const totalDistFormatted = formatNumber(country.totalDistanceKm);

    const routesHtml = country.routes.map((r) => `            <div class="route-card">
                <div>
                    <h3>${escapeHtml(r.title)}</h3>
                    <p><strong>خط السير:</strong> ${escapeHtml(r.itinerary)}</p>
                    <p class="route-desc">${escapeHtml(r.description)}</p>
                </div>
                <div class="route-card-footer">
                    <div class="route-badge">المسافة: ${formatNumber(r.distanceKm)} كم</div>
                    <a href="${escapeHtml(r.mapUrl)}" target="_blank" rel="noopener noreferrer" class="route-card-link">📍 بدء الرحلة</a>
                </div>
            </div>`).join('\n');

    const outboundCardsHtml = renderStationCards(country.outboundStations, 1);
    const riyadhMainCardsHtml = renderStationCards(shared.routeSegments.riyadhMain, riyadhStartNum);
    const riyadhBypassCardsHtml = renderStationCards(shared.routeSegments.riyadhBypassSalman, riyadhStartNum);
    const riyadhToMakkahCardsHtml = renderStationCards(shared.routeSegments.riyadhToMakkah, riyadhToMakkahStartNum);
    const madinahToRiyadhReturnCardsHtml = renderStationCards(shared.routeSegments.madinahToRiyadhReturn, 1);
    const returnCardsHtml = renderStationCards(country.returnStations, 1);

    const runtimeConfig = {
        countryCode: country.countryCode,
        countryName: country.countryName,
        defaultCity: country.defaultCity,
        totalDistanceKm: country.totalDistanceKm,
        estimatedDriveHours: country.estimatedDriveHours,
        stations: derived.gpsPoints
    };
    // JSON داخل <script>: نهرّب «<» حتى لا يُغلق الوسم نصٌّ داخل البيانات
    const runtimeConfigJson = JSON.stringify(runtimeConfig).replace(/</g, '\\u003c');

    const canonicalUrl = `${shared.siteUrl}/${country.slug}/`;
    const ogImageUrl = `${shared.siteUrl}/assets/images/kaaba.jpg`;

    return `<!-- AUTO-GENERATED BY build.js - DO NOT EDIT MANUALLY -->
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="${escapeHtml(country.themeColor)}">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="description" content="${escapeHtml(country.metaDescription)}">
    <title>${escapeHtml(country.pageTitle)}</title>
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ar_AR">
    <meta property="og:site_name" content="دليل السفر البري إلى مكة المكرمة">
    <meta property="og:title" content="${escapeHtml(country.pageTitle)}">
    <meta property="og:description" content="${escapeHtml(country.metaDescription)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:image" content="${escapeHtml(ogImageUrl)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(country.pageTitle)}">
    <meta name="twitter:description" content="${escapeHtml(country.metaDescription)}">
    <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}">
    <link rel="manifest" href="../manifest.json">
    <link rel="apple-touch-icon" href="../assets/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../assets/images/icon-192.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css?v=${escapeHtml(cssVersion)}">
    <style>
        /* ${escapeHtml(country.themeComment)} */
        :root {
            --brand: ${escapeHtml(country.themeColor)};
            --brand-rgb: ${escapeHtml(country.themeColorRgb)};
            --brand-dark: ${escapeHtml(country.themeColorDark)};
        }
    </style>
</head>

<body class="light-mode" data-country="${escapeHtml(country.countryCode)}">

    <div class="container">

        <!-- هيدر خاص للطباعة فقط -->
        <div class="print-only print-header">
            <div class="print-title">${escapeHtml(country.printHeaderTitle)}</div>
            <p>${escapeHtml(country.printHeaderSubtitle)}</p>
        </div>

        <!-- الهيدر -->
        <header>
            <div class="header-title-block">
                <h1 class="header-h1">
                    <a href="../" class="header-logo">
                        <img loading="lazy" src="../assets/images/${escapeHtml(country.flagFile)}" alt="${escapeHtml(country.countryName)}" class="flag-img">
                        ${escapeHtml(country.countryName)} ← 🕋 مكة المكرمة
                    </a>
                </h1>
                <div class="last-updated">آخر تحديث: ${escapeHtml(lastUpdatedText)}</div>
            </div>
            <div class="quick-actions-row">
                <a href="../" class="quick-access-btn" title="الرئيسية (كل الدول)" aria-label="الرئيسية (كل الدول)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </a>
                <button type="button" id="themeToggleBtn" onclick="toggleTheme()" title="تغيير المظهر" aria-label="تغيير المظهر">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                <button type="button" class="quick-access-btn" onclick="printRoute()" title="طباعة مسار الرحلة" aria-label="طباعة مسار الرحلة">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                </button>
                <button type="button" class="quick-access-btn" onclick="sharePage()" title="مشاركة الدليل" aria-label="مشاركة الدليل">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                </button>
                <button type="button" class="quick-access-btn" onclick="toggleAllAccordions()" title="طي / فتح الكل" aria-label="طي أو فتح الكل">
                    <svg id="toggleAllIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <polyline points="7 11 12 6 17 11"></polyline>
                        <polyline points="7 18 12 13 17 18"></polyline>
                    </svg>
                </button>
            </div>
            <p class="header-subtitle">${escapeHtml(country.headerSubtitle)}</p>
        </header>

        <!-- البار العلوي للمعلومات (مواقيت الصلاة الحية في مكة + الطقس المباشر) -->
        <div class="top-info-bar">
            <div class="info-item prayer">
                <span class="info-icon">🔔</span>
                <div class="prayer-lines">
                    <span id="prayer-line-1">مواقيت مكة: جاري التحديث...</span>
                    <span id="prayer-line-2">--:--</span>
                </div>
            </div>
            <div class="info-item weather">
                <div class="weather-now">
                    <span class="info-icon">☀️</span>
                    <span id="makkah-temp" data-makkah-temp data-temp-format="{t}°C" data-temp-fallback="غير متاح">--°C</span>
                </div>
                <span class="weather-city">مكة المكرمة</span>
            </div>
        </div>

        <!-- نصائح السفر وأذكار الطريق -->
${renderPrayersSection()}

        <!-- ${escapeHtml(country.checklistComment)} -->
${renderChecklistSection(country, shared)}

        <!-- حاسبة وقت ومسار وتكلفة الرحلة -->
        <details class="custom-accordion hero-section" id="section-calculator">
            <summary>
                <h2 class="hero-title">⏱️ حاسبة وقت ومسار وتكلفة الرحلة</h2>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="accordion-content">

                <!-- 1. حاسبة وقت الانطلاق والوصول -->
                <div class="trip-planner">
                    <div class="planner-group">
                        <label for="dep-time">توقيت الانطلاق</label>
                        <input type="datetime-local" id="dep-time" class="planner-input" onchange="calcArrival()">
                    </div>
                    <div class="planner-group">
                        <span>المسافة المقدرة</span>
                        <strong>${totalDistFormatted} كم</strong>
                    </div>
                    <div class="planner-group">
                        <span>وقت الوصول المتوقع (شامل التوقفات)</span>
                        <strong id="arr-time" class="planner-highlight">حدد وقت الانطلاق</strong>
                    </div>
                </div>

                <!-- 2. حاسبة المسافة المتبقية المباشرة (GPS) -->
                <div class="trip-planner">
                    <div class="planner-group">
                        <span>الموقع الحالي (GPS)</span>
                        <strong id="currentLocationName">${escapeHtml(country.defaultCity)}</strong>
                        <button type="button" id="btnLocateMe" class="checklist-btn btn-locate" onclick="toggleLocationTracking()">📍 حدّد موقعي الآن</button>
                    </div>
                    <div class="planner-group">
                        <span>المسافة المتبقية لمكة</span>
                        <strong id="remDist">${totalDistFormatted} كم</strong>
                    </div>
                    <div class="planner-group">
                        <span>وقت الوصول من موقعك*</span>
                        <strong id="remArrival" class="planner-highlight">--:--</strong>
                        <span class="planner-note">*الزمن الصافي: <span id="remTime">${escapeHtml(derived.netDriveTimeText)}</span> قيادة</span>
                    </div>
                </div>

                <!-- 3. حاسبة تكلفة الوقود التقديرية -->
                <div class="trip-planner trip-planner-fuel">
                    <div class="planner-group">
                        <label for="calc-distance">المسافة لحساب الوقود (كم)</label>
                        <input type="number" id="calc-distance" class="planner-input" value="${country.totalDistanceKm}" min="0" step="10" oninput="calculateFuel()">
                    </div>
                    <div class="planner-group">
                        <label for="calc-rate">استهلاك السيارة (لتر/100كم)</label>
                        <input type="number" id="calc-rate" class="planner-input" value="${shared.defaultFuelRate}" min="1" max="35" step="0.5" oninput="calculateFuel()">
                    </div>
                    <div class="planner-group">
                        <label for="calc-price">سعر اللتر (ريال)</label>
                        <input type="number" id="calc-price" class="planner-input" value="${shared.defaultFuelPrice}" min="0.5" max="10" step="0.05" oninput="calculateFuel()">
                    </div>
                    <div class="planner-group">
                        <span>الوقود والتكلفة التقديرية</span>
                        <strong id="res-total" class="planner-highlight planner-total">${formatNumber(derived.fuelCostSar)} ريال</strong>
                        <span id="res-liters" class="fuel-liters">${escapeHtml(derived.fuelLitersText)} لتر</span>
                    </div>
                </div>

                <button type="button" class="btn-launch" onclick="startJourney()">📍 ابدأ الملاحة المباشرة إلى مكة المكرمة</button>
            </div>
        </details>

        <!-- ${escapeHtml(country.routeComment)} -->
        <h2 class="section-header" id="section-routes">🛣️ خيارات مسارات السفر البري</h2>
        <div class="carousel-container">
${routesHtml}
        </div>

        <!-- ${escapeHtml(country.outboundComment)} -->
        <details class="custom-accordion" id="section-stations-start">
            <summary>
                <h2 class="accordion-title">${escapeHtml(country.outboundSummaryTitle)}</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="stations-grid">
${outboundCardsHtml}
                </div>
            </div>
        </details>

        <!-- محطات داخل الرياض - طريق 40 (80M) -->
        <details class="custom-accordion">
            <summary>
                <h2 class="accordion-title">⛽ محطات مدينة الرياض - طريق 40 (80M الرئيسي)</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="riyadh-inner-grid">
${riyadhMainCardsHtml}
                </div>
            </div>
        </details>

        <!-- محطات الرياض - المسار الالتفافي -->
        <details class="custom-accordion accordion-bypass">
            <summary>
                <h2 class="accordion-title">⛽ محطات مدينة الرياض - مسار التفافي (طريق الملك سلمان)</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p class="section-intro">يُستخدم هذا المسار للابتعاد عن زحام وسط المدينة خلال أوقات الذروة.</p>
                <div class="riyadh-inner-grid">
${riyadhBypassCardsHtml}
                </div>
            </div>
        </details>

        <!-- محطات طريق الذهاب (الرياض ← الطائف ← مكة) -->
        <details class="custom-accordion">
            <summary>
                <h2 class="accordion-title">⛽ محطات طريق الذهاب (الرياض ← الطائف ← مكة)</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="stations-grid">
${riyadhToMakkahCardsHtml}
                </div>
            </div>
        </details>

        <!-- محطات طريق العودة (المدينة المنورة ← الرياض) -->
        <details class="custom-accordion">
            <summary>
                <h2 class="accordion-title">⛽ محطات طريق العودة (المدينة المنورة ← الرياض)</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p class="section-intro">المحطات النموذجية الموصى بها على طريق الهجرة - القصيم - الرياض السريع:</p>
                <div class="stations-grid">
${madinahToRiyadhReturnCardsHtml}
                </div>
            </div>
        </details>

        <!-- ${escapeHtml(country.returnComment)} -->
        <details class="custom-accordion">
            <summary>
                <h2 class="accordion-title">${escapeHtml(country.returnSummaryTitle)}</h2>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p class="section-intro">${escapeHtml(country.returnIntroText)}</p>
                <div class="stations-grid">
${returnCardsHtml}
                </div>
            </div>
        </details>

        <!-- الأقسام المشتركة المولّدة كـ HTML ثابت -->
${renderPilgrimInfoSection(country)}
${renderPlacesSection()}
${renderAppsSection(country, shared)}
${renderEmergencySection(country)}
${renderSuggestionsSection(country, shared)}
${renderFooterSection()}

    </div>

    <!-- شريط التنقل السفلي الذكي للجوال -->
${renderMobileNav()}

    <script>window.COUNTRY_DATA = ${runtimeConfigJson};</script>
    <script src="../js/app.js?v=${escapeHtml(jsVersion)}"></script>
    <script src="https://web3forms.com/client/script.js" async defer></script>
</body>

</html>
`;
}

module.exports = {
    escapeHtml,
    formatNumber,
    renderCountryPage
};
