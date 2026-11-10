/**
 * البيانات والأقسام المشتركة لدليل السفر البري إلى مكة المكرمة
 * يُستخدم لتوليد الأقسام المشتركة والمقاطع المشتركة من المحطات تلقائياً لجميع الدول دون تكرار الكود
 */

const CHEVRON_SVG = `<svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

const PLAY_STORE_SVG = `<svg viewBox="0 0 512 512" width="20" height="20"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>`;

const APP_STORE_SVG = `<svg viewBox="0 0 384 512" width="20" height="20"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>`;

const EXTERNAL_LINK_SVG = `<svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>`;

// 1. المقاطع المشتركة لمحطات الطرق بين دول الخليج ومكة المكرمة
const SHARED_ROUTE_SEGMENTS = {
    // محطات داخل مدينة الرياض (طريق 80 السريع - المسار الرئيسي)
    riyadhMain80: [
        {
            title: 'محطة ساسكو (الرياض)',
            desc: 'تضم سوبرماركت "نخلة" وخدمات متكاملة ونظيفة للراحة السريعة.',
            mapUrl: 'https://maps.app.goo.gl/hX4K7Xxvz9VDeZTa9'
        },
        {
            title: 'محطة الدريس (الرياض)',
            desc: 'يتوفر بها تموينات شاملة وخدمات سيارات أساسية (إطارات وهواء).',
            mapUrl: 'https://maps.app.goo.gl/rresvUcxnb8n59TB7'
        }
    ],

    // محطات المسار الالتفافي حول الرياض (طريق الملك سلمان)
    riyadhBypassSalman: [
        {
            title: 'ساسكو (قبل المطار)',
            desc: 'محطة كبرى ونموذجية قريبة من مطار الملك خالد تحتوي على كافة الخدمات.',
            mapUrl: 'https://maps.app.goo.gl/qkcbBxYQv7Yocg3MA'
        },
        {
            title: 'ساسكو (بعد المطار)',
            desc: 'محطة خدمات متكاملة على امتداد المسار الالتفافي.',
            mapUrl: 'https://maps.app.goo.gl/8HdbnqV5uGX6ewyW6'
        }
    ],

    // محطات طريق الذهاب المشترك (الرياض ← الطائف ← السيل الكبير ← مكة)
    riyadhToMakkah: [
        {
            badge: 'مخرج غرب الرياض (طويق)',
            title: 'محطة الدريس - طويق',
            desc: 'موقع مناسب للتأكد من خزان الوقود قبل الخروج الفعلي من حدود الرياض.',
            mapUrl: 'https://maps.app.goo.gl/FjZRJmY1mFFgT5Az9'
        },
        {
            badge: 'تبعد ~7 كم عن الدريس طويق',
            title: 'محطة بترومين - القدية',
            desc: 'محطة كبرى بعد الخروج من الرياض، تضم مطعم البيك الشهير.',
            mapUrl: 'https://maps.app.goo.gl/yVAcfAs2ZfEX9dKx5'
        },
        {
            badge: 'تبعد ~66 كم عن المحطة السابقة',
            title: 'محطة ساسكو - تبرك',
            desc: 'من المحطات النموذجية والموثوقة بعد مغادرة منطقة الرياض.',
            mapUrl: 'https://maps.app.goo.gl/4A5Lp96UrZ3onjQj6'
        },
        {
            badge: 'تبعد ~60 كم عن المحطة السابقة',
            title: 'محطة ساسكو - القويعية',
            desc: 'نقطة توقف استراتيجية ورئيسية للراحة وتمديد العضلات.',
            mapUrl: 'https://maps.app.goo.gl/oq6EuAoKghBGKjRYA'
        },
        {
            badge: 'تبعد ~170 كم عن المحطة السابقة',
            title: 'محطة ساسكو - الخاصرة',
            desc: 'محطة كبرى على طريق الرياض - مكة المكرمة توفر جميع الخدمات والمطاعم.',
            mapUrl: 'https://maps.app.goo.gl/ynR4FzfqCVQnBnLw6'
        },
        {
            badge: 'تبعد ~144 كم عن المحطة السابقة',
            title: 'محطة ساسكو - الحوميات',
            desc: 'محطة كبرى على طريق الرياض - مكة المكرمة توفر جميع الخدمات والمطاعم.',
            mapUrl: 'https://maps.app.goo.gl/Lj4sBrVA4Ug9oqz8A'
        },
        {
            badge: 'تبعد ~72 كم عن المحطة السابقة',
            title: 'محطة ساسكو - ظلم',
            desc: 'محطة كبرى قبل التوجه إلى منطقة الطائف وميقات قرن المنازل.',
            mapUrl: 'https://maps.app.goo.gl/Z5aUUuPz5jJNYoL1A'
        },
        {
            unnumbered: true,
            variant: 'food',
            badge: 'استراحة طعام',
            title: '🍔 مطعم البيك (قبل السيل)',
            desc: 'يقع قبل ميقات السيل الكبير مباشرة.',
            mapUrl: 'https://maps.app.goo.gl/fXBgtMqVtdHjzGt5A',
            btnLabel: '🍗 موقع المطعم'
        },
        {
            variant: 'miqat',
            badge: 'تبعد ~245 كم عن محطة ظلم',
            title: 'محطة ساسكو (السيل الكبير)',
            desc: 'بالقرب من الطائف والميقات، نقطة الاستعداد والاغتسال للإحرام (قرن المنازل).',
            mapUrl: 'https://maps.app.goo.gl/Vds8UPCtvsFRXoG26'
        }
    ],

    // محطات طريق العودة المشترك (المدينة المنورة ← القصيم ← سدير ← الرياض)
    madinahToRiyadhReturn: [
        {
            badge: 'تبعد ~235 كم عن المدينة المنورة',
            title: 'محطة الخدمة الذهبية',
            desc: 'من المحطات الكبرى والرئيسية على طريق المدينة - القصيم.',
            mapUrl: 'https://maps.app.goo.gl/SxWiMb8wV5Ny63i78'
        },
        {
            badge: 'تبعد ~230 كم عن المحطة السابقة',
            title: 'محطة الدريس - البكيرية',
            desc: 'من المحطات الكبرى والرئيسية في منطقة القصيم.',
            mapUrl: 'https://maps.app.goo.gl/Kpvjq8gj46RtKsWJ7'
        },
        {
            badge: 'تبعد ~225 كم عن المحطة السابقة',
            title: 'محطة لودر - سدير',
            desc: 'محطة حديثة تتوفر بها خدمات متكاملة ومطعم البيك.',
            mapUrl: 'https://maps.app.goo.gl/zzCxVacA7Yq8ky74A'
        },
        {
            badge: 'تبعد ~200 كم عن المحطة السابقة',
            title: 'محطة ساسكو الجزيرة',
            desc: 'مدخل الرياض الشمالي وتتوفر بها كافة الخدمات ومطعم البيك.',
            mapUrl: 'https://maps.app.goo.gl/Bmmvk5oWBikPijqQ8'
        }
    ]
};

// 2. قائمة الفحص الذكية الموحدة (36 بنداً مقسمة إلى 3 مجموعات)
function getSharedChecklistSections(countryConfig) {
    const nationalIdLabel = (countryConfig && countryConfig.nationalIdLabel) || 'البطاقة الشخصية / الهوية الوطنية';
    return [
        {
            title: '📄 الوثائق والاتصالات',
            items: [
                'جوازات السفر صالحة (6 أشهر على الأقل)',
                nationalIdLabel,
                'تأشيرة السعودية',
                'استمارة السيارة ورخصة القيادة',
                'تأمين السيارة (للسعودية)',
                'تفعيل باقة تجوال أو شريحة سعودية',
                'تثبيت وتحديث تطبيقي (نسك) و(توكلنا)',
                'تحميل خرائط Google Maps بدون إنترنت',
                'دليل العمرة'
            ]
        },
        {
            title: '🚗 السيارة والتجهيزات',
            items: [
                'فحص ضغط الإطارات والإطار الاحتياطي',
                'عدة تبديل الإطارات',
                'منفاخ إطارات كهربائي',
                'فحص زيوت المحرك والفرامل',
                'فحص مياه الراديتر والمساحات',
                'فحص تكييف السيارة',
                'عدة تصليح (مفاتيح مقاسات متعددة)',
                'بطارية شحن لتشغيل بطارية السيارة أو كابلات التوصيل',
                'مفتاح احتياطي للسيارة (مع مرافق)',
                'مصباح يدوي (كشاف طوارئ)',
                'طفاية حريق ومثلث السلامة',
                'حقيبة الإسعافات الأولية',
                'شاحن السيارة للجوال',
                'بطارية شحن إضافية للجوال (باور بانك)',
                'مبلغ نقدي سعودي (كاش)',
                'تجهيز حقيبة الإحرام بشكل مستقل'
            ]
        },
        {
            title: '💊 الصحة والراحة الشخصية',
            items: [
                'أدوية شخصية (مسكنات، خافض حرارة..)',
                'أدوية الأطفال',
                'مرهم طبي للتسلخات الجسدية (مهم أثناء الإحرام)',
                'قطرة ترطيب العين',
                'نظارات شمسية',
                'مظلة شمسية بيضاء للطواف والمشي بالنهار',
                'مياه صالحة للشرب ووجبات خفيفة كافية للطريق',
                'أدوات حلاقة (ماكينة، مقص، شفرة)',
                'مقص أظافر',
                'مناديل مبللة (غير معطرة للإحرام)',
                'محارم جيب'
            ]
        }
    ];
}

// 3. دوال توليد بطاقات المحطات المشتركة
function renderStationSegmentHTML(segmentKey, startNumber = 1, gridClass = 'stations-grid') {
    const stations = SHARED_ROUTE_SEGMENTS[segmentKey];
    if (!stations || !stations.length) return '';

    let currentNum = parseInt(startNumber, 10) || 1;
    const cardsHtml = stations.map(st => {
        const displayTitle = st.unnumbered ? st.title : `${currentNum++}. ${st.title}`;
        const btnLabel = st.btnLabel || '🗺️ موقع المحطة';

        let cardStyle = '';
        let badgeStyle = '';
        let titleStyle = '';
        let btnStyle = '';

        if (st.variant === 'food') {
            cardStyle = ' style="border: 2px solid #e74c3c; background: rgba(231, 76, 60, 0.05);"';
            badgeStyle = ' style="background: rgba(231, 76, 60, 0.12); color: #e74c3c; border-color: rgba(231, 76, 60, 0.25);"';
            titleStyle = ' style="color: #e74c3c;"';
            btnStyle = ' style="background: #e74c3c; border-color: #e74c3c; color: white;"';
        } else if (st.variant === 'miqat') {
            badgeStyle = ' style="background:rgba(46, 204, 113, 0.1); color:#2ecc71; border-color:rgba(46,204,113,0.2);"';
        }

        const badgeHtml = st.badge ? `<div class="distance-badge-dark"${badgeStyle}>${st.badge}</div>` : '';

        return `
                    <div class="station-card"${cardStyle}>
                        <div>
                            ${badgeHtml}
                            <h2${titleStyle}>${displayTitle}</h2>
                            <p>${st.desc}</p>
                        </div>
                        <a href="${st.mapUrl}" target="_blank" rel="noopener noreferrer" class="btn-station-map"${btnStyle}>${btnLabel}</a>
                    </div>`;
    }).join('\n');

    return `<div class="${gridClass}">${cardsHtml}\n                </div>`;
}

// 4. دوال توليد الأقسام المشتركة بالكامل
const SHARED_SECTION_RENDERERS = {
    prayers: () => `
        <details class="custom-accordion" id="section-prayers">
            <summary>
                <span>🤲 أدعية وأذكار السفر</span>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p style="margin-bottom: 10px;"><strong>دعاء السفر:</strong> "الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخر لنا هذا وما كنا
                    له مقرنين وإنا إلى ربنا لمنقلبون. اللهم إنا نسألك في سفرنا هذا البر والتقوى ومن العمل ما ترضى، اللهم هوّن علينا سفرنا هذا، واطوِ عنا بعده، اللهم أنت الصاحب في السفر، والخليفة في الأهل، اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل" وإذا رجع قالهنّ وزاد فيهنّ: آيبون، تائبون، عابدون، لربنا حامدون.
                </p>
                <p style="margin-bottom: 10px;"><strong>عند نزول منزل أو استراحة:</strong> "أعوذ بكلمات الله التامات من شر ما خلق"</p>
                <p><strong>أثناء القيادة بالطريق:</strong> التكبير (الله أكبر) عند صعود المرتفعات والتسبيح (سبحان الله) عند النزول.</p>
            </div>
        </details>`,

    checklist: (cfg) => {
        const groups = getSharedChecklistSections(cfg);
        const gridContent = groups.map(group => {
            const itemsHtml = group.items.map(label => `
                            <div class="switch-item">
                                <span class="switch-label">${label}</span>
                                <label class="switch">
                                    <input type="checkbox" class="checklist-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>`).join('');
            return `
                            <div class="checklist-section-title">${group.title}</div>${itemsHtml}`;
        }).join('\n');

        return `
        <details class="custom-accordion" id="section-checklist">
            <summary>
                <span>✅ قائمة الفحص الذكية قبل السفر</span>
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

                    <div id="checklist-collapse-content">
                        <div class="checklist-btn-group">
                            <button type="button" class="checklist-btn" id="selectAllBtn">✅ تحديد الكل</button>
                            <button type="button" class="checklist-btn" id="deselectAllBtn">❌ إلغاء تحديد الكل</button>
                        </div>

                        <div class="checklist-grid">${gridContent}
                        </div>
                    </div>
                </div>
            </div>
        </details>`;
    },

    'pilgrim-info': (cfg) => {
        const camelWarning = (cfg && cfg.camelWarningText) || 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد سلوى وحتى خريص، وبعد القويعية وحتى الطائف.';
        return `
        <details class="custom-accordion" id="section-pilgrim-info">
            <summary>
                <span>ℹ️ معلومات تهم المعتمر والزائر</span>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <p style="margin-bottom: 8px;">😴 <strong>الإرهاق والنعاس:</strong> لا تكابر أبداً بالقيادة عند شعورك بالنعاس. توقف فوراً عند أقرب محطة خدمة وخذ غفوة لمدة 20 دقيقة.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">☕ <strong>التوقف للاستراحة:</strong> يُفضل التوقف كل 250-300 كم (كل ساعتين إلى 3 ساعات) لتمديد العضلات وتجديد النشاط. تجنب القيادة المتواصلة لأكثر من 3 ساعات، وتبادل القيادة إن أمكن.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">📸 <strong>كاميرات ساهر:</strong> السرعة محددة بـ 140 كم/ساعة في معظم الطرق السريعة للسيارات الصغيرة. التزم بحزام الأمان وتفادى استخدام الجوال أثناء القيادة.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">🐪 <strong>الجمال السائبة:</strong> ${camelWarning}</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">📱 <strong>شرائح الاتصالات:</strong> تتوفر شركات (STC, Mobily, Zain). يُنصح بتفعيل باقة تجوال أو اقتناء شريحة إنترنت أو شريحة إلكترونية (eSIM) لتسهيل استخدام الخرائط وتطبيقات التوصيل.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">🏨 <strong>الفنادق والمواقف:</strong> تأكد من حجز الفنادق مسبقاً مع التأكد من توفر موقف للسيارة في الفندق، أو استخدام مواقف مداخل مكة الرسمية (مثل موقف كدي أو الزاهر) واستقلال حافلات مكة الترددية للحرم.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">🚕 <strong>المواصلات:</strong> اعتمد على تطبيقات مثل Uber و Careem للتنقل داخل مكة والمدينة بأسعار واضحة ومعتمدة.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 8px;">🚄 <strong>قطار الحرمين السريع:</strong> وسيلة ممتازة ومريحة للتنقل بين مكة المكرمة والمدينة المنورة (يستغرق حوالي ساعتين و20 دقيقة). يُنصح بحجز التذاكر مبكراً عبر تطبيق أو موقع قطار الحرمين.</p>
                <hr style="border-color: var(--card-border); margin: 14px 0; opacity: 0.5;">
                <p style="margin-bottom: 0;">💧 <strong>ماء زمزم:</strong> يمكن شراء عبوات ماء زمزم المعبأ رسمياً من 📍 <a href="https://maps.app.goo.gl/yce1oqD2uAk5T7gn8" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit; font-weight: bold;">مشروع الملك عبدالله بن عبدالعزيز لسقيا زمزم</a> في مكة المكرمة (حي كدي).</p>
            </div>
        </details>`;
    },

    places: () => `
        <details class="custom-accordion" id="section-places">
            <summary>
                <span>🕌 الأماكن التاريخية والدينية للزيارة</span>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div style="margin-top: 8px;">
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 12px 0; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                            <span>🕋</span> <strong>مكة المكرمة:</strong>
                        </h3>
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                            <li><a href="https://maps.app.goo.gl/q8VcxANhQNgSPaJ36" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> غار ثور</li>
                            <li><a href="https://maps.app.goo.gl/TNMGNBzyxWRseN5y6" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> غار حراء (جبل النور)</li>
                            <li><a href="https://maps.app.goo.gl/suRzhpC1ZehUrzJP7" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> حي حراء الثقافي</li>
                            <li><a href="https://maps.app.goo.gl/HNgT1xdR7fmmoK5U8" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مسجد السيدة عائشة (ميقات التنعيم)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 style="margin: 0 0 12px 0; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                            <span>🕌</span> <strong>المدينة المنورة:</strong>
                        </h3>
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                            <li><a href="https://maps.app.goo.gl/f5cViWhDRbNprjN76" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> المعرض والمتحف الدولي للسيرة النبوية</li>
                            <li>
                                <a href="https://maps.app.goo.gl/hyXifHzKYRpVnqY78" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مسجد قباء
                                <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 6px; margin-right: 10px;">💡 بجانبه جادة قباء ومجموعة متنوعة من الأكشاك والمقاهي</div>
                                <div style="margin-top: 6px; margin-right: 10px; font-size: 0.92em;">
                                    🌴 <a href="https://maps.app.goo.gl/zCtxTyRjiR93MdJd7" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit; font-weight: bold;">محل تمور "بستان العجوة"</a> <span style="font-size: 0.9em; color: var(--text-muted);">(مميز وقريب من مسجد قباء)</span>
                                </div>
                            </li>
                            <li><a href="https://maps.app.goo.gl/ci7CuEkf32CNRvQW8" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مقبرة شهداء أحد وجبل الرماة</li>
                            <li><a href="https://maps.app.goo.gl/eMzkh1SU2zmkgfVo7" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مطل أحد</li>
                            <li><a href="https://maps.app.goo.gl/qSRrnmKypC3yPRE88" target="_blank" rel="noopener noreferrer" class="place-map-chip">📍 الخريطة</a> مسجد القبلتين</li>
                        </ul>
                    </div>
                </div>
            </div>
        </details>`,

    apps: () => `
        <details class="custom-accordion apps-section" id="section-apps">
            <summary>
                <span style="display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 22px; height: 22px; margin-left: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 0120.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>تطبيقات وروابط مهمة
                </span>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="app-item">
                    <div class="app-info">
                        <img loading="lazy" src="../assets/images/manafeth.png" alt="Manafeth" class="app-icon">
                        <div>
                            <div class="app-title">منافذ للتأمين</div>
                            <div class="app-desc">لإصدار وثائق التأمين الإلزامي للمركبات الأجنبية</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://play.google.com/store/apps/details?id=com.najm.manafeth" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="تطبيق منافذ على Google Play">${PLAY_STORE_SVG}</a>
                        <a href="https://apps.apple.com/qa/app/manafith-منافذ/id1630305902" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="تطبيق منافذ على App Store">${APP_STORE_SVG}</a>
                    </div>
                </div>

                <div class="app-item">
                    <div class="app-info">
                        <img loading="lazy" src="../assets/images/nusuk.png" alt="Nusuk" class="app-icon">
                        <div>
                            <div class="app-title">نسك (Nusuk)</div>
                            <div class="app-desc">لإصدار تصاريح العمرة وزيارة الروضة الشريفة</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://play.google.com/store/apps/details?id=com.moh.nusukapp" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="تطبيق نسك على Google Play">${PLAY_STORE_SVG}</a>
                        <a href="https://apps.apple.com/qa/app/nusuk-نسك/id6469515422" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="تطبيق نسك على App Store">${APP_STORE_SVG}</a>
                    </div>
                </div>

                <div class="app-item">
                    <div class="app-info">
                        <img loading="lazy" src="../assets/images/najm.png" alt="Najm" class="app-icon">
                        <div>
                            <div class="app-title">نجم للحوادث</div>
                            <div class="app-desc">للتبليغ عن الحوادث المرورية ومتابعة المطالبات</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://play.google.com/store/apps/details?id=com.najm.najm" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="تطبيق نجم على Google Play">${PLAY_STORE_SVG}</a>
                        <a href="https://apps.apple.com/qa/app/najm-نجم/id953140409" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="تطبيق نجم على App Store">${APP_STORE_SVG}</a>
                    </div>
                </div>

                <div class="app-item">
                    <div class="app-info">
                        <img loading="lazy" src="../assets/images/jahez.png" alt="Jahez" class="app-icon">
                        <div>
                            <div class="app-title">جاهز</div>
                            <div class="app-desc">لطلب وتوصيل الطعام في المدن والمحطات الكبرى</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://play.google.com/store/apps/details?id=net.jahez" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="تطبيق جاهز على Google Play">${PLAY_STORE_SVG}</a>
                        <a href="https://apps.apple.com/sa/app/jahez-جاهز/id1137352712" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="تطبيق جاهز على App Store">${APP_STORE_SVG}</a>
                    </div>
                </div>

                <div class="app-item">
                    <div class="app-info">
                        <img loading="lazy" src="../assets/images/hungerstation.png" alt="HungerStation" class="app-icon">
                        <div>
                            <div class="app-title">هنقرستيشن</div>
                            <div class="app-desc">لطلب وتوصيل الطعام والمقاضي</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://play.google.com/store/apps/details?id=com.hungerstation.android.web" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="تطبيق هنقرستيشن على Google Play">${PLAY_STORE_SVG}</a>
                        <a href="https://apps.apple.com/sa/app/hungerstation/id596011949" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="تطبيق هنقرستيشن على App Store">${APP_STORE_SVG}</a>
                    </div>
                </div>

                <div class="app-item">
                    <div class="app-info">
                        <img loading="lazy" src="../assets/images/absher.svg" alt="Absher" class="app-icon" style="background-color: white; padding: 6px; box-sizing: border-box; object-fit: contain;">
                        <div>
                            <div class="app-title">أبشر - للمخالفات المرورية</div>
                            <div class="app-desc">رابط الاستعلام المباشر عن المخالفات المرورية للزائرين</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://www.absher.sa/wps/portal/individuals/Home/myservices/einquiries/traffic/qtvfvisitor/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zizYx8nA09LIy8DQK9zA0CjUKDAgJ9XY0M_A30w8EKDDxNTDwMTYy83Q3MjAwcw4IsTFw9TQ3dzUz0o0DSOIAjTD8eCwjqj8KixNHAKcjIydjAwN3fCKsCFDOCE4v0C3JDIwyyTBQB1Lzbtw!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="الموقع الإلكتروني" aria-label="الاستعلام عن المخالفات عبر أبشر">${EXTERNAL_LINK_SVG}</a>
                    </div>
                </div>

                <div class="app-item">
                    <div class="app-info">
                        <div class="app-icon" style="background-color: white; display: flex; align-items: center; justify-content: center; font-size: 26px;">🚄</div>
                        <div>
                            <div class="app-title">قطار الحرمين السريع</div>
                            <div class="app-desc">لحجز تذاكر القطار السريع بين مكة والمدينة</div>
                        </div>
                    </div>
                    <div class="app-links">
                        <a href="https://play.google.com/store/apps/details?id=com.indra.haramain.pro" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="Google Play" aria-label="تطبيق قطار الحرمين على Google Play">${PLAY_STORE_SVG}</a>
                        <a href="https://apps.apple.com/es/app/hhr-train/id1533264335" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="App Store" aria-label="تطبيق قطار الحرمين على App Store">${APP_STORE_SVG}</a>
                        <a href="https://sar.hhr.sa" target="_blank" rel="noopener noreferrer" class="app-store-btn" title="الموقع الإلكتروني" aria-label="موقع قطار الحرمين">${EXTERNAL_LINK_SVG}</a>
                    </div>
                </div>
            </div>
        </details>`,

    emergency: (cfg) => {
        const cCode = (cfg && cfg.countryCode) || 'qa';
        const cName = (cfg && cfg.countryName) || 'قطر';
        const cFlag = (cfg && cfg.flagFile) || `${cCode}-flag.png`;
        const cEmergency = (cfg && cfg.emergencyNumber) || '999';

        const localEmergencyCard = cCode !== 'sa' ? `
                    <div class="emergency-box qatar">
                        <h2 style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <img loading="lazy" src="../assets/images/${cFlag}" alt="${cName}" class="flag-img">
                            في ${cName} (طوارئ عامة)
                        </h2>
                        <a href="tel:${cEmergency}" class="emergency-number" title="اتصال بطوارئ ${cName} ${cEmergency}">📞 ${cEmergency}</a>
                    </div>` : '';

        return `
        <div class="emergency-section" id="section-emergency" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--border-radius); margin-bottom: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; scroll-margin-top: 14px;">
            <div class="emergency-header-title">
                <span>📞 أرقام الطوارئ (اضغط على الرقم للاتصال المباشر)</span>
            </div>
            <div style="padding: 18px;">
                <div class="emergency-grid">${localEmergencyCard}
                    <div class="emergency-box saudi">
                        <h2 style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <img loading="lazy" src="../assets/images/sa-flag.png" alt="السعودية" class="flag-img">
                            في السعودية (أمن الطرق)
                        </h2>
                        <a href="tel:911" class="emergency-number" title="اتصال بأمن الطرق 911">📞 911</a>
                    </div>
                    <div class="emergency-box saudi">
                        <h2 style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <img loading="lazy" src="../assets/images/sa-flag.png" alt="السعودية" class="flag-img">
                            الهلال الأحمر (إسعاف)
                        </h2>
                        <a href="tel:997" class="emergency-number" title="اتصال بالإسعاف 997">📞 997</a>
                    </div>
                    <div class="emergency-box saudi">
                        <h2 style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <img loading="lazy" src="../assets/images/sa-flag.png" alt="السعودية" class="flag-img">
                            نجم للحوادث (السعودية)
                        </h2>
                        <a href="tel:920000560" class="emergency-number" style="font-size: 1.4rem;" title="اتصال بنجم للحوادث">📞 920000560</a>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">المنصة الوطنية لإدارة حوادث السير للمركبات المؤمنة</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    suggestions: (cfg) => {
        const cName = (cfg && cfg.countryName) || 'قطر';
        return `
        <details class="custom-accordion suggestions-wrapper" id="section-suggestions">
            <summary>
                <span>💡 اقتراحاتك واستفساراتك</span>
                ${CHEVRON_SVG}
            </summary>
            <div class="accordion-content">
                <div class="suggestions-header">
                    <p>يسعدنا سماع رأيك أو أي تعديل تقترحه لتطوير هذا الدليل</p>
                </div>

                <form id="suggestionForm" class="suggestion-form" action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="6481c10e-7bff-4bdc-bc38-20944e398cd6">
                    <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
                    <input type="hidden" name="from_page" value="دليل ${cName} - مكة المكرمة">
                    <input type="hidden" name="from_name" value="دليل ${cName} - مكة المكرمة 🕋">
                    <input type="hidden" name="subject" value="اقتراح/استفسار من دليل ${cName} - مكة المكرمة 🕋">

                    <div class="form-group">
                        <label for="suggest_name" class="form-label">الاسم الكريم <span style="color: #e74c3c;">*</span></label>
                        <input type="text" id="suggest_name" name="name" class="form-input" required placeholder="مثال: محمد">
                    </div>

                    <div class="form-group">
                        <label for="suggest_email" class="form-label">البريد الإلكتروني <span style="color: #e74c3c;">*</span></label>
                        <input type="email" id="suggest_email" name="email" class="form-input" required placeholder="name@example.com">
                    </div>

                    <div class="form-group-full">
                        <label for="suggest_message" class="form-label">اقتراحك أو رسالتك <span style="color: #e74c3c;">*</span></label>
                        <textarea id="suggest_message" name="message" class="form-textarea" required placeholder="اكتب اقتراحك أو تفاصيل التعديل الذي ترغب بإضافته هنا..."></textarea>
                    </div>

                    <div class="recaptcha-container" id="h-captcha-wrapper">
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
    },

    footer: () => `
        <footer>
            <p style="font-size: 1.1rem; font-weight: bold; color: #fff; margin-bottom: 5px;">عمرة مقبولة ورحلة آمنة بإذن الله 🕋</p>
            <p style="font-size: 0.98rem; color: var(--gold); font-weight: bold; margin-bottom: 12px;">تذكرونا بدعوة صالحة 🤲</p>
            <p style="opacity: 0.75; font-size: 0.85rem; margin-bottom: 0;">تم تصميم الدليل بواسطة معاذ بلال</p>
        </footer>`,

    'mobile-nav': () => `
    <nav class="mobile-bottom-nav" aria-label="التنقل السريع للجوال">
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
    </nav>`
};

// 5. حقن الأقسام والمحطات المشتركة تلقائياً في عناصر الـ DOM التي تحمل [data-shared-section] أو [data-shared-stations]
function renderSharedContent(countryConfig) {
    // أ. حقن شبكات المحطات المشتركة
    document.querySelectorAll('[data-shared-stations]').forEach(container => {
        const segmentKey = container.getAttribute('data-shared-stations');
        const startNumber = container.getAttribute('data-start-number') || '1';
        const gridClass = container.getAttribute('data-grid-class') || 'stations-grid';
        const html = renderStationSegmentHTML(segmentKey, startNumber, gridClass);
        if (html) {
            container.outerHTML = html;
        }
    });

    // ب. حقن الأقسام الكاملة المشتركة
    document.querySelectorAll('[data-shared-section]').forEach(placeholder => {
        const sectionKey = placeholder.getAttribute('data-shared-section');
        const renderer = SHARED_SECTION_RENDERERS[sectionKey];
        if (typeof renderer === 'function') {
            placeholder.outerHTML = renderer(countryConfig);
        }
    });
}

window.SHARED_ROUTE_SEGMENTS = SHARED_ROUTE_SEGMENTS;
window.renderSharedContent = renderSharedContent;

