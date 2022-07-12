import en from "i18n/en";
import ar from "i18n/ar";


const langauge = { en: en, ar: ar };



export const translate = (id) => {
  const lang = localStorage.getItem("lang") || "en";
  if ( lang && langauge[lang][id] ) {
    // console.log("langauge[lang][id]",langauge[lang][id]);
    return langauge[lang][id];
  }
  return id;
}


export const translateRes = (res) => {
  // console.log("translateRes :: res is", res);
  const lang = localStorage.getItem("lang") || "en";

  if ( typeof res === 'string' || res instanceof String ) {
    // console.log("translateRes if");
    // const key = langauge[lang][res];
    // console.log("key",key);
    return res;
  }
  else {
    // console.log("translateRes else", langauge, lang);

    const key = langauge[lang][res.key];
    if ( lang && key ) {
      // console.log("translateRes::lang, key ", lang, key);
      if ( res.parameters && res.parameters.length > 0 ) {
        const values = [];
        res && res.parameters && res.parameters.forEach( item => {
          if ( item.literal === true ) {
            values[item.index] = item.value;
          }
          else if ( item.literal === false ) {
            values[item.index] = translate(item.value)
          }
        });

        let output = key;

        // console.log("values",values);

        values && values.forEach( (val, index) => {
          output = output.replace(`[{${index}}]`, val);
        });

        // console.log("output",output);
        return output;

      } else {
        return key;
      }
    }
    return res.key;

  }


}


/*
// import { store } from "../index";


export const translate = (id) => {
  const lang = localStorage.getItem("lang");
  // const state = store.getState();
  // const lang = state.locale.lang;

  console.log("lang",lang);
  console.log("langauge",langauge);
  console.log("langauge[lang]",langauge[lang]);

  if ( lang && langauge[lang][id] ) {
    console.log("langauge[lang][id]",langauge[lang][id]);
    return langauge[lang][id];
  }


  return id;

}

*/
