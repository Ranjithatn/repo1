// locale file
import moment from 'moment-hijri';


// import { store } from '../../index';
// const locale = store.getState().locale;
// console.log("HIJRI:  locale",locale);

// const symbolMap = {
//   '1': '١',
//   '2': '٢',
//   '3': '٣',
//   '4': '٤',
//   '5': '٥',
//   '6': '٦',
//   '7': '٧',
//   '8': '٨',
//   '9': '٩',
//   '0': '٠'
// };

// const numberMap = {
//   '١': '1',
//   '٢': '2',
//   '٣': '3',
//   '٤': '4',
//   '٥': '5',
//   '٦': '6',
//   '٧': '7',
//   '٨': '8',
//   '٩': '9',
//   '٠': '0'
// };


// let weekdaysShort = [];
// if ( locale.lang !== "en" ) {
//   weekdaysShort ='Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
// } else {
//   weekdaysShort = 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_');
// }




moment.locale('ar-SA', {
  // months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  // weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),

  // months: `Muharram_Safar_Rabiul-Awwal_Rabi-uthani_Jumadi-ul-Awwal_Jumadi-uthani_Rajab_Sha’ban_Ramadan_Shawwal_Zhul-Q’ada_Zhul-Hijja`.split('_'),
  months: `Muharram_Safar_Rabi' al-Awwal_Rabi' al-Thani_Jumada al-Ula_Jumada al-Alkhirah_Rajab_Sha’ban_Ramadhan_Shawwal_Thul-Qi’dah_Thul-Hijjah`.split('_'),
  weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  // weekdaysShort : weekdaysShort,


  weekdaysParseExact : true,
  longDateFormat : {
      LT : 'HH:mm',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D MMMM YYYY',
      LLL : 'D MMMM YYYY HH:mm',
      LLLL : 'dddd D MMMM YYYY HH:mm'
  },
  meridiemParse: /ص|م/,
  isPM : function (input) {
      return 'م' === input;
  },
  meridiem : function (hour, minute, isLower) {
      if (hour < 12) {
          return 'ص';
      } else {
          return 'م';
      }
  },
  calendar : {
      sameDay: '[اليوم على الساعة] LT',
      nextDay: '[غدا على الساعة] LT',
      nextWeek: 'dddd [على الساعة] LT',
      lastDay: '[أمس على الساعة] LT',
      lastWeek: 'dddd [على الساعة] LT',
      sameElse: 'L'
  },
  relativeTime : {
      future : 'في %s',
      past : 'منذ %s',
      s : 'ثوان',
      ss : '%d ثانية',
      m : 'دقيقة',
      mm : '%d دقائق',
      h : 'ساعة',
      hh : '%d ساعات',
      d : 'يوم',
      dd : '%d أيام',
      M : 'شهر',
      MM : '%d أشهر',
      y : 'سنة',
      yy : '%d سنوات'
  },
  // preparse: function (string) {
  //     return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
  //         return numberMap[match];
  //     }).replace(/،/g, ',');
  // },
  // postformat: function (string) {
  //     return string.replace(/\d/g, function (match) {
  //         return symbolMap[match];
  //     }).replace(/,/g, '،');
  // },
  week : {
      dow : 0, // Sunday is the first day of the week.
      doy : 6  // The week that contains Jan 1st is the first week of the year.
  }

});

