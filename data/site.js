/**
 * ترتيب ظهور الدول في الصفحة الرئيسية + بيانات صفحات «قريباً».
 *
 * - الدولة التي لها ملف في data/countries/ تُعتبر «فعّالة» تلقائياً: يُبنى دليلها الكامل
 *   وتُؤخذ بياناتها (الاسم والعلم) من ملفها، ويُتجاهل هنا كل ما عدا slug.
 * - الدولة التي ليس لها ملف تُبنى لها صفحة «قريباً» من الحقول أدناه.
 *   عنوان الصفحة يُولَّد من اسم الدولة، و heading اختياري لتخصيص العنوان الظاهر.
 *
 * لإضافة دولة جديدة: أنشئ ملفها في data/countries/ فقط. لا حاجة لأي تعديل هنا
 * ما دام الـ slug موجوداً في القائمة.
 */

module.exports = {
    countriesOrder: [
        { slug: 'qatar' },
        { slug: 'uae', countryName: { ar: 'الإمارات', en: 'UAE' }, flagFile: 'ae-flag.png' },
        { slug: 'bahrain' },
        { slug: 'kuwait', countryName: { ar: 'الكويت', en: 'Kuwait' }, flagFile: 'kw-flag.png' },
        {
            slug: 'oman',
            countryName: { ar: 'عُمان', en: 'Oman' },
            flagFile: 'om-flag.png',
            heading: { ar: 'دليل السفر البري من سلطنة عُمان إلى مكة المكرمة', en: 'Overland Travel Guide from Oman to Makkah' }
        },
        { slug: 'jordan', countryName: { ar: 'الأردن', en: 'Jordan' }, flagFile: 'jo-flag.png' },
        { slug: 'syria', countryName: { ar: 'سوريا', en: 'Syria' }, flagFile: 'sy-flag.png' },
        { slug: 'iraq', countryName: { ar: 'العراق', en: 'Iraq' }, flagFile: 'iq-flag.png' },
        { slug: 'yemen', countryName: { ar: 'اليمن', en: 'Yemen' }, flagFile: 'ye-flag.png' }
    ]
};
