export const reg_numric = /^[0-9\b]*$/;
export const reg_currency = /^\d+(?:\.\d{0,2})?$/;
//export const reg_currency = /^(?:\d{0,7})+(?:\.\d{0,2})?$/;
export const reg_alphanumric = /^[a-zA-Z0-9_ ]*$/;
export const reg_alpha = /^[a-zA-Z ]*$/;
export const reg_space = /($[a-z])|[A-Z][^A-Z]+/g;
export const reg_annotation = /([A-Z])/g;
