/**
 * ترتيب ظهور الدول في الصفحة الرئيسية + بيانات صفحات «قريباً».
 *
 * - الدولة التي لها ملف في data/countries/ تُعتبر «فعّالة» تلقائياً: يُبنى دليلها الكامل
 *   وتُؤخذ بياناتها (الاسم والعلم) من ملفها، ويُتجاهل هنا كل ما عدا slug.
 * - الدولة التي ليس لها ملف تُبنى لها صفحة «قريباً» من الحقول أدناه.
 *
 * لإضافة دولة جديدة: أنشئ ملفها في data/countries/ فقط. لا حاجة لأي تعديل هنا
 * ما دام الـ slug موجوداً في القائمة.
 */

module.exports = {
    countriesOrder: [
        { slug: 'qatar' },
        {
            slug: 'ksa',
            countryName: 'السعودية',
            flagFile: 'sa-flag.png',
            pageTitle: 'دليل السفر البري من السعودية إلى مكة المكرمة',
            heading: 'دليل مسارات مدن المملكة إلى مكة المكرمة'
        },
        {
            slug: 'uae',
            countryName: 'الإمارات',
            flagFile: 'ae-flag.png',
            pageTitle: 'دليل السفر البري من الإمارات إلى مكة المكرمة',
            heading: 'دليل السفر البري من الإمارات إلى مكة المكرمة'
        },
        { slug: 'bahrain' },
        {
            slug: 'kuwait',
            countryName: 'الكويت',
            flagFile: 'kw-flag.png',
            pageTitle: 'دليل السفر البري من الكويت إلى مكة المكرمة',
            heading: 'دليل السفر البري من الكويت إلى مكة المكرمة'
        },
        {
            slug: 'oman',
            countryName: 'عُمان',
            flagFile: 'om-flag.png',
            pageTitle: 'دليل السفر البري من عُمان إلى مكة المكرمة',
            heading: 'دليل السفر البري من سلطنة عُمان إلى مكة المكرمة'
        },
        {
            slug: 'jordan',
            countryName: 'الأردن',
            flagFile: 'jo-flag.png',
            pageTitle: 'دليل السفر البري من الأردن إلى مكة المكرمة',
            heading: 'دليل السفر البري من الأردن إلى مكة المكرمة'
        },
        {
            slug: 'syria',
            countryName: 'سوريا',
            flagFile: 'sy-flag.png',
            pageTitle: 'دليل السفر البري من سوريا إلى مكة المكرمة',
            heading: 'دليل السفر البري من سوريا إلى مكة المكرمة'
        },
        {
            slug: 'iraq',
            countryName: 'العراق',
            flagFile: 'iq-flag.png',
            pageTitle: 'دليل السفر البري من العراق إلى مكة المكرمة',
            heading: 'دليل السفر البري من العراق إلى مكة المكرمة'
        },
        {
            slug: 'yemen',
            countryName: 'اليمن',
            flagFile: 'ye-flag.png',
            pageTitle: 'دليل السفر البري من اليمن إلى مكة المكرمة',
            heading: 'دليل السفر البري من اليمن إلى مكة المكرمة'
        }
    ]
};
