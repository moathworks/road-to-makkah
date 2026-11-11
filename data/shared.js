/**
 * البيانات المشتركة لجميع أدلة السفر البري إلى مكة المكرمة
 * مصدر واحد للحقيقة (Single Source of Truth) للمحطات المشتركة، التطبيقات، قائمة الفحص، الأماكن، والطوارئ.
 */

module.exports = {
    lastUpdatedText: '10 نوفمبر 2026',
    siteUrl: 'https://road-to-makkah.test',
    defaultFuelRate: 10,
    defaultFuelPrice: 2.18,
    web3formsAccessKey: '6481c10e-7bff-4bdc-bc38-20944e398cd6',

    // المقاطع المشتركة لمحطات الطرق بين دول الخليج ومكة المكرمة
    routeSegments: {
        // محطات داخل مدينة الرياض (طريق 40 / 80M السريع - المسار الرئيسي)
        riyadhMain80: [
            {
                id: 'riyadh-sasco-main',
                title: 'محطة ساسكو (الرياض)',
                desc: 'تضم سوبرماركت "نخلة" وخدمات متكاملة ونظيفة للراحة السريعة.',
                mapUrl: 'https://maps.app.goo.gl/hX4K7Xxvz9VDeZTa9',
                lat: 24.7136,
                lon: 46.6753
            },
            {
                id: 'riyadh-aldrees-main',
                title: 'محطة الدريس (الرياض)',
                desc: 'يتوفر بها تموينات شاملة وخدمات سيارات أساسية (إطارات وهواء).',
                mapUrl: 'https://maps.app.goo.gl/rresvUcxnb8n59TB7',
                lat: 24.6500,
                lon: 46.5500
            }
        ],

        // محطات المسار الالتفافي حول الرياض (طريق الملك سلمان)
        riyadhBypassSalman: [
            {
                id: 'riyadh-sasco-pre-airport',
                title: 'ساسكو (قبل المطار)',
                desc: 'محطة كبرى ونموذجية قريبة من مطار الملك خالد تحتوي على كافة الخدمات.',
                mapUrl: 'https://maps.app.goo.gl/qkcbBxYQv7Yocg3MA',
                lat: 24.9500,
                lon: 46.7800
            },
            {
                id: 'riyadh-sasco-post-airport',
                title: 'ساسكو (بعد المطار)',
                desc: 'محطة خدمات متكاملة على امتداد المسار الالتفافي.',
                mapUrl: 'https://maps.app.goo.gl/8HdbnqV5uGX6ewyW6',
                lat: 24.9200,
                lon: 46.5200
            }
        ],

        // محطات طريق الذهاب المشترك (الرياض ← الطائف ← السيل الكبير ← مكة)
        riyadhToMakkah: [
            {
                id: 'tuwaiq-aldrees',
                badge: 'مخرج غرب الرياض (طويق)',
                title: 'محطة الدريس - طويق',
                desc: 'موقع مناسب للتأكد من خزان الوقود قبل الخروج الفعلي من حدود الرياض.',
                mapUrl: 'https://maps.app.goo.gl/FjZRJmY1mFFgT5Az9',
                distanceFromPrevKm: 50,
                remainingToMakkahKm: 900,
                lat: 24.5800,
                lon: 46.3500
            },
            {
                id: 'qiddiya-petromin',
                badge: 'تبعد ~7 كم عن الدريس طويق',
                title: 'محطة بترومين - القدية',
                desc: 'محطة كبرى بعد الخروج من الرياض، تضم مطعم البيك الشهير.',
                mapUrl: 'https://maps.app.goo.gl/yVAcfAs2ZfEX9dKx5',
                distanceFromPrevKm: 7,
                remainingToMakkahKm: 893,
                lat: 24.5600,
                lon: 46.2800
            },
            {
                id: 'tebrak-sasco',
                badge: 'تبعد ~66 كم عن المحطة السابقة',
                title: 'محطة ساسكو - تبرك',
                desc: 'من المحطات النموذجية والموثوقة بعد مغادرة منطقة الرياض.',
                mapUrl: 'https://maps.app.goo.gl/4A5Lp96UrZ3onjQj6',
                distanceFromPrevKm: 66,
                remainingToMakkahKm: 830,
                lat: 24.3300,
                lon: 45.7500
            },
            {
                id: 'quwayiyah-sasco',
                badge: 'تبعد ~60 كم عن المحطة السابقة',
                title: 'محطة ساسكو - القويعية',
                desc: 'نقطة توقف استراتيجية ورئيسية للراحة وتمديد العضلات.',
                mapUrl: 'https://maps.app.goo.gl/oq6EuAoKghBGKjRYA',
                distanceFromPrevKm: 60,
                remainingToMakkahKm: 770,
                lat: 24.0489,
                lon: 45.2494
            },
            {
                id: 'khasrah-sasco',
                badge: 'تبعد ~170 كم عن المحطة السابقة',
                title: 'محطة ساسكو - الخاصرة',
                desc: 'محطة كبرى على طريق الرياض - مكة المكرمة توفر جميع الخدمات والمطاعم.',
                mapUrl: 'https://maps.app.goo.gl/ynR4FzfqCVQnBnLw6',
                distanceFromPrevKm: 170,
                remainingToMakkahKm: 600,
                lat: 23.4500,
                lon: 43.9500
            },
            {
                id: 'humiyat-sasco',
                badge: 'تبعد ~144 كم عن المحطة السابقة',
                title: 'محطة ساسكو - الحوميات',
                desc: 'محطة كبرى على طريق الرياض - مكة المكرمة توفر جميع الخدمات والمطاعم.',
                mapUrl: 'https://maps.app.goo.gl/Lj4sBrVA4Ug9oqz8A',
                distanceFromPrevKm: 144,
                remainingToMakkahKm: 455,
                lat: 22.9500,
                lon: 42.8500
            },
            {
                id: 'dhalm-sasco',
                badge: 'تبعد ~72 كم عن المحطة السابقة',
                title: 'محطة ساسكو - ظلم',
                desc: 'محطة كبرى قبل التوجه إلى منطقة الطائف وميقات قرن المنازل.',
                mapUrl: 'https://maps.app.goo.gl/Z5aUUuPz5jJNYoL1A',
                distanceFromPrevKm: 72,
                remainingToMakkahKm: 380,
                lat: 22.6500,
                lon: 42.1800
            },
            {
                id: 'albaik-pre-sail',
                unnumbered: true,
                variant: 'food',
                badge: 'استراحة طعام',
                title: '🍔 مطعم البيك (قبل السيل)',
                desc: 'يقع قبل ميقات السيل الكبير مباشرة.',
                mapUrl: 'https://maps.app.goo.gl/fXBgtMqVtdHjzGt5A',
                btnLabel: '🍗 موقع المطعم',
                lat: 21.6400,
                lon: 40.4400
            },
            {
                id: 'sail-kabeer-sasco',
                variant: 'miqat',
                badge: 'تبعد ~245 كم عن محطة ظلم',
                title: 'محطة ساسكو (السيل الكبير)',
                desc: 'بالقرب من الطائف والميقات، نقطة الاستعداد والاغتسال للإحرام (قرن المنازل).',
                mapUrl: 'https://maps.app.goo.gl/Vds8UPCtvsFRXoG26',
                distanceFromPrevKm: 245,
                remainingToMakkahKm: 90,
                lat: 21.6267,
                lon: 40.4267
            }
        ],

        // محطات طريق العودة المشترك (المدينة المنورة ← القصيم ← سدير ← الرياض)
        madinahToRiyadhReturn: [
            {
                id: 'return-golden-service',
                badge: 'تبعد ~235 كم عن المدينة المنورة',
                title: 'محطة الخدمة الذهبية',
                desc: 'من المحطات الكبرى والرئيسية على طريق المدينة - القصيم.',
                mapUrl: 'https://maps.app.goo.gl/SxWiMb8wV5Ny63i78',
                lat: 25.1500,
                lon: 41.6500
            },
            {
                id: 'return-aldrees-bukayriyah',
                badge: 'تبعد ~230 كم عن المحطة السابقة',
                title: 'محطة الدريس - البكيرية',
                desc: 'من المحطات الكبرى والرئيسية في منطقة القصيم.',
                mapUrl: 'https://maps.app.goo.gl/Kpvjq8gj46RtKsWJ7',
                lat: 26.1400,
                lon: 43.6600
            },
            {
                id: 'return-loder-sudair',
                badge: 'تبعد ~225 كم عن المحطة السابقة',
                title: 'محطة لودر - سدير',
                desc: 'محطة حديثة تتوفر بها خدمات متكاملة ومطعم البيك.',
                mapUrl: 'https://maps.app.goo.gl/zzCxVacA7Yq8ky74A',
                lat: 25.6200,
                lon: 45.5500
            },
            {
                id: 'return-sasco-jazeera',
                badge: 'تبعد ~200 كم عن المحطة السابقة',
                title: 'محطة ساسكو الجزيرة',
                desc: 'مدخل الرياض الشمالي وتتوفر بها كافة الخدمات ومطعم البيك.',
                mapUrl: 'https://maps.app.goo.gl/Bmmvk5oWBikPijqQ8',
                lat: 24.9500,
                lon: 46.6200
            }
        ]
    },

    // قائمة الفحص الذكية (مع معرّف ثابت id لكل بند لمنع اختلاط الحالة عند إضافة أو ترتيب البنود)
    checklistGroups: [
        {
            title: '📄 الوثائق والاتصالات',
            items: [
                { id: 'doc-passport', label: 'جوازات السفر صالحة (6 أشهر على الأقل)' },
                { id: 'doc-national-id', labelKey: 'nationalIdLabel' },
                { id: 'doc-saudi-visa', label: 'تأشيرة السعودية' },
                { id: 'doc-car-reg', label: 'استمارة السيارة ورخصة القيادة' },
                { id: 'doc-car-insurance', label: 'تأمين السيارة (للسعودية)' },
                { id: 'doc-roaming-sim', label: 'تفعيل باقة تجوال أو شريحة سعودية' },
                { id: 'doc-nusuk-tawakkalna', label: 'تثبيت وتحديث تطبيقي (نسك) و(توكلنا)' },
                { id: 'doc-offline-maps', label: 'تحميل خرائط Google Maps بدون إنترنت' },
                { id: 'doc-umrah-guide', label: 'دليل العمرة' }
            ]
        },
        {
            title: '🚗 السيارة والتجهيزات',
            items: [
                { id: 'car-tires-pressure', label: 'فحص ضغط الإطارات والإطار الاحتياطي' },
                { id: 'car-tire-tools', label: 'عدة تبديل الإطارات' },
                { id: 'car-air-compressor', label: 'منفاخ إطارات كهربائي' },
                { id: 'car-engine-brake-oil', label: 'فحص زيوت المحرك والفرامل' },
                { id: 'car-coolant-wipers', label: 'فحص مياه الراديتر والمساحات' },
                { id: 'car-ac-check', label: 'فحص تكييف السيارة' },
                { id: 'car-wrench-kit', label: 'عدة تصليح (مفاتيح مقاسات متعددة)' },
                { id: 'car-jump-starter', label: 'بطارية شحن لتشغيل بطارية السيارة أو كابلات التوصيل' },
                { id: 'car-spare-key', label: 'مفتاح احتياطي للسيارة (مع مرافق)' },
                { id: 'car-flashlight', label: 'مصباح يدوي (كشاف طوارئ)' },
                { id: 'car-extinguisher-triangle', label: 'طفاية حريق ومثلث السلامة' },
                { id: 'car-first-aid', label: 'حقيبة الإسعافات الأولية' },
                { id: 'car-phone-charger', label: 'شاحن السيارة للجوال' },
                { id: 'car-power-bank', label: 'بطارية شحن إضافية للجوال (باور بانك)' },
                { id: 'car-saudi-cash', label: 'مبلغ نقدي سعودي (كاش)' },
                { id: 'car-ihram-bag', label: 'تجهيز حقيبة الإحرام بشكل مستقل' }
            ]
        },
        {
            title: '💊 الصحة والراحة الشخصية',
            items: [
                { id: 'health-painkillers', label: 'أدوية شخصية (مسكنات، خافض حرارة..)' },
                { id: 'health-kids-meds', label: 'أدوية الأطفال' },
                { id: 'health-chafing-cream', label: 'مرهم طبي للتسلخات الجسدية (مهم أثناء الإحرام)' },
                { id: 'health-eye-drops', label: 'قطرة ترطيب العين' },
                { id: 'health-sunglasses', label: 'نظارات شمسية' },
                { id: 'health-white-umbrella', label: 'مظلة شمسية بيضاء للطواف والمشي بالنهار' },
                { id: 'health-water-snacks', label: 'مياه صالحة للشرب ووجبات خفيفة كافية للطريق' },
                { id: 'health-shaving-kit', label: 'أدوات حلاقة (ماكينة، مقص، شفرة)' },
                { id: 'health-nail-clipper', label: 'مقص أظافر' },
                { id: 'health-unscented-wipes', label: 'مناديل مبللة (غير معطرة للإحرام)' },
                { id: 'health-pocket-tissues', label: 'محارم جيب' }
            ]
        }
    ],

    // التطبيقات المشتركة لجميع الدول
    sharedApps: [
        {
            id: 'manafeth',
            title: 'منافذ للتأمين',
            desc: 'لإصدار وثائق التأمين الإلزامي للمركبات الأجنبية',
            iconSrc: 'assets/images/manafeth.png',
            iconAlt: 'Manafeth',
            playUrl: 'https://play.google.com/store/apps/details?id=com.najm.manafeth',
            appleUrl: 'https://apps.apple.com/qa/app/manafith-منافذ/id1630305902',
            ariaName: 'تطبيق منافذ',
            showOnHome: true
        },
        {
            id: 'nusuk',
            title: 'نسك (Nusuk)',
            desc: 'لإصدار تصاريح العمرة وزيارة الروضة الشريفة',
            iconSrc: 'assets/images/nusuk.png',
            iconAlt: 'Nusuk',
            playUrl: 'https://play.google.com/store/apps/details?id=com.moh.nusukapp',
            appleUrl: 'https://apps.apple.com/qa/app/nusuk-نسك/id6469515422',
            ariaName: 'تطبيق نسك',
            showOnHome: true
        },
        {
            id: 'najm',
            title: 'نجم للحوادث',
            desc: 'للتبليغ عن الحوادث المرورية ومتابعة المطالبات',
            iconSrc: 'assets/images/najm.png',
            iconAlt: 'Najm',
            playUrl: 'https://play.google.com/store/apps/details?id=com.najm.najm',
            appleUrl: 'https://apps.apple.com/qa/app/najm-نجم/id953140409',
            ariaName: 'تطبيق نجم'
        },
        {
            id: 'jahez',
            title: 'جاهز',
            desc: 'لطلب وتوصيل الطعام في المدن والمحطات الكبرى',
            iconSrc: 'assets/images/jahez.png',
            iconAlt: 'Jahez',
            playUrl: 'https://play.google.com/store/apps/details?id=net.jahez',
            appleUrl: 'https://apps.apple.com/sa/app/jahez-%D8%AC%D8%A7%D9%87%D8%B2/id1137352156',
            ariaName: 'تطبيق جاهز'
        },
        {
            id: 'hungerstation',
            title: 'هنقرستيشن',
            desc: 'لطلب وتوصيل الطعام والمقاضي',
            iconSrc: 'assets/images/hungerstation.png',
            iconAlt: 'HungerStation',
            playUrl: 'https://play.google.com/store/apps/details?id=com.hungerstation.android.web',
            appleUrl: 'https://apps.apple.com/sa/app/hungerstation/id596011949',
            ariaName: 'تطبيق هنقرستيشن'
        },
        {
            id: 'absher',
            title: 'أبشر - للمخالفات المرورية',
            desc: 'رابط الاستعلام المباشر عن المخالفات المرورية للزائرين',
            iconSrc: 'assets/images/absher.svg',
            iconAlt: 'Absher',
            iconStyle: 'background-color: white; padding: 6px; box-sizing: border-box; object-fit: contain;',
            webUrl: 'https://www.absher.sa/wps/portal/individuals/Home/myservices/einquiries/traffic/qtvfvisitor/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zizYx8nA09LIy8DQK9zA0CjUKDAgJ9XY0M_A30w8EKDDxNTDwMTYy83Q3MjAwcw4IsTFw9TQ3dzUz0o0DSOIAjTD8eCwjqj8KixNHAKcjIydjAwN3fCKsCFDOCE4v0C3JDIwyyTBQB1Lzbtw!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/',
            webAriaLabel: 'الاستعلام عن المخالفات عبر أبشر'
        },
        {
            id: 'haramain',
            title: 'قطار الحرمين السريع',
            desc: 'لحجز تذاكر القطار السريع بين مكة والمدينة',
            iconEmoji: '🚄',
            iconEmojiFontSize: '26px',
            playUrl: 'https://play.google.com/store/apps/details?id=com.indra.haramain.pro',
            appleUrl: 'https://apps.apple.com/sa/app/hhr-train/id1533264335',
            webUrl: 'https://sar.hhr.sa',
            ariaName: 'تطبيق قطار الحرمين',
            webAriaLabel: 'موقع قطار الحرمين'
        }
    ]
};
