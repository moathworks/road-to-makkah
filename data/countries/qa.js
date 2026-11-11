/**
 * بيانات دليل السفر البري من دولة قطر إلى مكة المكرمة
 */

module.exports = {
    slug: 'qatar',
    countryCode: 'qa',
    countryName: 'قطر',
    countryFullTitle: 'دولة قطر',
    capitalCity: 'الدوحة',
    defaultCity: 'الدوحة (افتراضي)',
    flagFile: 'qa-flag.png',
    themeColor: '#8A1538',
    themeColorRgb: '138, 21, 56',
    themeColorDark: '#5A0E25',
    themeComment: 'تخصيص ألوان الهوية البصرية لدولة قطر (العنابي)',
    routeComment: 'خيارات مسارات السفر البري (خاص بدولة قطر)',
    outboundComment: 'محطات طريق الذهاب (الدوحة - الرياض) [خاص بقطر]',
    returnComment: 'محطات طريق العودة (الرياض ← الدوحة) [خاص بقطر]',
    checklistComment: 'قائمة الفحص الذكية قبل السفر (مشتركة بين كل الدول مع تخصيص هوية الدولة تلقائياً)',
    locale: 'ar-QA',
    totalDistanceKm: 1480,
    bypassDistanceKm: 1510,
    estimatedDriveHours: 16,
    remainingDriveTimeText: '14 ساعة و 48 دقيقة',
    fuelCostInitialSar: 323,
    fuelLitersInitial: '148.0',
    nationalIdLabel: 'البطاقة الشخصية القطرية QID',
    emergencyNumber: '999',
    metaDescription: 'دليل السفر البري من قطر إلى مكة المكرمة عبر منفذ سلوى الحدودي: حاسبة المسافات والوقود، محطات التوقف، قائمة الفحص الذكية، وأرقام الطوارئ.',
    pageTitle: 'دليل السفر البري من قطر إلى مكة المكرمة',
    printHeaderTitle: 'مسار الرحلة البرية من قطر إلى مكة المكرمة 🕋',
    printHeaderSubtitle: 'دليل رقمي لتخطيط مسارات السفر البري ومحطات الوقود والراحة 2026',
    headerSubtitle: 'دليل رقمي متكامل للرحلات البرية عبر منفذ سلوى الحدودي وصولاً إلى الحرم المكي الشريف.',
    camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد سلوى وحتى خريص، وبعد القويعية وحتى الطائف.',

    routes: [
        {
            title: 'طريق 80 السريع (المسار الرئيسي)',
            itinerary: 'الدوحة ← منفذ سلوى ← الهفوف ← الرياض ← القويعية ← ظلم ← الطائف ← مكة المكرمة.',
            description: 'أكثر الطرق أماناً ومضاء في معظمه، ويحتوي على أحدث المحطات النموذجية (ساسكو والدريس).',
            distanceKm: 1480,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: 'مسار التفافي حول الرياض',
            itinerary: 'الدوحة ← سلوى ← طريق خريص ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
            description: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
            distanceKm: 1510,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: '⛽ محطات طريق الذهاب (الدوحة ← الرياض)',
    outboundStations: [
        {
            id: 'qa-abu-samra',
            badge: 'تبعد ~90 كم عن الدوحة',
            title: 'محطة وقود أبو سمرة',
            desc: 'آخر نقطة للتزود بالوقود القطري قبل المنفذ الحدودي.',
            mapUrl: 'https://maps.app.goo.gl/DKDA5yq93X3hYiUH7',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 90,
            remainingToMakkahKm: 1390,
            lat: 24.7441,
            lon: 50.8354
        },
        {
            id: 'qa-sasco-khurais',
            badge: 'تبعد ~180 كم عن أبو سمرة',
            title: 'محطة ساسكو / طريق خريص',
            desc: 'على طريق خريص (بعد الهفوف باتجاه الرياض).',
            mapUrl: 'https://maps.app.goo.gl/innPYmtbPCw4yBsG6',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 180,
            remainingToMakkahKm: 1210,
            lat: 25.1278,
            lon: 48.1633
        },
        {
            id: 'qa-jo-station',
            badge: 'تبعد ~170 كم عن ساسكو خريص',
            title: 'محطة جو ستيشن',
            desc: 'بداية طريق الدمام - الرياض (طريق 80 السريع).',
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 170,
            remainingToMakkahKm: 1040,
            lat: 25.0500,
            lon: 47.4500
        },
        {
            id: 'qa-aldrees-riyadh-entry',
            badge: 'تبعد ~80 كم عن جو ستيشن',
            title: 'الدريس (مدخل الرياض)',
            desc: 'محطة ممتازة للتزود بالوقود والتأكد من الجاهزية قبل دخول الرياض.',
            mapUrl: 'https://maps.app.goo.gl/AbU7P9gM571Gks2z7',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 80,
            remainingToMakkahKm: 950,
            lat: 24.8333,
            lon: 46.8500
        }
    ],

    returnSummaryTitle: '⛽ محطات طريق العودة (الرياض ← الدوحة)',
    returnIntroText: 'المحطات الموصى بها أثناء العودة من الرياض إلى منفذ سلوى والدوحة:',
    returnStations: [
        {
            id: 'qa-ret-adnoc',
            badge: 'بداية طريق الرياض - الدمام',
            title: 'محطة أدنوك',
            desc: 'من المحطات الكبرى والرئيسية عند الخروج من الرياض شرقاً.',
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA',
            btnLabel: '🗺️ موقع المحطة',
            lat: 24.8500,
            lon: 46.8800
        },
        {
            id: 'qa-ret-sasco',
            badge: 'تبعد ~77 كم عن المحطة السابقة',
            title: 'محطة ساسكو',
            desc: 'من المحطات الكبرى والرئيسية على طريق 80 السريع.',
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6',
            btnLabel: '🗺️ موقع المحطة',
            lat: 25.0600,
            lon: 47.4800
        },
        {
            id: 'qa-ret-aldrees-khurais',
            badge: 'تبعد ~105 كم عن المحطة السابقة',
            title: 'محطة الدريس',
            desc: 'خدمات وقود واستراحة وتموينات على الطريق السريع.',
            mapUrl: 'https://maps.app.goo.gl/9NnjRSQ9hupFi64r7',
            btnLabel: '🗺️ موقع المحطة',
            lat: 25.2100,
            lon: 48.5100
        },
        {
            id: 'qa-ret-emtiyaz-salwa',
            badge: 'تبعد ~148 كم عن المحطة السابقة',
            title: 'امتياز الوقود',
            desc: 'محطة خدمات متكاملة على طريق الهفوف - سلوى قبل الحدود.',
            mapUrl: 'https://maps.app.goo.gl/SAk9jxJpcPTuBrQd8',
            btnLabel: '🗺️ موقع المحطة',
            lat: 24.8200,
            lon: 50.6500
        },
        {
            id: 'qa-ret-abu-samra',
            badge: 'بعد عبور منفذ أبو سمرة',
            title: 'محطة وقود (أبو سمرة - قطر)',
            desc: 'أول محطة وقود وخدمات بعد الدخول إلى أراضي دولة قطر.',
            mapUrl: 'https://maps.app.goo.gl/DKDA5yq93X3hYiUH7',
            btnLabel: '🗺️ موقع المحطة',
            lat: 24.7441,
            lon: 50.8354
        }
    ],

    gpsStations: [
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
};
