/**
 * بيانات دليل السفر البري من مملكة البحرين إلى مكة المكرمة
 *
 * المسافات: distanceFromPrevKm هي المصدر الوحيد. المسافة المتبقية لكل محطة ونقاط GPS
 * وتكلفة الوقود تُحسب آلياً في build.js، ويفشل البناء إن لم يطابق مجموع المقاطع totalDistanceKm.
 *
 * حالة التحقق من المواقع:
 * - المحطات تبدأ من أول محطة داخل السعودية (الدريس - الخبر) بعد منفذ الجسر.
 * - الدريس (طريق العودة): إحداثيات محطة موثّقة في OpenStreetMap وواقعة على المسار، ورابطها دبوس
 *   على الإحداثيات إلى أن يتوفر رابط المكان في خرائط Google.
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
    totalDistanceKm: 1348,
    estimatedDriveHours: 14.5,
    nationalIdLabel: 'البطاقة الشخصية البحرينية (CPR)',
    emergencyNumber: '999',
    metaDescription: 'دليل السفر البري من مملكة البحرين إلى مكة المكرمة عبر جسر الملك فهد: حاسبة المسافات والوقود، محطات التوقف، قائمة الفحص الذكية، وأرقام الطوارئ.',
    pageTitle: 'دليل السفر البري من البحرين إلى مكة المكرمة',
    printHeaderTitle: 'مسار الرحلة البرية من البحرين إلى مكة المكرمة 🕋',
    printHeaderSubtitle: 'دليل رقمي لتخطيط مسارات السفر البري عبر جسر الملك فهد ومحطات الوقود والراحة 2026',
    headerSubtitle: 'دليل رقمي متكامل للرحلات البرية عبر جسر الملك فهد وصولاً إلى الحرم المكي الشريف.',
    camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر على امتداد الطريق بعد القويعية وحتى منطقة الطائف.',

    // نقطة الانطلاق (بداية مسار GPS)
    origin: { name: 'الانطلاق (المنامة)', lat: 26.2235, lon: 50.5876 },

    extraApps: [
        {
            id: 'jesr',
            title: 'جسر (JESR - جسر الملك فهد)',
            desc: 'لدفع رسوم عبور الجسر، وتأمين المركبة، ومعرفة حالة الازدحام مباشرة',
            iconEmoji: '🌉',
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
            distanceKm: 1348,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: 'مسار التفافي حول الرياض',
            itinerary: 'المنامة ← جسر الملك فهد ← طريق الدمام السريع (طريق 40) ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
            description: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
            distanceKm: 1378,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: '⛽ محطات طريق الذهاب (المنامة ← الرياض)',
    outboundStations: [
        {
            id: 'bh-causeway-border',
            badge: 'في منتصف الجسر (الحدود)',
            title: 'استراحة ومنفذ جسر الملك فهد',
            gpsName: 'منفذ جسر الملك فهد',
            desc: 'إنهاء إجراءات الجوازات والجمارك والتأمين، وتتوفر بها مساجد ومطاعم واستراحات.',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=King+Fahd+Causeway+Passport+Control',
            btnLabel: '🗺️ موقع المنفذ',
            distanceFromPrevKm: 35,
            lat: 26.1856,
            lon: 50.3267
        },
        {
            id: 'bh-aldrees-khobar',
            badge: 'تبعد ~17 كم عن منفذ الجسر',
            title: 'محطة الدريس (الخبر)',
            desc: 'أول محطة وقود داخل السعودية بعد عبور جسر الملك فهد.',
            mapUrl: 'https://maps.app.goo.gl/DUCZ1EP62NpFV8raA',
            distanceFromPrevKm: 17,
            lat: 26.2157,
            lon: 50.1793
        },
        {
            id: 'bh-sasco-dammam-hwy',
            badge: 'تبعد ~51 كم عن الدريس الخبر',
            title: 'محطة ساسكو (طريق الدمام - الرياض)',
            desc: 'أولى المحطات النموذجية الكبرى بعد الخبر والدمام على بداية طريق 40 (80M) السريع.',
            mapUrl: 'https://maps.app.goo.gl/CeuVgcqAbNP4rwV58',
            distanceFromPrevKm: 51,
            lat: 26.2904,
            lon: 49.7868
        },
        {
            id: 'bh-jo-station',
            badge: 'تبعد ~265 كم عن محطة ساسكو',
            title: 'محطة جو ستيشن',
            gpsName: 'محطة جو ستيشن (طريق 40)',
            desc: 'محطة حديثة ومتكاملة على طريق الدمام - الرياض السريع (طريق 40 / 80M) قبل الرياض بنحو 80 كم.',
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            distanceFromPrevKm: 265,
            lat: 25.1351,
            lon: 47.5337
        },
        {
            id: 'bh-aldrees-riyadh-entry',
            badge: 'تبعد ~80 كم عن جو ستيشن',
            title: 'الدريس (مدخل الرياض)',
            gpsName: 'بداية الرياض (الدريس)',
            desc: 'محطة ممتازة للتزود بالوقود والتأكد من الجاهزية قبل دخول الرياض.',
            mapUrl: 'https://maps.app.goo.gl/AbU7P9gM571Gks2z7',
            distanceFromPrevKm: 80,
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
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA'
        },
        {
            id: 'bh-ret-sasco',
            badge: 'تبعد ~67 كم عن المحطة السابقة',
            title: 'محطة ساسكو',
            desc: 'من المحطات الكبرى والرئيسية على طريق الرياض - الدمام السريع (طريق 40).',
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6'
        },
        {
            // إحداثيات محطة الدريس موثّقة في OpenStreetMap وواقعة على طريق الرياض - الدمام
            id: 'bh-ret-aldrees-dammam-hwy',
            badge: 'تبعد ~175 كم عن المحطة السابقة',
            title: 'محطة الدريس',
            desc: 'خدمات وقود واستراحة وتموينات على طريق الرياض - الدمام السريع (طريق 40).',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=25.9310%2C49.0065'
        },
        {
            id: 'bh-ret-causeway',
            badge: 'الخبر ← المنامة',
            title: 'استراحة ومنفذ جسر الملك فهد',
            desc: 'إنهاء إجراءات العودة عبر جسر الملك فهد والدخول إلى أراضي مملكة البحرين.',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=King+Fahd+Causeway+Passport+Control',
            btnLabel: '🗺️ موقع المنفذ'
        }
    ]
};
