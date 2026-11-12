/**
 * بيانات دليل السفر البري من مملكة البحرين إلى مكة المكرمة
 *
 * المسافات: distanceFromPrevKm هي المصدر الوحيد. المسافة المتبقية لكل محطة ونقاط GPS
 * وتكلفة الوقود تُحسب آلياً في build.js، ويفشل البناء إن لم يطابق مجموع المقاطع totalDistanceKm.
 * النصوص المعروضة بصيغة { ar, en }.
 *
 * - المحطات تبدأ من أول محطة داخل السعودية (الدريس - الخبر) بعد منفذ الجسر.
 * - الدريس (طريق العودة): إحداثيات محطة موثّقة في OpenStreetMap وواقعة على المسار، ورابطها دبوس
 *   على الإحداثيات إلى أن يتوفر رابط المكان في خرائط Google.
 */

module.exports = {
    slug: 'bahrain',
    countryCode: 'bh',
    countryName: { ar: 'البحرين', en: 'Bahrain' },
    defaultCity: { ar: 'المنامة (افتراضي)', en: 'Manama (default)' },
    flagFile: 'bh-flag.png',
    // ألوان الهوية البصرية (الأحمر البحريني)
    themeColor: '#CE1126',
    themeColorRgb: '206, 17, 38',
    themeColorDark: '#8F0B1A',
    totalDistanceKm: 1348,
    estimatedDriveHours: 14.5,
    nationalIdLabel: { ar: 'البطاقة الشخصية البحرينية (CPR)', en: 'Bahraini ID card (CPR)' },
    emergencyNumber: '999',
    metaDescription: {
        ar: 'دليل السفر البري من مملكة البحرين إلى مكة المكرمة عبر جسر الملك فهد: حاسبة المسافات والوقود، محطات التوقف، قائمة الفحص الذكية، وأرقام الطوارئ.',
        en: 'Overland travel guide from Bahrain to Makkah via the King Fahd Causeway: distance and fuel calculator, fuel stops, smart checklist and emergency numbers.'
    },
    pageTitle: { ar: 'دليل السفر البري من البحرين إلى مكة المكرمة', en: 'Overland Travel Guide from Bahrain to Makkah' },
    printHeaderTitle: { ar: 'مسار الرحلة البرية من البحرين إلى مكة المكرمة 🕋', en: 'Overland route from Bahrain to Makkah 🕋' },
    printHeaderSubtitle: {
        ar: 'دليل رقمي لتخطيط مسارات السفر البري عبر جسر الملك فهد ومحطات الوقود والراحة 2026',
        en: 'A digital guide for planning overland routes via the King Fahd Causeway, fuel and rest stops 2026'
    },
    headerSubtitle: {
        ar: 'دليل رقمي متكامل للرحلات البرية عبر جسر الملك فهد وصولاً إلى الحرم المكي الشريف.',
        en: 'A complete digital guide for overland trips via the King Fahd Causeway to Al-Masjid Al-Haram.'
    },
    camelWarningText: {
        ar: 'يرجى توخي أقصى درجات الحيطة والحذر من الجمال السائبة خاصة في الليل والصباح الباكر على امتداد الطريق بعد القويعية وحتى منطقة الطائف.',
        en: 'Watch out for stray camels, especially at night and in the early morning, along the road from Al Quwayiyah to the Taif area.'
    },

    // نقطة الانطلاق (بداية مسار GPS)
    origin: { name: { ar: 'الانطلاق (المنامة)', en: 'Start (Manama)' }, lat: 26.2235, lon: 50.5876 },

    extraApps: [
        {
            id: 'jesr',
            title: { ar: 'جسر (JESR - جسر الملك فهد)', en: 'JESR (King Fahd Causeway)' },
            desc: {
                ar: 'لدفع رسوم عبور الجسر، وتأمين المركبة، ومعرفة حالة الازدحام مباشرة',
                en: 'To pay the causeway toll, insure your vehicle and check live traffic'
            },
            iconEmoji: '🌉',
            playUrl: 'https://play.google.com/store/apps/details?id=com.kfca.sa.jesr',
            appleUrl: 'https://apps.apple.com/bh/app/jesr-%D8%AC%D8%B3%D8%B1/id1482105365',
            webUrl: 'https://kfca.sa'
        }
    ],

    routes: [
        {
            title: { ar: 'طريق 40 السريع (طريق 80M - المسار الرئيسي)', en: 'Highway 40 (Route 80M – main route)' },
            itinerary: {
                ar: 'المنامة ← جسر الملك فهد ← الدمام/الظهران ← طريق 40 السريع ← الرياض ← القويعية ← ظلم ← الطائف ← مكة المكرمة.',
                en: 'Manama → King Fahd Causeway → Dammam/Dhahran → Highway 40 → Riyadh → Al Quwayiyah → Dhalm → Taif → Makkah.'
            },
            description: {
                ar: 'المسار المباشر والأكثر أماناً، مضاء في معظمه ويحتوي على أحدث المحطات النموذجية (ساسكو والدريس).',
                en: 'The direct and safest route, lit for most of its length, with the newest model stations (SASCO and Aldrees).'
            },
            distanceKm: 1348,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&dir_action=navigate'
        },
        {
            title: { ar: 'مسار التفافي حول الرياض', en: 'Riyadh bypass route' },
            itinerary: {
                ar: 'المنامة ← جسر الملك فهد ← طريق الدمام السريع (طريق 40) ← طريق الملك سلمان (الدائري الشمالي الجديد) للربط مع طريق الحجاز.',
                en: 'Manama → King Fahd Causeway → Dammam expressway (Highway 40) → King Salman Road (the new northern ring road) to join the Hejaz road.'
            },
            description: {
                ar: 'يُنصح به لتجاوز زحام وسط العاصمة الرياض في ساعات الذروة (7 صباحاً - 5 عصراً).',
                en: 'Recommended to avoid central Riyadh traffic at peak hours (7 am – 5 pm).'
            },
            distanceKm: 1378,
            mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Makkah,+Saudi+Arabia&waypoints=طريق+الملك+سلمان+الرياض&dir_action=navigate'
        }
    ],

    outboundSummaryTitle: { ar: '⛽ محطات طريق الذهاب (المنامة ← الرياض)', en: '⛽ Outbound stations (Manama → Riyadh)' },
    outboundStations: [
        {
            id: 'bh-causeway-border',
            badge: { ar: 'في منتصف الجسر (الحدود)', en: 'Mid-causeway (the border)' },
            title: { ar: 'استراحة ومنفذ جسر الملك فهد', en: 'King Fahd Causeway rest area and border' },
            gpsName: { ar: 'منفذ جسر الملك فهد', en: 'King Fahd Causeway border' },
            desc: {
                ar: 'إنهاء إجراءات الجوازات والجمارك والتأمين، وتتوفر بها مساجد ومطاعم واستراحات.',
                en: 'Passport, customs and insurance procedures; mosques, restaurants and rest areas are available.'
            },
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=King+Fahd+Causeway+Passport+Control',
            btnLabel: { ar: '🗺️ موقع المنفذ', en: '🗺️ Border location' },
            distanceFromPrevKm: 35,
            lat: 26.1856,
            lon: 50.3267
        },
        {
            id: 'bh-aldrees-khobar',
            badge: { ar: 'تبعد ~17 كم عن منفذ الجسر', en: '~17 km from the causeway border' },
            title: { ar: 'محطة الدريس (الخبر)', en: 'Aldrees Station (Khobar)' },
            desc: {
                ar: 'أول محطة وقود داخل السعودية بعد عبور جسر الملك فهد.',
                en: 'The first fuel station inside Saudi Arabia after crossing the King Fahd Causeway.'
            },
            mapUrl: 'https://maps.app.goo.gl/DUCZ1EP62NpFV8raA',
            distanceFromPrevKm: 17,
            lat: 26.2157,
            lon: 50.1793
        },
        {
            id: 'bh-sasco-dammam-hwy',
            badge: { ar: 'تبعد ~51 كم عن الدريس الخبر', en: '~51 km from Aldrees Khobar' },
            title: { ar: 'محطة ساسكو (طريق الدمام - الرياض)', en: 'SASCO Station (Dammam–Riyadh road)' },
            desc: {
                ar: 'أولى المحطات النموذجية الكبرى بعد الخبر والدمام على بداية طريق 40 (80M) السريع.',
                en: 'The first large model station after Khobar and Dammam, at the start of Highway 40 (80M).'
            },
            mapUrl: 'https://maps.app.goo.gl/CeuVgcqAbNP4rwV58',
            distanceFromPrevKm: 51,
            lat: 26.2904,
            lon: 49.7868
        },
        {
            id: 'bh-jo-station',
            badge: { ar: 'تبعد ~265 كم عن محطة ساسكو', en: '~265 km from SASCO station' },
            title: { ar: 'محطة جو ستيشن', en: 'GO Station' },
            gpsName: { ar: 'محطة جو ستيشن (طريق 40)', en: 'GO Station (Highway 40)' },
            desc: {
                ar: 'محطة حديثة ومتكاملة على طريق الدمام - الرياض السريع (طريق 40 / 80M) قبل الرياض بنحو 80 كم.',
                en: 'A modern full-service station on the Dammam–Riyadh expressway (Highway 40 / 80M), about 80 km before Riyadh.'
            },
            mapUrl: 'https://maps.app.goo.gl/HPuPhAP7GZSLiY5c6',
            distanceFromPrevKm: 265,
            lat: 25.1351,
            lon: 47.5337
        },
        {
            id: 'bh-aldrees-riyadh-entry',
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

    returnSummaryTitle: { ar: '⛽ محطات طريق العودة (الرياض ← المنامة)', en: '⛽ Return stations (Riyadh → Manama)' },
    returnIntroText: {
        ar: 'المحطات الموصى بها أثناء العودة من الرياض عبر طريق 40 (80M) السريع إلى جسر الملك فهد والمنامة:',
        en: 'Recommended stations on the way back from Riyadh via Highway 40 (80M) to the King Fahd Causeway and Manama:'
    },
    returnStations: [
        {
            id: 'bh-ret-adnoc',
            badge: { ar: 'بداية طريق الرياض - الدمام', en: 'Start of the Riyadh–Dammam road' },
            title: { ar: 'محطة أدنوك', en: 'ADNOC Station' },
            desc: { ar: 'من المحطات الكبرى والرئيسية عند الخروج من الرياض شرقاً.', en: 'One of the main large stations when leaving Riyadh eastbound.' },
            mapUrl: 'https://maps.app.goo.gl/FojQ3PxaBSpgpBydA'
        },
        {
            id: 'bh-ret-sasco',
            badge: { ar: 'تبعد ~67 كم عن المحطة السابقة', en: '~67 km from the previous station' },
            title: { ar: 'محطة ساسكو', en: 'SASCO Station' },
            desc: {
                ar: 'من المحطات الكبرى والرئيسية على طريق الرياض - الدمام السريع (طريق 40).',
                en: 'One of the main large stations on the Riyadh–Dammam expressway (Highway 40).'
            },
            mapUrl: 'https://maps.app.goo.gl/5DjKtLpzV2yLEQhu6'
        },
        {
            // إحداثيات محطة الدريس موثّقة في OpenStreetMap وواقعة على طريق الرياض - الدمام
            id: 'bh-ret-aldrees-dammam-hwy',
            badge: { ar: 'تبعد ~175 كم عن المحطة السابقة', en: '~175 km from the previous station' },
            title: { ar: 'محطة الدريس', en: 'Aldrees Station' },
            desc: {
                ar: 'خدمات وقود واستراحة وتموينات على طريق الرياض - الدمام السريع (طريق 40).',
                en: 'Fuel, a rest area and a convenience store on the Riyadh–Dammam expressway (Highway 40).'
            },
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=25.9310%2C49.0065'
        },
        {
            id: 'bh-ret-causeway',
            badge: { ar: 'الخبر ← المنامة', en: 'Khobar → Manama' },
            title: { ar: 'استراحة ومنفذ جسر الملك فهد', en: 'King Fahd Causeway rest area and border' },
            desc: {
                ar: 'إنهاء إجراءات العودة عبر جسر الملك فهد والدخول إلى أراضي مملكة البحرين.',
                en: 'Complete the return procedures at the King Fahd Causeway and enter Bahrain.'
            },
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=King+Fahd+Causeway+Passport+Control',
            btnLabel: { ar: '🗺️ موقع المنفذ', en: '🗺️ Border location' }
        }
    ]
};
