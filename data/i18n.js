/**
 * نصوص الواجهة بالعربية والإنجليزية.
 * - تستخدمها القوالب عبر t('key').
 * - المفاتيح التي تبدأ بـ «js.» تُحقن في الصفحة ليستخدمها js/app.js وقت التشغيل.
 * - {name} متغيّر يُستبدل عند العرض.
 */

module.exports = {
    'site.name': { ar: 'دليل السفر البري إلى مكة المكرمة', en: 'Road to Makkah Guide' },
    'manifest.shortName': { ar: 'طريق مكة 🕋', en: 'Road to Makkah 🕋' },
    'manifest.description': {
        ar: 'دليل رقمي تفاعلي للرحلات البرية ومحطات الوقود والراحة وحاسبة المسافات إلى مكة المكرمة',
        en: 'An interactive digital guide for overland trips to Makkah: routes, fuel and rest stops, and a distance calculator'
    },

    // الهيدر والأزرار العلوية
    'country.headerLogo': { ar: '{country} ← 🕋 مكة المكرمة', en: '{country} → 🕋 Makkah' },
    'common.lastUpdated': { ar: 'آخر تحديث: {date}', en: 'Last updated: {date}' },
    'action.home': { ar: 'الرئيسية (كل الدول)', en: 'Home (all countries)' },
    'action.theme': { ar: 'تغيير المظهر', en: 'Toggle theme' },
    'action.print': { ar: 'طباعة مسار الرحلة', en: 'Print the route' },
    'action.share': { ar: 'مشاركة الدليل', en: 'Share the guide' },
    'action.toggleAll': { ar: 'طي / فتح الكل', en: 'Collapse / expand all' },

    // شريط المعلومات
    'info.prayerLoading': { ar: 'مواقيت مكة: جاري التحديث...', en: 'Makkah prayer times: updating…' },
    'info.makkah': { ar: 'مكة المكرمة', en: 'Makkah' },
    'info.tempFallback': { ar: 'غير متاح', en: 'Unavailable' },

    // مراحل الرحلة (عناوين تجمع الأقسام حسب وقت الحاجة إليها)
    'phase.before': { ar: 'قبل السفر', en: 'Before you go' },
    'phase.road': { ar: 'في الطريق', en: 'On the road' },
    'phase.city': { ar: 'في مكة والمدينة', en: 'In Makkah and Madinah' },
    'phase.return': { ar: 'العودة', en: 'The way back' },

    // بطاقة «رحلتي الآن»
    'section.trip': { ar: '🧭 رحلتي الآن', en: '🧭 My trip now' },

    // الأدعية وقائمة الفحص
    'section.prayers': { ar: '🤲 أدعية وأذكار السفر', en: '🤲 Travel supplications' },
    'section.checklist': { ar: '✅ قائمة الفحص الذكية قبل السفر', en: '✅ Smart pre-trip checklist' },
    'checklist.progress': { ar: 'مدى جاهزيتك للرحلة', en: 'Your trip readiness' },
    'checklist.selectAll': { ar: '✅ تحديد الكل', en: '✅ Select all' },
    'checklist.deselectAll': { ar: '❌ إلغاء تحديد الكل', en: '❌ Clear all' },

    // الحاسبة
    'section.calculator': { ar: '⏱️ حاسبة وقت الوصول وتكلفة الوقود', en: '⏱️ Arrival time and fuel cost calculator' },
    'calc.departure': { ar: 'توقيت الانطلاق', en: 'Departure time' },
    'calc.distance': { ar: 'المسافة المقدرة', en: 'Estimated distance' },
    'calc.arrival': { ar: 'وقت الوصول المتوقع (شامل التوقفات)', en: 'Expected arrival (including stops)' },
    'calc.location': { ar: 'الموقع الحالي (GPS)', en: 'Current location (GPS)' },
    'calc.remaining': { ar: 'المسافة المتبقية لمكة', en: 'Distance left to Makkah' },
    'calc.arrivalFromHere': { ar: 'وقت الوصول من موقعك*', en: 'Arrival from your location*' },
    'calc.netTime': { ar: '*الزمن الصافي: {time} قيادة', en: '*Net driving time: {time}' },
    'calc.fuelDistance': { ar: 'المسافة لحساب الوقود (كم)', en: 'Distance for fuel (km)' },
    'calc.fuelRate': { ar: 'استهلاك السيارة (لتر/100كم)', en: 'Consumption (L/100 km)' },
    'calc.fuelPrice': { ar: 'سعر اللتر (ريال)', en: 'Price per litre (SAR)' },
    'calc.fuelResult': { ar: 'الوقود والتكلفة التقديرية', en: 'Estimated fuel and cost' },
    'calc.start': { ar: '📍 ابدأ الملاحة المباشرة إلى مكة المكرمة', en: '📍 Start navigation to Makkah' },
    'unit.km': { ar: 'كم', en: 'km' },
    'unit.sar': { ar: 'ريال', en: 'SAR' },
    'unit.liter': { ar: 'لتر', en: 'L' },

    // المسارات والمحطات
    'section.routes': { ar: '🛣️ خيارات مسارات السفر البري', en: '🛣️ Overland route options' },
    'route.itinerary': { ar: 'خط السير:', en: 'Itinerary:' },
    'route.distance': { ar: 'المسافة: {km} كم', en: 'Distance: {km} km' },
    'route.start': { ar: '📍 بدء الرحلة', en: '📍 Start trip' },
    'route.switchLabel': { ar: 'مسار رحلتك:', en: 'Your route:' },
    'route.use': { ar: '✔ اعتماد هذا المسار', en: '✔ Use this route' },
    'station.mapBtn': { ar: '🗺️ موقع المحطة', en: '🗺️ Station location' },
    'section.riyadhMain': { ar: '⛽ محطات مدينة الرياض - طريق 40 (80M الرئيسي)', en: '⛽ Riyadh city stations – Highway 40 (main, 80M)' },
    'section.riyadhBypass': { ar: '⛽ محطات مدينة الرياض - مسار التفافي (طريق الملك سلمان)', en: '⛽ Riyadh city stations – bypass (King Salman Road)' },
    'section.riyadhBypassIntro': { ar: 'يُستخدم هذا المسار للابتعاد عن زحام وسط المدينة خلال أوقات الذروة.', en: 'Use this route to avoid city-centre traffic at peak hours.' },
    'section.riyadhToMakkah': { ar: '⛽ محطات طريق الذهاب (الرياض ← الطائف ← مكة)', en: '⛽ Outbound stations (Riyadh → Taif → Makkah)' },
    'section.miqatNote': {
        ar: '🕋 الميقات على هذا الطريق: السيل الكبير (قرن المنازل)، وهو آخر محطة في هذه القائمة. من نوى العمرة يُحرم منه قبل تجاوزه.',
        en: '🕋 The miqat on this road is As-Sayl Al-Kabir (Qarn al-Manazil), the last station in this list. If you intend Umrah, enter ihram there before passing it.'
    },
    'section.madinahReturn': { ar: '⛽ محطات طريق العودة (المدينة المنورة ← الرياض)', en: '⛽ Return stations (Madinah → Riyadh)' },
    'section.madinahReturnIntro': { ar: 'المحطات النموذجية الموصى بها على طريق الهجرة - القصيم - الرياض السريع:', en: 'Recommended model stations on the Hijrah – Qassim – Riyadh expressway:' },

    // الأقسام المشتركة
    'section.roadTips': { ar: '⚠️ نصائح الطريق والسلامة', en: '⚠️ Road tips and safety' },
    'section.cityInfo': { ar: '🏨 الإقامة والتنقل في مكة والمدينة', en: '🏨 Staying and getting around in Makkah and Madinah' },
    'section.places': { ar: '🕌 الأماكن التاريخية والدينية للزيارة', en: '🕌 Historical and religious places to visit' },
    'section.apps': { ar: 'تطبيقات وروابط مهمة', en: 'Important apps and links' },
    'app.onGooglePlay': { ar: '{name} على Google Play', en: '{name} on Google Play' },
    'app.onAppStore': { ar: '{name} على App Store', en: '{name} on the App Store' },
    'app.website': { ar: 'الموقع الإلكتروني', en: 'Website' },
    'app.websiteOf': { ar: 'موقع {name}', en: '{name} website' },

    // الطوارئ
    'section.emergency': { ar: '📞 أرقام الطوارئ (اضغط على الرقم للاتصال المباشر)', en: '📞 Emergency numbers (tap a number to call)' },
    'country.saudi': { ar: 'السعودية', en: 'Saudi Arabia' },
    'emergency.local': { ar: 'في {country} (طوارئ عامة)', en: 'In {country} (general emergency)' },
    'emergency.callLocal': { ar: 'اتصال بطوارئ {country} {number}', en: 'Call {country} emergency {number}' },
    'emergency.saudiRoad': { ar: 'في السعودية (أمن الطرق)', en: 'In Saudi Arabia (road security)' },
    'emergency.callRoad': { ar: 'اتصال بأمن الطرق 911', en: 'Call road security 911' },
    'emergency.redCrescent': { ar: 'الهلال الأحمر (إسعاف)', en: 'Red Crescent (ambulance)' },
    'emergency.callAmbulance': { ar: 'اتصال بالإسعاف 997', en: 'Call ambulance 997' },
    'emergency.najm': { ar: 'نجم للحوادث (السعودية)', en: 'Najm for accidents (Saudi Arabia)' },
    'emergency.callNajm': { ar: 'اتصال بنجم للحوادث', en: 'Call Najm' },
    'emergency.najmNote': { ar: 'المنصة الوطنية لإدارة حوادث السير للمركبات المؤمنة', en: 'The national platform for handling traffic accidents of insured vehicles' },

    // نموذج الاقتراحات
    'section.suggestions': { ar: '💡 اقتراحاتك واستفساراتك', en: '💡 Suggestions and questions' },
    'suggest.intro': { ar: 'يسعدنا سماع رأيك أو أي تعديل تقترحه لتطوير هذا الدليل', en: 'We would love to hear your feedback or any change you suggest to improve this guide' },
    'suggest.fromPage': { ar: 'دليل {country} - مكة المكرمة', en: '{country} guide – Makkah' },
    'suggest.subject': { ar: 'اقتراح/استفسار من دليل {country} - مكة المكرمة 🕋', en: 'Suggestion/question from the {country} guide – Makkah 🕋' },
    'suggest.name': { ar: 'الاسم الكريم', en: 'Your name' },
    'suggest.namePh': { ar: 'مثال: محمد', en: 'e.g. Mohammed' },
    'suggest.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    'suggest.message': { ar: 'اقتراحك أو رسالتك', en: 'Your suggestion or message' },
    'suggest.messagePh': { ar: 'اكتب اقتراحك أو تفاصيل التعديل الذي ترغب بإضافته هنا...', en: 'Write your suggestion or the details of the change you would like here…' },
    'suggest.send': { ar: 'إرسال ✉️', en: 'Send ✉️' },

    // الفوتر وشريط الجوال
    'footer.greeting': { ar: 'عمرة مقبولة ورحلة آمنة بإذن الله 🕋', en: 'May your Umrah be accepted and your journey safe, in sha Allah 🕋' },
    'footer.dua': { ar: 'تذكرونا بدعوة صالحة 🤲', en: 'Remember us in your prayers 🤲' },
    'footer.credit': { ar: 'تم تصميم الدليل بواسطة معاذ بلال', en: 'Guide designed by Moath Belal' },
    'nav.label': { ar: 'التنقل السريع للجوال', en: 'Quick navigation' },
    'nav.trip': { ar: 'رحلتي', en: 'My trip' },
    'nav.stations': { ar: 'المحطات', en: 'Stations' },
    'nav.city': { ar: 'مكة والمدينة', en: 'Makkah' },
    'nav.more': { ar: 'المزيد', en: 'More' },
    'nav.emergency': { ar: 'الطوارئ', en: 'Emergency' },
    'nav.stationsSheet': { ar: 'اختر مقطع الطريق', en: 'Choose a road section' },
    'nav.moreSheet': { ar: 'بقية أقسام الدليل', en: 'More sections' },
    'nav.close': { ar: 'إغلاق القائمة', en: 'Close menu' },
    'nav.youAreHere': { ar: '📍 أنت هنا', en: '📍 You are here' },

    // الصفحة الرئيسية
    'home.description': {
        ar: 'دليل السفر البري الشامل إلى مكة المكرمة من دول الخليج والدول العربية المجاورة: مسارات الطرق، محطات الوقود، حاسبة المسافات، وقائمة الفحص.',
        en: 'A complete overland travel guide to Makkah from the Gulf and neighbouring Arab countries: routes, fuel stations, distance calculator and a pre-trip checklist.'
    },
    'home.weatherLoading': { ar: 'مكة المكرمة: جاري جلب الطقس... ⏳', en: 'Makkah: loading weather… ⏳' },
    'home.weatherFormat': { ar: 'مكة المكرمة الآن: {t}°C 🌤️', en: 'Makkah now: {t}°C 🌤️' },
    'home.weatherFallback': { ar: 'مكة المكرمة 🕋', en: 'Makkah 🕋' },
    'home.soon': { ar: 'قريباً', en: 'Soon' },
    'home.apps': { ar: 'تطبيقات مهمة', en: 'Important apps' },
    'home.faq': { ar: '💡 أسئلة شائعة للمسافر براً', en: '💡 FAQ for overland travellers' },
    'home.faq1q': { ar: 'هل الطرق السريعة المؤدية إلى مكة مخدومة بالكامل؟', en: 'Are the expressways to Makkah fully serviced?' },
    'home.faq1a': {
        ar: 'نعم، الطرق الرئيسية مثل طريق 40 السعودي (طريق 80M الدولي من الخليج عبر الرياض إلى الطائف ومكة) وطريق الهجرة السريع تضم محطات نموذجية متكاملة على مدار الساعة، مع ضرورة الحذر عند القيادة ليلاً.',
        en: 'Yes. The main roads, such as Saudi Highway 40 (international route 80M from the Gulf through Riyadh to Taif and Makkah) and the Hijrah expressway, have full-service model stations open around the clock. Still, take care when driving at night.'
    },
    'home.faq2q': { ar: 'هل يعمل الدليل على الطريق في حال انقطاع الإنترنت؟', en: 'Does the guide work on the road without internet?' },
    'home.faq2a': {
        ar: 'نعم، بمجرد فتح صفحة دولتك مرة واحدة، يحفظ المتصفح جميع المحطات وحاسبة الوقود وقائمة الفحص للعمل دون اتصال (Offline).',
        en: 'Yes. Once you open your country page a single time, the browser saves all stations, the fuel calculator and the checklist so they work offline.'
    },
    'home.share': { ar: 'مشاركة الصفحة', en: 'Share this page' },

    // صفحات «قريباً»
    'soon.titleDefault': { ar: 'دليل السفر البري من {country} إلى مكة المكرمة', en: 'Overland Travel Guide from {country} to Makkah' },
    'soon.description': { ar: '{heading} — قريباً ضمن دليل السفر البري الشامل إلى مكة المكرمة.', en: '{heading} — coming soon as part of the Overland Travel Guide to Makkah.' },
    'soon.text': { ar: 'جاري العمل على إعداد وتدقيق محطات ومسارات هذا الدليل ليظهر بأفضل صورة قريباً بإذن الله.', en: 'We are preparing and verifying the stations and routes of this guide. It will be available soon, in sha Allah.' },
    'soon.home': { ar: '🏠 العودة للرئيسية', en: '🏠 Back to home' },
    'soon.browse': { ar: 'تصفح دليل {country}', en: 'Browse the {country} guide' },

    // ===== نصوص وقت التشغيل (js/app.js) =====
    'js.locale': { ar: 'ar-u-nu-latn', en: 'en-US' },
    'js.captchaLang': { ar: 'ar', en: 'en' },
    'js.selectDeparture': { ar: 'حدد وقت الانطلاق', en: 'Select a departure time' },
    'js.km': { ar: 'كم', en: 'km' },
    'js.sar': { ar: 'ريال', en: 'SAR' },
    'js.liter': { ar: 'لتر', en: 'L' },
    'js.timeHM': { ar: '{h} ساعة و {m} دقيقة', en: '{h} h {m} min' },
    'js.timeH': { ar: '{h} ساعة', en: '{h} h' },
    'js.timeM': { ar: '{m} دقيقة', en: '{m} min' },
    'js.themeToDark': { ar: 'تفعيل المظهر الداكن', en: 'Switch to dark theme' },
    'js.themeToLight': { ar: 'تفعيل المظهر النهاري', en: 'Switch to light theme' },
    'js.prayerLine1': { ar: 'الفجر {a} | الشروق {b}', en: 'Fajr {a} | Sunrise {b}' },
    'js.prayerLine2': { ar: 'المغرب {a} | العشاء {b}', en: 'Maghrib {a} | Isha {b}' },
    'js.am': { ar: 'ص', en: 'AM' },
    'js.pm': { ar: 'م', en: 'PM' },
    'js.prayerOffline1': { ar: 'مواقيت الصلاة بمكة المكرمة', en: 'Makkah prayer times' },
    'js.prayerOffline2': { ar: 'تتطلب اتصالاً بالإنترنت', en: 'need an internet connection' },
    'js.gpsBetween': { ar: 'بين {a} و{b}', en: 'Between {a} and {b}' },
    'js.gpsLocate': { ar: '📍 حدّد موقعي الآن', en: '📍 Locate me now' },
    'js.gpsStop': { ar: '⏹️ إيقاف التتبّع', en: '⏹️ Stop tracking' },
    'js.gpsLocating': { ar: 'جاري تحديد الموقع...', en: 'Locating…' },
    'js.gpsOffRoute': { ar: 'خارج المسار (أقرب نقطة: {n})', en: 'Off route (nearest point: {n})' },
    'js.gpsFailed': { ar: '{city} (تعذر جلب GPS)', en: '{city} (GPS unavailable)' },
    'js.gpsUnsupported': { ar: 'المتصفح لا يدعم GPS', en: 'This browser does not support GPS' },
    'js.shareText': { ar: 'تذكرونا بدعوة صالحة 🤲', en: 'Remember us in your prayers 🤲' },
    'js.copied': { ar: '✅ تم نسخ العنوان والرابط بنجاح!\nيمكنك الآن لصقه ومشاركته مع من تحب.', en: '✅ Title and link copied!\nYou can now paste and share them.' },
    'js.copyFailed': { ar: 'تعذر النسخ التلقائي. يرجى نسخ الرابط من شريط المتصفح يدوياً.', en: 'Could not copy automatically. Please copy the link from the address bar.' },
    'js.formNoKey': { ar: '⚠️ الرجاء تهيئة مفتاح الوصول الخاص بـ Web3Forms في الكود أولاً.', en: '⚠️ Please configure the Web3Forms access key in the code first.' },
    'js.formNoMessage': { ar: '⚠️ الرجاء كتابة الاقتراح أو الاستفسار أولاً.', en: '⚠️ Please write your suggestion or question first.' },
    'js.formNoCaptcha': { ar: '⚠️ الرجاء التحقق من اختبار الكابتشا (أنا لست برنامج روبوت) أولاً.', en: '⚠️ Please complete the captcha (I am not a robot) first.' },
    'js.formSending': { ar: 'جاري الإرسال...', en: 'Sending…' },
    'js.formSuccess': { ar: '✅ تم إرسال اقتراحك بنجاح! شكراً جزيلاً لك على مشاركتنا رأيك لتطوير الدليل.', en: '✅ Your suggestion was sent. Thank you for helping us improve the guide.' },
    'js.formError': { ar: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى لاحقاً.', en: 'Something went wrong while sending. Please try again later.' },
    'js.formNetwork': { ar: '❌ عذراً، تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.', en: '❌ Sorry, the server could not be reached. Check your internet connection and try again.' }
};
