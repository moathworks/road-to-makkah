/**
 * بيانات الدول الثماني قيد الإعداد (قريباً) وترتيب ظهور جميع الدول في الصفحة الرئيسية
 */

module.exports = {
    homeCountriesOrder: [
        { slug: 'qatar', name: 'قطر', flag: 'qa-flag.png', featured: true, lazy: false },
        { slug: 'ksa', name: 'السعودية', flag: 'sa-flag.png', featured: false, lazy: false },
        { slug: 'uae', name: 'الإمارات', flag: 'ae-flag.png', featured: false, lazy: true },
        { slug: 'bahrain', name: 'البحرين', flag: 'bh-flag.png', featured: true, lazy: true },
        { slug: 'kuwait', name: 'الكويت', flag: 'kw-flag.png', featured: false, lazy: true },
        { slug: 'oman', name: 'عُمان', flag: 'om-flag.png', featured: false, lazy: true },
        { slug: 'jordan', name: 'الأردن', flag: 'jo-flag.png', featured: false, lazy: true },
        { slug: 'syria', name: 'سوريا', flag: 'sy-flag.png', featured: false, lazy: true },
        { slug: 'iraq', name: 'العراق', flag: 'iq-flag.png', featured: false, lazy: true },
        { slug: 'yemen', name: 'اليمن', flag: 'ye-flag.png', featured: false, lazy: true }
    ],

    upcomingPages: [
        {
            slug: 'ksa',
            countryCode: 'sa',
            countryName: 'السعودية',
            pageTitle: 'دليل السفر البري من السعودية إلى مكة المكرمة',
            heading: 'دليل مسارات مدن المملكة إلى مكة المكرمة'
        },
        {
            slug: 'uae',
            countryCode: 'ae',
            countryName: 'الإمارات',
            pageTitle: 'دليل السفر البري من الإمارات إلى مكة المكرمة',
            heading: 'دليل السفر البري من الإمارات إلى مكة المكرمة'
        },
        {
            slug: 'kuwait',
            countryCode: 'kw',
            countryName: 'الكويت',
            pageTitle: 'دليل السفر البري من الكويت إلى مكة المكرمة',
            heading: 'دليل السفر البري من الكويت إلى مكة المكرمة'
        },
        {
            slug: 'oman',
            countryCode: 'om',
            countryName: 'عُمان',
            pageTitle: 'دليل السفر البري من عُمان إلى مكة المكرمة',
            heading: 'دليل السفر البري من سلطنة عُمان إلى مكة المكرمة'
        },
        {
            slug: 'jordan',
            countryCode: 'jo',
            countryName: 'الأردن',
            pageTitle: 'دليل السفر البري من الأردن إلى مكة المكرمة',
            heading: 'دليل السفر البري من الأردن إلى مكة المكرمة'
        },
        {
            slug: 'syria',
            countryCode: 'sy',
            countryName: 'سوريا',
            pageTitle: 'دليل السفر البري من سوريا إلى مكة المكرمة',
            heading: 'دليل السفر البري من سوريا إلى مكة المكرمة'
        },
        {
            slug: 'iraq',
            countryCode: 'iq',
            countryName: 'العراق',
            pageTitle: 'دليل السفر البري من العراق إلى مكة المكرمة',
            heading: 'دليل السفر البري من العراق إلى مكة المكرمة'
        },
        {
            slug: 'yemen',
            countryCode: 'ye',
            countryName: 'اليمن',
            pageTitle: 'دليل السفر البري من اليمن إلى مكة المكرمة',
            heading: 'دليل السفر البري من اليمن إلى مكة المكرمة'
        }
    ]
};

