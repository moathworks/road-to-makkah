/**
 * البيانات المشتركة لجميع أدلة السفر البري إلى مكة المكرمة
 * مصدر واحد للحقيقة (Single Source of Truth) للمحطات المشتركة، التطبيقات، قائمة الفحص، الأدعية، والأماكن.
 *
 * النصوص المعروضة تُكتب بصيغة { ar: '...', en: '...' }. القيم المحايدة لغوياً (روابط، أرقام) تُكتب مباشرة.
 */

module.exports = {
    siteUrl: 'https://moathworks.github.io/road-to-makkah',
    defaultFuelRate: 10,
    defaultFuelPrice: 2.18,
    web3formsAccessKey: '6481c10e-7bff-4bdc-bc38-20944e398cd6',

    // نهاية المسار: آخر مقطع من آخر محطة في riyadhToMakkah (السيل الكبير) إلى الحرم المكي
    destination: {
        name: { ar: 'مكة المكرمة (الحرم المكي)', en: 'Makkah (Al-Masjid Al-Haram)' },
        distanceFromPrevKm: 90,
        lat: 21.4225,
        lon: 39.8262
    },

    /**
     * المقاطع المشتركة لمحطات الطرق بين دول الخليج ومكة المكرمة.
     *
     * - distanceFromPrevKm: المسافة عن المحطة السابقة في المسار، وهي المصدر الوحيد للمسافات.
     *   المحطة التي تحمل هذا الحقل تدخل في سلسلة المسار، والتي لا تحمله (مثل استراحة طعام) لا تدخل.
     * - lat/lon: مطلوبة فقط لمحطات سلسلة المسار (تُبنى منها نقاط GPS)، ومأخوذة من رابط الخريطة نفسه.
     * - أول محطة في riyadhToMakkah تُقاس مسافتها من آخر محطة ذهاب في ملف الدولة (مدخل الرياض).
     */
    routeSegments: {
        // محطات داخل مدينة الرياض (طريق 40 / 80M السريع - المسار الرئيسي)
        riyadhMain: [
            {
                id: 'riyadh-sasco-main',
                title: { ar: 'محطة ساسكو (الرياض)', en: 'SASCO Station (Riyadh)' },
                desc: { ar: 'تضم سوبرماركت "نخلة" وخدمات متكاملة ونظيفة للراحة السريعة.', en: 'Has a "Nakhla" supermarket and clean, full services for a quick rest.' },
                mapUrl: 'https://maps.app.goo.gl/hX4K7Xxvz9VDeZTa9'
            },
            {
                id: 'riyadh-aldrees-main',
                title: { ar: 'محطة الدريس (الرياض)', en: 'Aldrees Station (Riyadh)' },
                desc: { ar: 'يتوفر بها تموينات شاملة وخدمات سيارات أساسية (إطارات وهواء).', en: 'A well-stocked convenience store and basic car services (tyres and air).' },
                mapUrl: 'https://maps.app.goo.gl/rresvUcxnb8n59TB7'
            }
        ],

        // محطات المسار الالتفافي حول الرياض (طريق الملك سلمان)
        riyadhBypassSalman: [
            {
                id: 'riyadh-sasco-pre-airport',
                title: { ar: 'ساسكو (قبل المطار)', en: 'SASCO (before the airport)' },
                desc: { ar: 'محطة كبرى ونموذجية قريبة من مطار الملك خالد تحتوي على كافة الخدمات.', en: 'A large model station near King Khalid Airport with all services.' },
                mapUrl: 'https://maps.app.goo.gl/qkcbBxYQv7Yocg3MA'
            },
            {
                id: 'riyadh-sasco-post-airport',
                title: { ar: 'ساسكو (بعد المطار)', en: 'SASCO (after the airport)' },
                desc: { ar: 'محطة خدمات متكاملة على امتداد المسار الالتفافي.', en: 'A full-service station along the bypass route.' },
                mapUrl: 'https://maps.app.goo.gl/8HdbnqV5uGX6ewyW6'
            }
        ],

        // محطات طريق الذهاب المشترك (الرياض ← الطائف ← السيل الكبير ← مكة)
        riyadhToMakkah: [
            {
                id: 'tuwaiq-aldrees',
                badge: { ar: 'مخرج غرب الرياض (طويق)', en: 'West Riyadh exit (Tuwaiq)' },
                title: { ar: 'محطة الدريس - طويق', en: 'Aldrees Station – Tuwaiq' },
                gpsName: { ar: 'مخرج الرياض (طويق)', en: 'Riyadh exit (Tuwaiq)' },
                desc: { ar: 'موقع مناسب للتأكد من خزان الوقود قبل الخروج الفعلي من حدود الرياض.', en: 'A good place to top up the tank before actually leaving Riyadh.' },
                mapUrl: 'https://maps.app.goo.gl/FjZRJmY1mFFgT5Az9',
                distanceFromPrevKm: 46,
                lat: 24.5717,
                lon: 46.5244
            },
            {
                id: 'qiddiya-petromin',
                badge: { ar: 'تبعد ~7 كم عن الدريس طويق', en: '~7 km from Aldrees Tuwaiq' },
                title: { ar: 'محطة بترومين - القدية', en: 'Petromin Station – Qiddiya' },
                desc: { ar: 'محطة كبرى بعد الخروج من الرياض، تضم مطعم البيك الشهير.', en: 'A large station just outside Riyadh, with the popular Al Baik restaurant.' },
                mapUrl: 'https://maps.app.goo.gl/yVAcfAs2ZfEX9dKx5',
                distanceFromPrevKm: 7,
                lat: 24.5440,
                lon: 46.4673
            },
            {
                id: 'tebrak-sasco',
                badge: { ar: 'تبعد ~66 كم عن المحطة السابقة', en: '~66 km from the previous station' },
                title: { ar: 'محطة ساسكو - تبرك', en: 'SASCO Station – Tebrak' },
                desc: { ar: 'من المحطات النموذجية والموثوقة بعد مغادرة منطقة الرياض.', en: 'A reliable model station after leaving the Riyadh area.' },
                mapUrl: 'https://maps.app.goo.gl/4A5Lp96UrZ3onjQj6',
                distanceFromPrevKm: 66,
                lat: 24.3780,
                lon: 45.8947
            },
            {
                id: 'quwayiyah-sasco',
                badge: { ar: 'تبعد ~60 كم عن المحطة السابقة', en: '~60 km from the previous station' },
                title: { ar: 'محطة ساسكو - القويعية', en: 'SASCO Station – Al Quwayiyah' },
                desc: { ar: 'نقطة توقف استراتيجية ورئيسية للراحة وتمديد العضلات.', en: 'A key stop to rest and stretch.' },
                mapUrl: 'https://maps.app.goo.gl/oq6EuAoKghBGKjRYA',
                distanceFromPrevKm: 60,
                lat: 24.1330,
                lon: 45.3945
            },
            {
                id: 'khasrah-sasco',
                badge: { ar: 'تبعد ~170 كم عن المحطة السابقة', en: '~170 km from the previous station' },
                title: { ar: 'محطة ساسكو - الخاصرة', en: 'SASCO Station – Al Khasirah' },
                desc: { ar: 'محطة كبرى على طريق الرياض - مكة المكرمة توفر جميع الخدمات والمطاعم.', en: 'A large station on the Riyadh–Makkah road with all services and restaurants.' },
                mapUrl: 'https://maps.app.goo.gl/ynR4FzfqCVQnBnLw6',
                distanceFromPrevKm: 170,
                lat: 23.4174,
                lon: 44.0285
            },
            {
                id: 'humiyat-sasco',
                badge: { ar: 'تبعد ~144 كم عن المحطة السابقة', en: '~144 km from the previous station' },
                title: { ar: 'محطة ساسكو - الحوميات', en: 'SASCO Station – Al Humiyat' },
                desc: { ar: 'محطة كبرى على طريق الرياض - مكة المكرمة توفر جميع الخدمات والمطاعم.', en: 'A large station on the Riyadh–Makkah road with all services and restaurants.' },
                mapUrl: 'https://maps.app.goo.gl/Lj4sBrVA4Ug9oqz8A',
                distanceFromPrevKm: 144,
                lat: 22.9883,
                lon: 42.7753
            },
            {
                id: 'dhalm-sasco',
                badge: { ar: 'تبعد ~72 كم عن المحطة السابقة', en: '~72 km from the previous station' },
                title: { ar: 'محطة ساسكو - ظلم', en: 'SASCO Station – Dhalm' },
                desc: { ar: 'محطة كبرى قبل التوجه إلى منطقة الطائف وميقات قرن المنازل.', en: 'A large station before heading to the Taif area and the miqat of Qarn al-Manazil.' },
                mapUrl: 'https://maps.app.goo.gl/Z5aUUuPz5jJNYoL1A',
                distanceFromPrevKm: 72,
                lat: 22.7062,
                lon: 42.1446
            },
            {
                id: 'albaik-pre-sail',
                unnumbered: true,
                variant: 'food',
                badge: { ar: 'استراحة طعام', en: 'Food stop' },
                title: { ar: '🍔 مطعم البيك (قبل السيل)', en: '🍔 Al Baik Restaurant (before As-Sayl)' },
                desc: { ar: 'يقع قبل ميقات السيل الكبير مباشرة.', en: 'Located right before the As-Sayl Al-Kabir miqat.' },
                mapUrl: 'https://maps.app.goo.gl/fXBgtMqVtdHjzGt5A',
                btnLabel: { ar: '🍗 موقع المطعم', en: '🍗 Restaurant location' }
            },
            {
                id: 'sail-kabeer-sasco',
                variant: 'miqat',
                badge: { ar: 'تبعد ~245 كم عن محطة ظلم', en: '~245 km from Dhalm station' },
                title: { ar: 'محطة ساسكو (السيل الكبير)', en: 'SASCO Station (As-Sayl Al-Kabir)' },
                desc: { ar: 'بالقرب من الطائف والميقات، نقطة الاستعداد والاغتسال للإحرام (قرن المنازل).', en: 'Near Taif and the miqat: the place to prepare and bathe for ihram (Qarn al-Manazil).' },
                mapUrl: 'https://maps.app.goo.gl/Vds8UPCtvsFRXoG26',
                distanceFromPrevKm: 245,
                lat: 21.6232,
                lon: 40.4331
            }
        ],

        // محطات طريق العودة المشترك (المدينة المنورة ← القصيم ← سدير ← الرياض)
        madinahToRiyadhReturn: [
            {
                id: 'return-golden-service',
                badge: { ar: 'تبعد ~235 كم عن المدينة المنورة', en: '~235 km from Madinah' },
                title: { ar: 'محطة الخدمة الذهبية', en: 'Golden Service Station' },
                desc: { ar: 'من المحطات الكبرى والرئيسية على طريق المدينة - القصيم.', en: 'One of the main large stations on the Madinah–Qassim road.' },
                mapUrl: 'https://maps.app.goo.gl/SxWiMb8wV5Ny63i78'
            },
            {
                id: 'return-aldrees-bukayriyah',
                badge: { ar: 'تبعد ~230 كم عن المحطة السابقة', en: '~230 km from the previous station' },
                title: { ar: 'محطة الدريس - البكيرية', en: 'Aldrees Station – Al Bukayriyah' },
                desc: { ar: 'من المحطات الكبرى والرئيسية في منطقة القصيم.', en: 'One of the main large stations in the Qassim region.' },
                mapUrl: 'https://maps.app.goo.gl/Kpvjq8gj46RtKsWJ7'
            },
            {
                id: 'return-loder-sudair',
                badge: { ar: 'تبعد ~225 كم عن المحطة السابقة', en: '~225 km from the previous station' },
                title: { ar: 'محطة لودر - سدير', en: 'Loder Station – Sudair' },
                desc: { ar: 'محطة حديثة تتوفر بها خدمات متكاملة ومطعم البيك.', en: 'A modern station with full services and an Al Baik restaurant.' },
                mapUrl: 'https://maps.app.goo.gl/zzCxVacA7Yq8ky74A'
            },
            {
                id: 'return-sasco-jazeera',
                badge: { ar: 'تبعد ~200 كم عن المحطة السابقة', en: '~200 km from the previous station' },
                title: { ar: 'محطة ساسكو الجزيرة', en: 'SASCO Al Jazeera Station' },
                desc: { ar: 'مدخل الرياض الشمالي وتتوفر بها كافة الخدمات ومطعم البيك.', en: "Riyadh's northern entrance, with all services and an Al Baik restaurant." },
                mapUrl: 'https://maps.app.goo.gl/Bmmvk5oWBikPijqQ8'
            }
        ]
    },

    /**
     * أدعية وأذكار السفر.
     * - arabic: نص الدعاء (يُعرض بالعربية في الصفحتين لأنه يُقرأ بلفظه).
     * - translation: معناه بالإنجليزية (يُعرض في الصفحة الإنجليزية فقط).
     * - note: نص عادي مترجم (لما ليس دعاءً بلفظ محدد).
     */
    prayers: [
        {
            label: { ar: 'دعاء السفر:', en: 'Travel supplication:' },
            arabic: '"الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون. اللهم إنا نسألك في سفرنا هذا البر والتقوى ومن العمل ما ترضى، اللهم هوّن علينا سفرنا هذا، واطوِ عنا بعده، اللهم أنت الصاحب في السفر، والخليفة في الأهل، اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل" وإذا رجع قالهنّ وزاد فيهنّ: آيبون، تائبون، عابدون، لربنا حامدون.',
            translation: '"Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. Glory be to Him Who has subjected this to us, for we could never have done it ourselves, and to our Lord we shall surely return. O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You. O Allah, make this journey easy for us and shorten its distance for us. O Allah, You are the Companion on the journey and the Guardian of the family. O Allah, I seek refuge in You from the hardships of travel, from distressing sights, and from an evil return in wealth and family." On the way back one says the same and adds: "We return, repenting, worshipping and praising our Lord."'
        },
        {
            label: { ar: 'عند نزول منزل أو استراحة:', en: 'When stopping at a place or rest area:' },
            arabic: '"أعوذ بكلمات الله التامات من شر ما خلق"',
            translation: '"I seek refuge in the perfect words of Allah from the evil of what He has created."'
        },
        {
            label: { ar: 'أثناء القيادة بالطريق:', en: 'While driving:' },
            note: {
                ar: 'التكبير (الله أكبر) عند صعود المرتفعات والتسبيح (سبحان الله) عند النزول.',
                en: 'Say takbir (Allahu Akbar) when going uphill and tasbih (Subhan Allah) when going downhill.'
            }
        }
    ],

    // قائمة الفحص الذكية (مع معرّف ثابت id لكل بند لمنع اختلاط الحالة عند إضافة أو ترتيب البنود)
    checklistGroups: [
        {
            title: { ar: '📄 الوثائق والاتصالات', en: '📄 Documents and connectivity' },
            items: [
                { id: 'doc-passport', label: { ar: 'جوازات السفر صالحة (6 أشهر على الأقل)', en: 'Passports valid (at least 6 months)' } },
                { id: 'doc-national-id', labelKey: 'nationalIdLabel' },
                { id: 'doc-saudi-visa', label: { ar: 'تأشيرة السعودية', en: 'Saudi visa' } },
                { id: 'doc-car-reg', label: { ar: 'استمارة السيارة ورخصة القيادة', en: 'Vehicle registration and driving licence' } },
                { id: 'doc-car-insurance', label: { ar: 'تأمين السيارة (للسعودية)', en: 'Car insurance (for Saudi Arabia)' } },
                { id: 'doc-roaming-sim', label: { ar: 'تفعيل باقة تجوال أو شريحة سعودية', en: 'Activate a roaming package or get a Saudi SIM' } },
                { id: 'doc-nusuk-tawakkalna', label: { ar: 'تثبيت وتحديث تطبيقي (نسك) و(توكلنا)', en: 'Install and update the Nusuk and Tawakkalna apps' } },
                { id: 'doc-offline-maps', label: { ar: 'تحميل خرائط Google Maps بدون إنترنت', en: 'Download Google Maps for offline use' } },
                { id: 'doc-umrah-guide', label: { ar: 'دليل العمرة', en: 'Umrah guide' } }
            ]
        },
        {
            title: { ar: '🚗 السيارة والتجهيزات', en: '🚗 Car and equipment' },
            items: [
                { id: 'car-tires-pressure', label: { ar: 'فحص ضغط الإطارات والإطار الاحتياطي', en: 'Check tyre pressure and the spare tyre' } },
                { id: 'car-tire-tools', label: { ar: 'عدة تبديل الإطارات', en: 'Tyre-changing kit' } },
                { id: 'car-air-compressor', label: { ar: 'منفاخ إطارات كهربائي', en: 'Electric tyre inflator' } },
                { id: 'car-engine-brake-oil', label: { ar: 'فحص زيوت المحرك والفرامل', en: 'Check engine oil and brake fluid' } },
                { id: 'car-coolant-wipers', label: { ar: 'فحص مياه الراديتر والمساحات', en: 'Check radiator coolant and wipers' } },
                { id: 'car-ac-check', label: { ar: 'فحص تكييف السيارة', en: 'Check the car air conditioning' } },
                { id: 'car-wrench-kit', label: { ar: 'عدة تصليح (مفاتيح مقاسات متعددة)', en: 'Tool kit (multi-size spanners)' } },
                { id: 'car-jump-starter', label: { ar: 'بطارية شحن لتشغيل بطارية السيارة أو كابلات التوصيل', en: 'Jump starter or jumper cables' } },
                { id: 'car-spare-key', label: { ar: 'مفتاح احتياطي للسيارة (مع مرافق)', en: 'Spare car key (kept with a companion)' } },
                { id: 'car-flashlight', label: { ar: 'مصباح يدوي (كشاف طوارئ)', en: 'Torch (emergency flashlight)' } },
                { id: 'car-extinguisher-triangle', label: { ar: 'طفاية حريق ومثلث السلامة', en: 'Fire extinguisher and warning triangle' } },
                { id: 'car-first-aid', label: { ar: 'حقيبة الإسعافات الأولية', en: 'First-aid kit' } },
                { id: 'car-phone-charger', label: { ar: 'شاحن السيارة للجوال', en: 'Car phone charger' } },
                { id: 'car-power-bank', label: { ar: 'بطارية شحن إضافية للجوال (باور بانك)', en: 'Power bank' } },
                { id: 'car-saudi-cash', label: { ar: 'مبلغ نقدي سعودي (كاش)', en: 'Saudi cash' } },
                { id: 'car-ihram-bag', label: { ar: 'تجهيز حقيبة الإحرام بشكل مستقل', en: 'Pack the ihram bag separately' } }
            ]
        },
        {
            title: { ar: '💊 الصحة والراحة الشخصية', en: '💊 Health and personal comfort' },
            items: [
                { id: 'health-painkillers', label: { ar: 'أدوية شخصية (مسكنات، خافض حرارة..)', en: 'Personal medication (painkillers, fever reducers…)' } },
                { id: 'health-kids-meds', label: { ar: 'أدوية الأطفال', en: "Children's medication" } },
                { id: 'health-chafing-cream', label: { ar: 'مرهم طبي للتسلخات الجسدية (مهم أثناء الإحرام)', en: 'Anti-chafing ointment (important during ihram)' } },
                { id: 'health-eye-drops', label: { ar: 'قطرة ترطيب العين', en: 'Lubricating eye drops' } },
                { id: 'health-sunglasses', label: { ar: 'نظارات شمسية', en: 'Sunglasses' } },
                { id: 'health-white-umbrella', label: { ar: 'مظلة شمسية بيضاء للطواف والمشي بالنهار', en: 'White sun umbrella for tawaf and daytime walking' } },
                { id: 'health-water-snacks', label: { ar: 'مياه صالحة للشرب ووجبات خفيفة كافية للطريق', en: 'Enough drinking water and snacks for the road' } },
                { id: 'health-shaving-kit', label: { ar: 'أدوات حلاقة (ماكينة، مقص، شفرة)', en: 'Shaving tools (trimmer, scissors, razor)' } },
                { id: 'health-nail-clipper', label: { ar: 'مقص أظافر', en: 'Nail clippers' } },
                { id: 'health-unscented-wipes', label: { ar: 'مناديل مبللة (غير معطرة للإحرام)', en: 'Wet wipes (unscented, for ihram)' } },
                { id: 'health-pocket-tissues', label: { ar: 'محارم جيب', en: 'Pocket tissues' } }
            ]
        }
    ],

    /**
     * معلومات تهم المعتمر والزائر.
     * group: 'road' تُعرض في مرحلة «في الطريق» (نصائح الطريق والسلامة)،
     *        'city' تُعرض في مرحلة «في مكة والمدينة» (الإقامة والتنقل).
     * textKey: يؤخذ النص من ملف الدولة (مثل تحذير الجمال الخاص بكل مسار).
     * link: رابط داخل النص، يُعرض بين text و after.
     */
    pilgrimTips: [
        {
            icon: '😴',
            group: 'road',
            title: { ar: 'الإرهاق والنعاس:', en: 'Fatigue and drowsiness:' },
            text: { ar: 'لا تكابر أبداً بالقيادة عند شعورك بالنعاس. توقف فوراً عند أقرب محطة خدمة وخذ غفوة لمدة 20 دقيقة.', en: 'Never push on when you feel sleepy. Stop at the nearest service station right away and take a 20-minute nap.' }
        },
        {
            icon: '☕',
            group: 'road',
            title: { ar: 'التوقف للاستراحة:', en: 'Rest stops:' },
            text: { ar: 'يُفضل التوقف كل 250-300 كم (كل ساعتين إلى 3 ساعات) لتمديد العضلات وتجديد النشاط. تجنب القيادة المتواصلة لأكثر من 3 ساعات، وتبادل القيادة إن أمكن.', en: 'Stop every 250–300 km (every 2 to 3 hours) to stretch and refresh. Avoid driving for more than 3 hours straight, and share the driving if you can.' }
        },
        {
            icon: '📸',
            group: 'road',
            title: { ar: 'كاميرات ساهر:', en: 'Saher speed cameras:' },
            text: { ar: 'السرعة محددة بـ 140 كم/ساعة في معظم الطرق السريعة للسيارات الصغيرة. التزم بحزام الأمان وتفادى استخدام الجوال أثناء القيادة.', en: 'The speed limit is 140 km/h on most expressways for small cars. Wear your seat belt and avoid using your phone while driving.' }
        },
        {
            icon: '🐪',
            group: 'road',
            title: { ar: 'الجمال السائبة:', en: 'Stray camels:' },
            textKey: 'camelWarningText'
        },
        {
            icon: '📱',
            group: 'road',
            title: { ar: 'شرائح الاتصالات:', en: 'SIM cards:' },
            text: { ar: 'تتوفر شركات (STC, Mobily, Zain). يُنصح بتفعيل باقة تجوال أو اقتناء شريحة إنترنت أو شريحة إلكترونية (eSIM) لتسهيل استخدام الخرائط وتطبيقات التوصيل.', en: 'Operators include STC, Mobily and Zain. Activate a roaming package or get a data SIM or an eSIM to make maps and delivery apps easier to use.' }
        },
        {
            icon: '🏨',
            group: 'city',
            title: { ar: 'الفنادق والمواقف:', en: 'Hotels and parking:' },
            text: { ar: 'تأكد من حجز الفنادق مسبقاً مع التأكد من توفر موقف للسيارة في الفندق، أو استخدام مواقف مداخل مكة الرسمية (مثل موقف كدي أو الزاهر) واستقلال حافلات مكة الترددية للحرم.', en: 'Book hotels in advance and make sure parking is available, or use the official car parks at the entrances to Makkah (such as Kudai or Az-Zahir) and take the Makkah shuttle buses to the Haram.' }
        },
        {
            icon: '🚕',
            group: 'city',
            title: { ar: 'المواصلات:', en: 'Getting around:' },
            text: { ar: 'اعتمد على تطبيقات مثل Uber و Careem للتنقل داخل مكة والمدينة بأسعار واضحة ومعتمدة.', en: 'Use apps such as Uber and Careem to get around Makkah and Madinah at clear, regulated prices.' }
        },
        {
            icon: '🚄',
            group: 'city',
            title: { ar: 'قطار الحرمين السريع:', en: 'Haramain High-Speed Railway:' },
            text: { ar: 'وسيلة ممتازة ومريحة للتنقل بين مكة المكرمة والمدينة المنورة (يستغرق حوالي ساعتين و20 دقيقة). يُنصح بحجز التذاكر مبكراً عبر تطبيق أو موقع قطار الحرمين.', en: 'An excellent, comfortable way to travel between Makkah and Madinah (about 2 hours 20 minutes). Book tickets early through the Haramain railway app or website.' }
        },
        {
            icon: '💧',
            group: 'city',
            title: { ar: 'ماء زمزم:', en: 'Zamzam water:' },
            text: { ar: 'يمكن شراء عبوات ماء زمزم المعبأ رسمياً من 📍 ', en: 'Officially bottled Zamzam water can be bought from 📍 ' },
            link: {
                url: 'https://maps.app.goo.gl/yce1oqD2uAk5T7gn8',
                label: { ar: 'مشروع الملك عبدالله بن عبدالعزيز لسقيا زمزم', en: 'the King Abdullah bin Abdulaziz Zamzam Water Project' }
            },
            after: { ar: ' في مكة المكرمة (حي كدي).', en: ' in Makkah (Kudai district).' }
        }
    ],

    // الأماكن التاريخية والدينية للزيارة: اسم المكان نفسه هو الرابط إلى الخريطة
    places: [
        {
            icon: '🕋',
            city: { ar: 'مكة المكرمة:', en: 'Makkah:' },
            items: [
                { name: { ar: 'غار ثور', en: 'Cave of Thawr' }, mapUrl: 'https://maps.app.goo.gl/q8VcxANhQNgSPaJ36' },
                { name: { ar: 'غار حراء (جبل النور)', en: 'Cave of Hira (Jabal al-Nour)' }, mapUrl: 'https://maps.app.goo.gl/TNMGNBzyxWRseN5y6' },
                { name: { ar: 'حي حراء الثقافي', en: 'Hira Cultural District' }, mapUrl: 'https://maps.app.goo.gl/suRzhpC1ZehUrzJP7' },
                { name: { ar: 'مسجد السيدة عائشة (ميقات التنعيم)', en: "Aisha Mosque (At-Tan'im miqat)" }, mapUrl: 'https://maps.app.goo.gl/HNgT1xdR7fmmoK5U8' }
            ]
        },
        {
            icon: '🕌',
            city: { ar: 'المدينة المنورة:', en: 'Madinah:' },
            items: [
                { name: { ar: 'المعرض والمتحف الدولي للسيرة النبوية', en: "International Fair and Museum of the Prophet's Biography" }, mapUrl: 'https://maps.app.goo.gl/f5cViWhDRbNprjN76' },
                {
                    name: { ar: 'مسجد قباء', en: 'Quba Mosque' },
                    mapUrl: 'https://maps.app.goo.gl/hyXifHzKYRpVnqY78',
                    note: { ar: '💡 بجانبه جادة قباء ومجموعة متنوعة من الأكشاك والمقاهي', en: '💡 Next to it is Quba Avenue, with a variety of kiosks and cafés' },
                    extra: {
                        icon: '🌴',
                        label: { ar: 'محل تمور "بستان العجوة"', en: '"Bustan Al-Ajwa" date shop' },
                        url: 'https://maps.app.goo.gl/zCtxTyRjiR93MdJd7',
                        note: { ar: '(مميز وقريب من مسجد قباء)', en: '(excellent and close to Quba Mosque)' }
                    }
                },
                { name: { ar: 'مقبرة شهداء أحد وجبل الرماة', en: "Uhud Martyrs' Cemetery and Archers' Hill" }, mapUrl: 'https://maps.app.goo.gl/ci7CuEkf32CNRvQW8' },
                { name: { ar: 'مطل أحد', en: 'Uhud Viewpoint' }, mapUrl: 'https://maps.app.goo.gl/eMzkh1SU2zmkgfVo7' },
                { name: { ar: 'مسجد القبلتين', en: 'Masjid al-Qiblatayn' }, mapUrl: 'https://maps.app.goo.gl/qSRrnmKypC3yPRE88' }
            ]
        }
    ],

    // التطبيقات المشتركة لجميع الدول
    sharedApps: [
        {
            id: 'manafeth',
            title: { ar: 'منافذ للتأمين', en: 'Manafeth Insurance' },
            desc: { ar: 'لإصدار وثائق التأمين الإلزامي للمركبات الأجنبية', en: 'To issue mandatory insurance for foreign vehicles' },
            iconSrc: 'assets/images/manafeth.webp',
            iconAlt: 'Manafeth',
            playUrl: 'https://play.google.com/store/apps/details?id=com.najm.manafeth',
            appleUrl: 'https://apps.apple.com/qa/app/manafith-منافذ/id1630305902',
            ariaName: { ar: 'تطبيق منافذ', en: 'Manafeth app' },
            showOnHome: true
        },
        {
            id: 'nusuk',
            title: { ar: 'نسك (Nusuk)', en: 'Nusuk' },
            desc: { ar: 'لإصدار تصاريح العمرة وزيارة الروضة الشريفة', en: 'To issue Umrah permits and book visits to Ar-Rawdah Ash-Sharifah' },
            iconSrc: 'assets/images/nusuk.webp',
            iconAlt: 'Nusuk',
            playUrl: 'https://play.google.com/store/apps/details?id=com.moh.nusukapp',
            appleUrl: 'https://apps.apple.com/qa/app/nusuk-نسك/id6469515422',
            ariaName: { ar: 'تطبيق نسك', en: 'Nusuk app' },
            showOnHome: true
        },
        {
            id: 'najm',
            title: { ar: 'نجم للحوادث', en: 'Najm (accidents)' },
            desc: { ar: 'للتبليغ عن الحوادث المرورية ومتابعة المطالبات', en: 'To report traffic accidents and follow up claims' },
            iconSrc: 'assets/images/najm.webp',
            iconAlt: 'Najm',
            playUrl: 'https://play.google.com/store/apps/details?id=com.najm.najm',
            appleUrl: 'https://apps.apple.com/qa/app/najm-نجم/id953140409',
            ariaName: { ar: 'تطبيق نجم', en: 'Najm app' }
        },
        {
            id: 'jahez',
            title: { ar: 'جاهز', en: 'Jahez' },
            desc: { ar: 'لطلب وتوصيل الطعام في المدن والمحطات الكبرى', en: 'Food ordering and delivery in cities and major stations' },
            iconSrc: 'assets/images/jahez.webp',
            iconAlt: 'Jahez',
            playUrl: 'https://play.google.com/store/apps/details?id=net.jahez',
            appleUrl: 'https://apps.apple.com/sa/app/jahez-%D8%AC%D8%A7%D9%87%D8%B2/id1137352156',
            ariaName: { ar: 'تطبيق جاهز', en: 'Jahez app' }
        },
        {
            id: 'hungerstation',
            title: { ar: 'هنقرستيشن', en: 'HungerStation' },
            desc: { ar: 'لطلب وتوصيل الطعام والمقاضي', en: 'Food and grocery ordering and delivery' },
            iconSrc: 'assets/images/hungerstation.webp',
            iconAlt: 'HungerStation',
            playUrl: 'https://play.google.com/store/apps/details?id=com.hungerstation.android.web',
            appleUrl: 'https://apps.apple.com/sa/app/hungerstation/id596011949',
            ariaName: { ar: 'تطبيق هنقرستيشن', en: 'HungerStation app' }
        },
        {
            id: 'absher',
            title: { ar: 'أبشر - للمخالفات المرورية', en: 'Absher – traffic violations' },
            desc: { ar: 'رابط الاستعلام المباشر عن المخالفات المرورية للزائرين', en: 'Direct link to check traffic violations for visitors' },
            iconSrc: 'assets/images/absher.svg',
            iconAlt: 'Absher',
            iconContain: true,
            webUrl: 'https://www.absher.sa/wps/portal/individuals/Home/myservices/einquiries/traffic/qtvfvisitor/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zizYx8nA09LIy8DQK9zA0CjUKDAgJ9XY0M_A30w8EKDDxNTDwMTYy83Q3MjAwcw4IsTFw9TQ3dzUz0o0DSOIAjTD8eCwjqj8KixNHAKcjIydjAwN3fCKsCFDOCE4v0C3JDIwyyTBQB1Lzbtw!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/',
            webAriaLabel: { ar: 'الاستعلام عن المخالفات عبر أبشر', en: 'Check traffic violations on Absher' }
        },
        {
            id: 'haramain',
            title: { ar: 'قطار الحرمين السريع', en: 'Haramain High-Speed Railway' },
            desc: { ar: 'لحجز تذاكر القطار السريع بين مكة والمدينة', en: 'To book high-speed train tickets between Makkah and Madinah' },
            iconEmoji: '🚄',
            playUrl: 'https://play.google.com/store/apps/details?id=com.indra.haramain.pro',
            appleUrl: 'https://apps.apple.com/sa/app/hhr-train/id1533264335',
            webUrl: 'https://sar.hhr.sa',
            ariaName: { ar: 'تطبيق قطار الحرمين', en: 'Haramain railway app' },
            webAriaLabel: { ar: 'موقع قطار الحرمين', en: 'Haramain railway website' }
        }
    ]
};
