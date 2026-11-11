/**
 * بيانات دليل السفر البري من مملكة البحرين إلى مكة المكرمة
 * تم تدقيق المسافات والمحطات جغرافياً على امتداد جسر الملك فهد وطريق الدمام - الرياض السريع (طريق 40 / 80M)
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
    totalDistanceKm: 1350,
    bypassDistanceKm: 1380,
    estimatedDriveHours: 14.5,
    remainingDriveTimeText: '13 ساعة و 30 دقيقة',
    fuelCostInitialSar: 294,
    fuelLitersInitial: '135.0',
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
            title: 'طريق 40 السريع (طريق 80M - المسار الرئيسي)',
            itinerary: 'المنامة ← جسر الملك فهد ← الدمام/الظهران ← طريق 40 السريع ← الرياض ← القويعية ← ظلم ← الطائف ← مكة المكرمة.',
            description: 'المسار المباشر والأكثر أماناً، مضاء في معظمه ويحتوي على أحدث المحطات النموذجية (ساسكو والدريس).',
            distanceKm: 1350,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: 'مسار التفافي حول الرياض',
            itinerary: 'المنامة ← جسر الملك فهد ← طريق الدمام السريع (طريق 40) ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
            description: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
            distanceKm: 1380,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: '⛽ محطات طريق الذهاب (المنامة ← الرياض)',
    outboundStations: [
        {
            id: 'bh-bapco-janabiyah',
            badge: 'تبعد ~18 كم عن المنامة',
            title: 'محطة بابكو (الجنبية - البحرين)',
            desc: 'آخر محطة للتزود بالوقود داخل البحرين على طريق الشيخ عيسى بن سلمان قبل جسر الملك فهد.',
            mapUrl: 'https://www.google.com/maps?q=26.1822,50.4658',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 18,
            remainingToMakkahKm: 1332,
            lat: 26.1822,
            lon: 50.4658
        },
        {
            id: 'bh-causeway-border',
            badge: 'في منتصف الجسر (الحدود)',
            title: 'استراحة ومنفذ جسر الملك فهد',
            desc: 'إنهاء إجراءات الجوازات والجمارك والتأمين، وتتوفر بها مساجد ومطاعم واستراحات.',
            mapUrl: 'https://www.google.com/maps?q=26.1856,50.3267',
            btnLabel: '🗺️ موقع المنفذ',
            distanceFromPrevKm: 22,
            remainingToMakkahKm: 1310,
            lat: 26.1856,
            lon: 50.3267
        },
        {
            id: 'bh-sasco-dammam-hwy',
            badge: 'تبعد ~55 كم عن جسر الملك فهد',
            title: 'محطة ساسكو (طريق الدمام - الرياض)',
            desc: 'أولى المحطات النموذجية الكبرى بعد الخبر والدمام على بداية طريق 40 (80M) السريع.',
            mapUrl: 'https://www.google.com/maps?q=26.2500,49.9500',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 55,
            remainingToMakkahKm: 1255,
            lat: 26.2500,
            lon: 49.9500
        },
        {
            id: 'bh-jo-station',
            badge: 'تبعد ~275 كم عن ساسكو الدمام',
            title: 'محطة جو ستيشن',
            desc: 'محطة حديثة ومتكاملة على طريق الدمام - الرياض السريع (طريق 40 / 80M) قبل الرياض بنحو 80 كم.',
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 275,
            remainingToMakkahKm: 980,
            lat: 25.1351,
            lon: 47.5337
        },
        {
            id: 'bh-aldrees-riyadh-entry',
            badge: 'تبعد ~80 كم عن جو ستيشن',
            title: 'الدريس (مدخل الرياض)',
            desc: 'محطة ممتازة للتزود بالوقود والتأكد من الجاهزية قبل دخول الرياض.',
            mapUrl: 'https://maps.app.goo.gl/AbU7P9gM571Gks2z7',
            btnLabel: '🗺️ موقع المحطة',
            distanceFromPrevKm: 80,
            remainingToMakkahKm: 900,
            lat: 24.8356,
            lon: 46.8333
        }
    ],

    returnSummaryTitle: '⛽ محطات طريق العودة (الرياض ← المنامة)',
    returnIntroText: 'المحطات الموصى بها أثناء العودة من الرياض عبر طريق 40 (80M) السريع إلى جسر الملك فهد والمنامة:',
    returnStations: [
        {
            id: 'bh-ret-adnoc',
            badge: 'بداية طريق الرياض - الدمام',
            title: 'محطة أدنوك',
            desc: 'من المحطات الكبرى والرئيسية عند الخروج من الرياض شرقاً.',
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA',
            btnLabel: '🗺️ موقع المحطة',
            lat: 24.8965,
            lon: 46.9076
        },
        {
            id: 'bh-ret-sasco',
            badge: 'تبعد ~77 كم عن المحطة السابقة',
            title: 'محطة ساسكو (الوسيع)',
            desc: 'من المحطات الكبرى والرئيسية على طريق الرياض - الدمام السريع (طريق 40).',
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6',
            btnLabel: '🗺️ موقع المحطة',
            lat: 25.1232,
            lon: 47.5095
        },
        {
            id: 'bh-ret-aldrees-umm-irad',
            badge: 'تبعد ~175 كم عن المحطة السابقة',
            title: 'محطة الدريس - أم عراد (كود 233)',
            desc: 'خدمات وقود متكاملة واستراحة وتموينات على طريق الرياض - الدمام السريع (قرب عريعرة/جودة).',
            mapUrl: 'https://www.google.com/maps?q=25.9280,48.9660',
            btnLabel: '🗺️ موقع المحطة',
            lat: 25.9280,
            lon: 48.9660
        },
        {
            id: 'bh-ret-causeway',
            badge: 'الخبر ← المنامة',
            title: 'استراحة ومنفذ جسر الملك فهد',
            desc: 'إنهاء إجراءات العودة عبر جسر الملك فهد والدخول إلى أراضي مملكة البحرين.',
            mapUrl: 'https://www.google.com/maps?q=26.1856,50.3267',
            btnLabel: '🗺️ موقع المنفذ',
            lat: 26.1856,
            lon: 50.3267
        }
    ],

    gpsStations: [
        { km: 1350, name: 'الانطلاق (المنامة)', lat: 26.2235, lon: 50.5876 },
        { km: 1310, name: 'منفذ جسر الملك فهد', lat: 26.1856, lon: 50.3267 },
        { km: 1255, name: 'محطة ساسكو (طريق الدمام - الرياض)', lat: 26.2500, lon: 49.9500 },
        { km: 980, name: 'محطة جو ستيشن (طريق 40)', lat: 25.1351, lon: 47.5337 },
        { km: 900, name: 'بداية الرياض (الدريس)', lat: 24.8356, lon: 46.8333 },
        { km: 854, name: 'مخرج الرياض (طويق / القدية)', lat: 24.5800, lon: 46.3500 },
        { km: 721, name: 'محطة ساسكو (القويعية)', lat: 24.0489, lon: 45.2494 },
        { km: 551, name: 'محطة ساسكو (الخاصرة)', lat: 23.4500, lon: 43.9500 },
        { km: 407, name: 'محطة ساسكو (الحوميات)', lat: 22.9500, lon: 42.8500 },
        { km: 335, name: 'محطة ساسكو (ظلم)', lat: 22.7062, lon: 42.1446 },
        { km: 90, name: 'ميقات السيل الكبير (الطائف)', lat: 21.6232, lon: 40.4331 },
        { km: 0, name: 'مكة المكرمة (الحرم المكي)', lat: 21.4225, lon: 39.8262 }
    ]
};
