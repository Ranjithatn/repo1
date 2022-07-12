import React, { Fragment } from 'react';
import { store } from '../index';
import moment from "moment-hijri";
import "../components/HijriDatePicker/locale";



const DateComponent = (props) => {
  // console.log("DateComponent", props);

  let showTime = true;
  if ( props.time === false ) { showTime = false; }
  // console.log("props", props);
  // console.log("--------------------------");

  let gregorianDate = '';
  if ( props.gregorian && props.invalid ) {
    if ( props.validGreg ) {
      // gregorianDate = showTime ? moment(props.gregorian).format('DD/MM/YYYY hh:mm:ss') : moment(props.gregorian).format('DD/MM/YYYY');
      gregorianDate = showTime ? moment(props.gregorian).utc().utcOffset('+0300').format('DD/MM/YYYY HH:mm') : moment(props.gregorian).utc().utcOffset('+0300').format('DD/MM/YYYY');
    } else {
      gregorianDate = showTime ? moment(props.gregorian,'DD-MM-YYYY').utc().utcOffset('+0300').format('DD/MM/YYYY HH:mm') : moment(props.gregorian,'DD-MM-YYYY').utc().utcOffset('+0300').format('DD/MM/YYYY');
      // gregorianDate = showTime ? moment(props.gregorian,'DD-MM-YYYY').format('DD/MM/YYYY hh:mm:ss') : moment(props.gregorian,'DD-MM-YYYY').format('DD/MM/YYYY');
    }
  }
  else if ( props.gregorian && ! props.invalid ) {
    // gregorianDate = showTime ? moment(props.gregorian).format('DD/MM/YYYY hh:mm:ss') : moment(props.gregorian).format('DD/MM/YYYY');
    gregorianDate = showTime ? moment(props.gregorian).utc().utcOffset('+0300').format('DD/MM/YYYY HH:mm') : moment(props.gregorian).utc().utcOffset('+0300').format('DD/MM/YYYY');
  }


  return(
    <div>
      { moment(props.hijri, 'DD/MM/YYYY hh:mm:ss').add('3', 'hours').format('DD/MM/YYYY HH:mm') || '' }
      { gregorianDate && <Fragment><br />{ gregorianDate }</Fragment> }
    </div>
  );

}

export default DateComponent;

















export const formatServerDateTime = (timestamp) => {
	if ( ! timestamp ) { return; }
  // console.log("timestamp",timestamp, timestamp.length);
	const locale = store.getState().locale;

	if ( locale.lang !== "en" ) { return timestamp; }

	let splitted = timestamp && timestamp.split(' ');

	const ddmmyyyy = splitted[0] && splitted[0].split('');

	const date = ddmmyyyy[0]+ddmmyyyy[1];
	const month = ddmmyyyy[4]+ddmmyyyy[5];
	const year = ddmmyyyy[8]+ddmmyyyy[9]+ddmmyyyy[10]+ddmmyyyy[11];
	const ampm = ( splitted[2] == "ص" ? "AM" : "PM" );

  if ( timestamp.length <= 12 ) {
    return `${ date }/${ month }/${ year }`;
  }

	return `${ date }/${ month }/${ year } ${ splitted[1] } ${ ampm }`;
}


export const formatDate = ( date ) => {
  // console.log("formatDate::date",date);
  const formattedDate = moment(date).format('iDD/iMM/iYYYY HH:mm:ss');
  // console.log("date, formattedDate",date,formattedDate);

  if ( formattedDate && formattedDate.indexOf('NaN') !== -1 ) {
    return date;
  } else if ( formattedDate === "Invalid date" ) {
    const newdate = formatServerDateTime(date);
    // console.log("newdate", newdate);
    if ( newdate && newdate.indexOf('undefined') != -1 ) {
      return date;
    } else { return newdate; }
  }
  return formattedDate;
}



// store.subscribe(formatServerDateTime)

/*

  // const formattedDate = moment(date);
  // return formattedDate.format('iDD/iMM/iYYYY');
  // console.log("date", date);
  // console.log( "moment date", formattedDate );
  // console.log( "formattedDate", formattedDate.format('iDD/iMM/iYYYY') );

*/
