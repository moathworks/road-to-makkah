/**
 * بيانات دليل السفر البري من مملكة البحرين إلى مكة المكرمة
 */

module.exports = {
    slug: 'bahrain',
    countryCode: 'bh',
    countryName: 'البحرين',
    countryFullTitle: 'مملكة البحرين',
    capitalCity: 'المنامة',
    defaultCity: 'المنامة (افتراضي)',
    flagFile: 'bh-flag.png',
    themeColor: '#CE1126',
    themeColorRgb: '206, 17, 38',
    themeColorDark: '#8F0B1A',
    themeComment: 'تخصيص ألوان الهوية البصرية لمملكة البحرين (الأحمر البحريني)',
    routeComment: 'خيارات مسارات السفر البري (خاص بمملكة البحرين)',
    outboundComment: 'محطات طريق الذهاب (المنامة - الرياض) [خاص بالبحرين]',
    returnComment: 'محطات طريق العودة (الرياض ← المنامة) [خاص بالبحرين]',
    checklistComment: 'قائمة الفحص الذكية قبل السفر (مشتركة مع تخصيص البطاقة الشخصية البحرينية CPR تلقائياً)',
    locale: 'ar-BH',
    totalDistanceKm: 1280,
    bypassDistanceKm: 1310,
    estimatedDriveHours: 13.5,
    remainingDriveTimeText: '12 ساعة و 48 دقيقة',
    fuelCostInitialSar: 279,
    fuelLitersInitial: '128.0',
    nationalIdLabel: 'البطاقة الشخصية البحرينية (CPR)',
    emergencyNumber: '999',
    metaDescription: 'دليل السفر البري من مملكة البحرين إلى مكة المكرمة عبر جسر الملك فهد: حاسبة المسافات والوقود، محطات التوقف، قائمة الفحص الذكية، وأرقام الطوارئ.',
    pageTitle: 'دليل السفر البري من البحرين إلى مكة المكرمة',
    printHeaderTitle: 'مسار الرحلة البرية من البحرين إلى مكة المكرمة 🕋',
    printHeaderSubtitle: 'دليل رقمي لتخطيط مسارات السفر البري عبر جسر الملك فهد ومحطات الوقود والراحة 2026',
    headerSubtitle: 'دليل رقمي متكامل للرحلات البرية عبر جسر الملك فهد وصولاً إلى الحرم المكي الشريف.',
    camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر على امتداد الطريق بعد القويعية وحتى منطقة الطائف.',

    extraApps: [
        {
            id: 'jesr',
            title: 'جسر (JESR - جسر الملك فهد)',
            desc: 'لدفع رسوم عبور الجسر، وتأمين المركبة، ومعرفة حالة الازدحام مباشرة',
            iconHtml: '<div class="app-icon" style="background-color: white; display: flex; align-items: center; justify-content: center; font-size: 25px;">🌉</div>',
            playUrl: 'https://play.google.com/store/apps/details?id=com.kfca.sa.jesr',
            appleUrl: 'https://apps.apple.com/bh/app/jesr-%D8%AC%D8%B3%D8%B1/id1482105365',
            webUrl: 'https://kfca.sa'
        }
    ],

    routes: [
        {
            title: 'طريق 80 السريع (المسار الرئيسي)',
            itinerary: 'المنامة ← جسر الملك فهد ← الدمام/الظهران ← طريق 80 السريع ← الرياض ← القويعية ← ظلم ← الطائف ← مكة المكرمة.',
            description: 'المسار المباشر والأكثر أماناً، مضاء في معظمه ويحتوي على أحدث المحطات النموذجية (ساسكو والدريس).',
            distanceKm: 1280,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: 'مسار التفافي حول الرياض',
            itinerary: 'المنامة ← جسر الملك فهد ← طريق الدمام السريع ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
            description: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
            distanceKm: 1310,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: '⛽ محطات طريق الذهاب (المنامة ← الرياض)',
    outboundStations: [
        {
            id: 'bh-bapco-janabiyah',
            badge: 'تبعد ~18 كم عن المنامة',
            title: 'محطة بابكو (الجنبية - البحرين)',
            desc: 'آخر محطة للتزود بالوقود داخل البحرين قبل الصعود إلى جسر الملك فهد.',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bapco+Station+Janabiyah+Bahrain',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 18,
            remainingToMakkahKm: 1262,
            lat: 26.1880,
            lon: 50.4610
        },
        {
            id: 'bh-causeway-border',
            badge: 'في منتصف الجسر (الحدود)',
            title: 'استراحة ومنفذ جسر الملك فهد',
            desc: 'إنهاء إجراءات الجوازات والجمارك والتأمين، وتتوفر بها مساجد ومطاعم واستراحات.',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=King+Fahd+Causeway+Passport+Control',
            btnLabel: '🗺️ موقع المنفذ',
            distanceFromPrevKm: 12,
            remainingToMakkahKm: 1255,
            lat: 26.1856,
            lon: 50.3267
        },
        {
            id: 'bh-sasco-dammam-hwy',
            badge: 'تبعد ~55 كم عن جسر الملك فهد',
            title: 'محطة ساسكو (طريق الدمام - الرياض)',
            desc: 'أولى المحطات النموذجية الكبرى بعد الخبر والدمام على بداية طريق 80 السريع.',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=SASCO+Dammam+Riyadh+Highway',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 55,
            remainingToMakkahKm: 1200,
            lat: 26.2500,
            lon: 49.9500
        },
        {
            id: 'bh-jo-station',
            badge: 'تبعد ~160 كم عن المحطة السابقة',
            title: 'محطة جو ستيشن',
            desc: 'محطة حديثة ومتكاملة في منتصف طريق الدمام - الرياض (طريق 80 السريع).',
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 160,
            remainingToMakkahKm: 1040,
            lat: 25.0500,
            lon: 47.4500
        },
        {
            id: 'bh-aldrees-riyadh-entry',
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

    returnSummaryTitle: '⛽ محطات طريق العودة (الرياض ← المنامة)',
    returnIntroText: 'المحطات الموصى بها أثناء العودة من الرياض عبر طريق 80 السريع إلى جسر الملك فهد والمنامة:',
    returnStations: [
        {
            id: 'bh-ret-adnoc',
            badge: 'بداية طريق الرياض - الدمام',
            title: 'محطة أدنوك',
            desc: 'من المحطات الكبرى والرئيسية عند الخروج من الرياض شرقاً.',
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA',
            btnLabel: '🗺️ موقع المحطة',
            lat: 24.8500,
            lon: 46.8800
        },
        {
            id: 'bh-ret-sasco',
            badge: 'تبعد ~77 كم عن المحطة السابقة',
            title: 'محطة ساسكو',
            desc: 'من المحطات الكبرى والرئيسية على طريق 80 السريع.',
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6',
            btnLabel: '🗺️ موقع المحطة',
            lat: 25.0600,
            lon: 47.4800
        },
        {
            id: 'bh-ret-aldrees',
            badge: 'تبعد ~105 كم عن المحطة السابقة',
            title: 'محطة الدريس',
            desc: 'خدمات وقود واستراحة وتموينات على طريق الرياض - الدمام السريع.',
            mapUrl: 'https://maps.app.goo.gl/9NnjRSQ9hupFi64r7',
            btnLabel: '🗺️ موقع المحطة',
            lat: 25.2100,
            lon: 48.5100
        },
        {
            id: 'bh-ret-causeway',
            badge: 'الخبر ← المنامة',
            title: 'استراحة ومنفذ جسر الملك فهد',
            desc: 'إنهاء إجراءات العودة عبر جسر الملك فهد والدخول إلى أراضي مملكة البحرين.',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=King+Fahd+Causeway+Passport+Control',
            btnLabel: '🗺️ موقع المنفذ',
            lat: 26.1856,
            lon: 50.3267
        }
    ],

    gpsStations: [
        { km: 1280, name: 'الانطلاق (المنامة)', lat: 26.2235, lon: 50.5876 },
        { km: 1255, name: 'منفذ جسر الملك فهد', lat: 26.1856, lon: 50.3267 },
        { km: 1200, name: 'محطة ساسكو (طريق الدمام - الرياض)', lat: 26.2500, lon: 49.9500 },
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
