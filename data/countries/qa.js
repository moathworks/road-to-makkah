/**
 * بيانات دليل السفر البري من دولة قطر إلى مكة المكرمة
 *
 * المسافات: distanceFromPrevKm هي المصدر الوحيد. المسافة المتبقية لكل محطة ونقاط GPS
 * وتكلفة الوقود تُحسب آلياً في build.js، ويفشل البناء إن لم يطابق مجموع المقاطع totalDistanceKm.
 * الإحداثيات مأخوذة من روابط الخرائط نفسها، ومسافات المقاطع مُراجعة على مسار الطريق الفعلي.
 * النصوص المعروضة بصيغة { ar, en }.
 */

module.exports = {
    slug: 'qatar',
    countryCode: 'qa',
    countryName: { ar: 'قطر', en: 'Qatar' },
    defaultCity: { ar: 'الدوحة (افتراضي)', en: 'Doha (default)' },
    flagFile: 'qa-flag.png',
    // ألوان الهوية البصرية (العنابي)
    themeColor: '#8A1538',
    themeColorRgb: '138, 21, 56',
    themeColorDark: '#5A0E25',
    totalDistanceKm: 1455,
    estimatedDriveHours: 16,
    nationalIdLabel: { ar: 'البطاقة الشخصية القطرية QID', en: 'Qatar ID (QID)' },
    emergencyNumber: '999',
    metaDescription: {
        ar: 'دليل السفر البري من قطر إلى مكة المكرمة عبر منفذ سلوى الحدودي: حاسبة المسافات والوقود، محطات التوقف، قائمة الفحص الذكية، وأرقام الطوارئ.',
        en: 'Overland travel guide from Qatar to Makkah via the Salwa border crossing: distance and fuel calculator, fuel stops, smart checklist and emergency numbers.'
    },
    pageTitle: { ar: 'دليل السفر البري من قطر إلى مكة المكرمة', en: 'Overland Travel Guide from Qatar to Makkah' },
    printHeaderTitle: { ar: 'مسار الرحلة البرية من قطر إلى مكة المكرمة 🕋', en: 'Overland route from Qatar to Makkah 🕋' },
    printHeaderSubtitle: {
        ar: 'دليل رقمي لتخطيط مسارات السفر البري ومحطات الوقود والراحة 2026',
        en: 'A digital guide for planning overland routes, fuel and rest stops 2026'
    },
    headerSubtitle: {
        ar: 'دليل رقمي متكامل للرحلات البرية عبر منفذ سلوى الحدودي وصولاً إلى الحرم المكي الشريف.',
        en: 'A complete digital guide for overland trips via the Salwa border crossing to Al-Masjid Al-Haram.'
    },
    camelWarningText: {
        ar: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر بعد سلوى وحتى خريص، وبعد القويعية وحتى الطائف.',
        en: 'Watch out for stray camels, especially at night and in the early morning, from Salwa to Khurais and from Al Quwayiyah to Taif.'
    },

    // نقطة الانطلاق (بداية مسار GPS)
    origin: { name: { ar: 'الانطلاق (الدوحة)', en: 'Start (Doha)' }, lat: 25.2854, lon: 51.5310 },

    routes: [
        {
            title: { ar: 'طريق 40 السريع (طريق 80M - المسار الرئيسي)', en: 'Highway 40 (Route 80M – main route)' },
            itinerary: {
                ar: 'الدوحة ← منفذ سلوى ← الهفوف ← الرياض ← القويعية ← ظلم ← الطائف ← مكة المكرمة.',
                en: 'Doha → Salwa border → Hofuf → Riyadh → Al Quwayiyah → Dhalm → Taif → Makkah.'
            },
            description: {
                ar: 'أكثر الطرق أماناً ومضاء في معظمه، ويحتوي على أحدث المحطات النموذجية (ساسكو والدريس).',
                en: 'The safest road, lit for most of its length, with the newest model stations (SASCO and Aldrees).'
            },
            distanceKm: 1455,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: { ar: 'مسار التفافي حول الرياض', en: 'Riyadh bypass route' },
            itinerary: {
                ar: 'الدوحة ← سلوى ← طريق خريص ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
                en: 'Doha → Salwa → Khurais Road → King Salman Road (the new northern ring road) to join the Hejaz road.'
            },
            description: {
                ar: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
                en: 'Recommended to avoid central Riyadh traffic at peak hours (7 am – 5 pm).'
            },
            distanceKm: 1485,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: { ar: '⛽ محطات طريق الذهاب (الدوحة ← الرياض)', en: '⛽ Outbound stations (Doha → Riyadh)' },
    outboundStations: [
        {
            id: 'qa-abu-samra',
            badge: { ar: 'تبعد ~90 كم عن الدوحة', en: '~90 km from Doha' },
            title: { ar: 'محطة وقود أبو سمرة', en: 'Abu Samra Fuel Station' },
            gpsName: { ar: 'منفذ أبو سمرة / سلوى', en: 'Abu Samra / Salwa border' },
            desc: { ar: 'آخر نقطة للتزود بالوقود القطري قبل المنفذ الحدودي.', en: 'The last place to fill up with Qatari fuel before the border.' },
            mapUrl: 'https://maps.app.goo.gl/DKDA5yq93X3hYiUH7',
            distanceFromPrevKm: 90,
            lat: 24.7520,
            lon: 50.8517
        },
        {
            id: 'qa-sasco-khurais',
            badge: { ar: 'تبعد ~215 كم عن أبو سمرة', en: '~215 km from Abu Samra' },
            title: { ar: 'محطة ساسكو / طريق خريص', en: 'SASCO Station / Khurais Road' },
            gpsName: { ar: 'محطة ساسكو (طريق خريص)', en: 'SASCO Station (Khurais Road)' },
            desc: { ar: 'على طريق خريص (بعد الهفوف باتجاه الرياض).', en: 'On Khurais Road (after Hofuf, towards Riyadh).' },
            mapUrl: 'https://maps.app.goo.gl/innPYmtbPCw4yBsG6',
            distanceFromPrevKm: 215,
            lat: 25.3414,
            lon: 49.1312
        },
        {
            id: 'qa-jo-station',
            badge: { ar: 'تبعد ~170 كم عن ساسكو خريص', en: '~170 km from SASCO Khurais' },
            title: { ar: 'محطة جو ستيشن', en: 'GO Station' },
            gpsName: { ar: 'محطة جو ستيشن (طريق 40)', en: 'GO Station (Highway 40)' },
            desc: {
                ar: 'بعد التقاء طريق خريص مع طريق الدمام - الرياض السريع (طريق 40 / 80M).',
                en: 'After Khurais Road joins the Dammam–Riyadh expressway (Highway 40 / 80M).'
            },
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            distanceFromPrevKm: 170,
            lat: 25.1351,
            lon: 47.5337
        },
        {
            id: 'qa-aldrees-riyadh-entry',
            badge: { ar: 'تبعد ~80 كم عن جو ستيشن', en: '~80 km from GO Station' },
            title: { ar: 'الدريس (مدخل الرياض)', en: 'Aldrees (Riyadh entrance)' },
            gpsName: { ar: 'بداية الرياض (الدريس)', en: 'Riyadh entrance (Aldrees)' },
            desc: {
                ar: 'محطة ممتازة للتزود بالوقود والتأكد من الجاهزية قبل دخول الرياض.',
                en: 'A great station to refuel and check everything before entering Riyadh.'
            },
            mapUrl: 'https://maps.app.goo.gl/AbU7P9gM571Gks2z7',
            distanceFromPrevKm: 80,
            lat: 24.8356,
            lon: 46.8333
        }
    ],

    returnSummaryTitle: { ar: '⛽ محطات طريق العودة (الرياض ← الدوحة)', en: '⛽ Return stations (Riyadh → Doha)' },
    returnIntroText: {
        ar: 'المحطات الموصى بها أثناء العودة من الرياض إلى منفذ سلوى والدوحة:',
        en: 'Recommended stations on the way back from Riyadh to the Salwa border and Doha:'
    },
    returnStations: [
        {
            id: 'qa-ret-adnoc',
            badge: { ar: 'بداية طريق الرياض - الدمام', en: 'Start of the Riyadh–Dammam road' },
            title: { ar: 'محطة أدنوك', en: 'ADNOC Station' },
            desc: { ar: 'من المحطات الكبرى والرئيسية عند الخروج من الرياض شرقاً.', en: 'One of the main large stations when leaving Riyadh eastbound.' },
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA'
        },
        {
            id: 'qa-ret-sasco',
            badge: { ar: 'تبعد ~67 كم عن المحطة السابقة', en: '~67 km from the previous station' },
            title: { ar: 'محطة ساسكو', en: 'SASCO Station' },
            desc: {
                ar: 'من المحطات الكبرى والرئيسية على طريق الرياض - الدمام السريع (طريق 40).',
                en: 'One of the main large stations on the Riyadh–Dammam expressway (Highway 40).'
            },
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6'
        },
        {
            id: 'qa-ret-aldrees-khurais',
            badge: { ar: 'تبعد ~105 كم عن المحطة السابقة', en: '~105 km from the previous station' },
            title: { ar: 'محطة الدريس', en: 'Aldrees Station' },
            desc: { ar: 'خدمات وقود واستراحة وتموينات على الطريق السريع.', en: 'Fuel, a rest area and a convenience store on the expressway.' },
            mapUrl: 'https://maps.app.goo.gl/9NnjRSQ9hupFi64r7'
        },
        {
            id: 'qa-ret-emtiyaz-salwa',
            badge: { ar: 'تبعد ~148 كم عن المحطة السابقة', en: '~148 km from the previous station' },
            title: { ar: 'امتياز الوقود', en: 'Imtiaz Fuel Station' },
            desc: { ar: 'محطة خدمات متكاملة على طريق الهفوف - سلوى قبل الحدود.', en: 'A full-service station on the Hofuf–Salwa road before the border.' },
            mapUrl: 'https://maps.app.goo.gl/SAk9jxJpcPTuBrQd8'
        },
        {
            id: 'qa-ret-abu-samra',
            badge: { ar: 'بعد عبور منفذ أبو سمرة', en: 'After crossing the Abu Samra border' },
            title: { ar: 'محطة وقود (أبو سمرة - قطر)', en: 'Fuel Station (Abu Samra – Qatar)' },
            desc: { ar: 'أول محطة وقود وخدمات بعد الدخول إلى أراضي دولة قطر.', en: 'The first fuel and services station after entering Qatar.' },
            mapUrl: 'https://maps.app.goo.gl/DKDA5yq93X3hYiUH7'
        }
    ]
};
