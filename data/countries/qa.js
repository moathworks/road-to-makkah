/**
 * بيانات دليل السفر البري من دولة قطر إلى مكة المكرمة
 *
 * المسافات: distanceFromPrevKm هي المصدر الوحيد. المسافة المتبقية لكل محطة ونقاط GPS
 * وتكلفة الوقود تُحسب آلياً في build.js، ويفشل البناء إن لم يطابق مجموع المقاطع totalDistanceKm.
 * الإحداثيات مأخوذة من روابط الخرائط نفسها، ومسافات المقاطع مُراجعة على مسار الطريق الفعلي.
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
    totalDistanceKm: 1455,
    estimatedDriveHours: 16,
    nationalIdLabel: 'البطاقة الشخصية القطرية QID',
    emergencyNumber: '999',
    metaDescription: 'دليل السفر البري من قطر إلى مكة المكرمة عبر منفذ سلوى الحدودي: حاسبة المسافات والوقود، محطات التوقف، قائمة الفحص الذكية، وأرقام الطوارئ.',
    pageTitle: 'دليل السفر البري من قطر إلى مكة المكرمة',
    printHeaderTitle: 'مسار الرحلة البرية من قطر إلى مكة المكرمة 🕋',
    printHeaderSubtitle: 'دليل رقمي لتخطيط مسارات السفر البري ومحطات الوقود والراحة 2026',
    headerSubtitle: 'دليل رقمي متكامل للرحلات البرية عبر منفذ سلوى الحدودي وصولاً إلى الحرم المكي الشريف.',
    camelWarningText: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد سلوى وحتى خريص، وبعد القويعية وحتى الطائف.',

    // نقطة الانطلاق (بداية مسار GPS)
    origin: { name: 'الانطلاق (الدوحة)', lat: 25.2854, lon: 51.5310 },

    routes: [
        {
            title: 'طريق 40 السريع (طريق 80M - المسار الرئيسي)',
            itinerary: 'الدوحة ← منفذ سلوى ← الهفوف ← الرياض ← القويعية ← ظلم ← الطائف ← مكة المكرمة.',
            description: 'أكثر الطرق أماناً ومضاء في معظمه، ويحتوي على أحدث المحطات النموذجية (ساسكو والدريس).',
            distanceKm: 1455,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: 'مسار التفافي حول الرياض',
            itinerary: 'الدوحة ← سلوى ← طريق خريص ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
            description: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
            distanceKm: 1485,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: '⛽ محطات طريق الذهاب (الدوحة ← الرياض)',
    outboundStations: [
        {
            id: 'qa-abu-samra',
            badge: 'تبعد ~90 كم عن الدوحة',
            title: 'محطة وقود أبو سمرة',
            gpsName: 'منفذ أبو سمرة / سلوى',
            desc: 'آخر نقطة للتزود بالوقود القطري قبل المنفذ الحدودي.',
            mapUrl: 'https://maps.app.goo.gl/DKDA5yq93X3hYiUH7',
            distanceFromPrevKm: 90,
            lat: 24.7520,
            lon: 50.8517
        },
        {
            id: 'qa-sasco-khurais',
            badge: 'تبعد ~215 كم عن أبو سمرة',
            title: 'محطة ساسكو / طريق خريص',
            gpsName: 'محطة ساسكو (طريق خريص)',
            desc: 'على طريق خريص (بعد الهفوف باتجاه الرياض).',
            mapUrl: 'https://maps.app.goo.gl/innPYmtbPCw4yBsG6',
            distanceFromPrevKm: 215,
            lat: 25.3414,
            lon: 49.1312
        },
        {
            id: 'qa-jo-station',
            badge: 'تبعد ~170 كم عن ساسكو خريص',
            title: 'محطة جو ستيشن',
            gpsName: 'محطة جو ستيشن (طريق 40)',
            desc: 'بعد التقاء طريق خريص مع طريق الدمام - الرياض السريع (طريق 40 / 80M).',
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            distanceFromPrevKm: 170,
            lat: 25.1351,
            lon: 47.5337
        },
        {
            id: 'qa-aldrees-riyadh-entry',
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

    returnSummaryTitle: '⛽ محطات طريق العودة (الرياض ← الدوحة)',
    returnIntroText: 'المحطات الموصى بها أثناء العودة من الرياض إلى منفذ سلوى والدوحة:',
    returnStations: [
        {
            id: 'qa-ret-adnoc',
            badge: 'بداية طريق الرياض - الدمام',
            title: 'محطة أدنوك',
            desc: 'من المحطات الكبرى والرئيسية عند الخروج من الرياض شرقاً.',
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA'
        },
        {
            id: 'qa-ret-sasco',
            badge: 'تبعد ~67 كم عن المحطة السابقة',
            title: 'محطة ساسكو',
            desc: 'من المحطات الكبرى والرئيسية على طريق الرياض - الدمام السريع (طريق 40).',
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6'
        },
        {
            id: 'qa-ret-aldrees-khurais',
            badge: 'تبعد ~105 كم عن المحطة السابقة',
            title: 'محطة الدريس',
            desc: 'خدمات وقود واستراحة وتموينات على الطريق السريع.',
            mapUrl: 'https://maps.app.goo.gl/9NnjRSQ9hupFi64r7'
        },
        {
            id: 'qa-ret-emtiyaz-salwa',
            badge: 'تبعد ~148 كم عن المحطة السابقة',
            title: 'امتياز الوقود',
            desc: 'محطة خدمات متكاملة على طريق الهفوف - سلوى قبل الحدود.',
            mapUrl: 'https://maps.app.goo.gl/SAk9jxJpcPTuBrQd8'
        },
        {
            id: 'qa-ret-abu-samra',
            badge: 'بعد عبور منفذ أبو سمرة',
            title: 'محطة وقود (أبو سمرة - قطر)',
            desc: 'أول محطة وقود وخدمات بعد الدخول إلى أراضي دولة قطر.',
            mapUrl: 'https://maps.app.goo.gl/DKDA5yq93X3hYiUH7'
        }
    ]
};
