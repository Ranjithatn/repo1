import React, { Component } from "react";
import moment from "moment-hijri";
import "./style.scss";
import { store } from "../../index";
import { reg_numeric } from "../../utils/regEx";
import "./locale";
const dateReg = /^[0-9/]*$/;

export class HijriDatePicker extends Component {
  constructor(props) {
    super(props);
    const format = "iDD/iMM/iYYYY"; // default date format
    let date = null;
console.log("props.value", props.value);
    if (props.value ) {
      
      // date = moment.unix(props.value).format(format);
      date = moment(props.value * 1000).format(format);
    } else {
      // date = moment().format(format);
      date = moment(new Date())
        .localeData()
        .longDateFormat("L")
        .toLowerCase();
    }

    console.log("HijriDatePicker::DATE", date);

    this.state = {
      today: "",
      selected: false,
      popup: false,
      moment: moment(),
      format: format
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCalendarClose = this.handleCalendarClose.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.setTodaysDate = this.setTodaysDate.bind(this);
    this.addOneMonth = this.addOneMonth.bind(this);
    this.removeOneMonth = this.removeOneMonth.bind(this);
    this.checkIfDateIsValid = this.checkIfDateIsValid.bind(this);
  }

  componentWillMount() {
    const locale = store.getState().locale;
    // console.log("componentWillMount::locale",locale);
    this.updateMomentLang(locale);
  }
  componentWillUpdate(nextProps, nextState) {
    const locale = store.getState().locale;
    // console.log("componentWillUpdate::locale",locale);
    // console.log("componentWillUpdate::nextState.today",nextState.today);
    this.updateMomentLang(locale);
  }

  updateMomentLang(locale) {
    if (locale.lang === "en") {
      moment.locale("ar-SA", {
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        months: `Muharram_Safar_Rabi' al-Awwal_Rabi' al-Thani_Jumada al-Ula_Jumada al-Alkhirah_Rajab_Sha’ban_Ramadhan_Shawwal_Thul-Qi’dah_Thul-Hijjah`.split(
          "_"
        )
      });
    } else {
      moment.locale("ar-SA", {
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        months: `محرم_صفر_ربيع الاول_ربيع الآخر_جمادى الأولى_جمادى الآخرة_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة`.split('_')
        // months: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split(
        //   "_"
        // )
      });
    }
  }

  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }

  handleClick() {
    // attach/remove event handler
    if (!this.state.popup) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ popup: !this.state.popup });
  }

  handleChange(e) {
    // console.log("HijriDatePicker::handleChange::e.target.value",e.target.value);

    // this.setState({ today: e.target.value });

    let val = e.target.value;

    if ( val.indexOf('//') > -1 ) {
      return;
    }

    if (val.indexOf("/") > -1) {
      let splitted = val && val.split("/");
      if (splitted.length === 1) {
        if (splitted[0].length < 3) {
          if (e.target.value === "" || dateReg.test(e.target.value)) {
            this.setState({ today: e.target.value }, () => {});
            this.props.onChange(e.target.value);
            // console.log("1", this.state);
            this.checkIfDateIsValid(e.target.value);
          }
        }
      } else if (splitted.length === 2) {
        if (
          (splitted[1].length < 3 ||
            (splitted[1].length < 4 && splitted[1].indexOf("/") > -1)) &&
          splitted[1] < 13
        ) {
          if (e.target.value === "" || dateReg.test(e.target.value)) {
            this.setState({ today: e.target.value }, () => {});
            this.props.onChange(e.target.value);
            // console.log("1", this.state);
            this.checkIfDateIsValid(e.target.value);
          }
        }
      } else if (splitted.length === 3) {
        if (splitted[2].length < 5) {
          if (splitted[2].length === 4) {
            if (splitted[2] > 1355) {
              if (e.target.value === "" || dateReg.test(e.target.value)) {
                this.setState({ today: e.target.value }, () => {});
                this.props.onChange(e.target.value);
                // console.log("1", this.state);
                this.checkIfDateIsValid(e.target.value);
              }
            }
          } else {
            if (e.target.value === "" || dateReg.test(e.target.value)) {
              this.setState({ today: e.target.value }, () => {});
              this.props.onChange(e.target.value);
              // console.log("1", this.state);
              this.checkIfDateIsValid(e.target.value);
            }
          }
        }
      }
    } else if (val.length < 3 || (val.length < 4 && val.indexOf("/") > -1)) {
      if (e.target.value === "" || dateReg.test(e.target.value)) {
        this.setState({ today: e.target.value }, () => {});
        this.props.onChange(e.target.value);
        // console.log("1", this.state);
        this.checkIfDateIsValid(e.target.value);
      }
    }

    if ( val === "/" ) {
      this.setState({ today: '' });
    }

  }

  checkIfDateIsValid(date) {
    const splitted = date && date.split("/");

    const hasD = splitted[0] && splitted[0].indexOf("d") !== -1;
    const hasM = splitted[1] && splitted[1].indexOf("m") !== -1;
    const hasY = splitted[2] && splitted[2].indexOf("y") !== -1;

    if (
      !hasD &&
      !hasM &&
      !hasY &&
      splitted[2] && splitted[2].length === 4 &&
      splitted[1] && splitted[1].length === 2 &&
      splitted[0] && splitted[0].length === 2
    ) {
      // console.log("dateUpdated",dateUpdated);
      const dateUpdated = moment(date, this.state.format).format(
        this.state.format
      );

      this.setState({ today: dateUpdated }, () => {});
    }
  }

  // handleChange(e) {
  //  console.log("e.target.value",e.target.value);
  //    return;
  //  if ( moment(e.target.value, this.state.format).isValid() ) {
  //    const today = moment(e.target.value, this.state.format).format(this.state.format)
  //    this.setState({ today: today, selected: true });
  //  } else {
  //    console.log("date is invalid", e.target.value);
  //  }
  // }

  handleCalendarClose() {
    document.removeEventListener("click", this.handleOutsideClick, false);
    this.setState({ popup: false });
  }

  // this will set todays date as current date
  setTodaysDate() {
    const today = moment().format(this.state.format);
    this.setState({ today: today, selected: true });
    if (this.props.onChange) {
      this.props.onChange(today);
    }
    // this.handleCalendarClose();
  }

  // these will return current date details
  getCurrentDay() {
    return this.state.moment.format("iDD");
  }
  getCurrentMonth() {
    return this.state.moment.format("iMM");
  }
  getCurrentMonthName() {
    return moment.months()[this.getCurrentMonth() - 1];
  }
  getCurrentYear() {
    return this.state.moment.format("iYYYY");
  }
  getCurrentDaysInMonth() {
    return this.state.moment.iDaysInMonth();
  }

  // these will return details for the date user has selected.
  getSelectedDay() {
    return moment(this.state.today, this.state.format).format("iDD");
  }
  getSelectedMonth() {
    return moment(this.state.today, this.state.format).format("iMM");
  }
  getSelectedMonthName() {
    return moment.months()[this.getSelectedMonth() - 1];
  }
  getSelectedYear() {
    return moment(this.state.today, this.state.format).format("iYYYY");
  }
  getSelectedDaysInMonth() {
    return moment(this.state.today, this.state.format).iDaysInMonth();
  }

  // get the first day of month
  firstDayOfMonth() {
    return moment(this.state.today, this.state.format)
      .startOf("iMonth")
      .format("d");
  }

  // Helper components
  getWeekdays() {
    const weekDays = [];
    moment.weekdaysShort().map(day => {
      return weekDays.push(<td key={day}>{day}</td>);
    });
    return weekDays;
  }

  handleDayClick(day, month, year) {
    let today = "";
    if ( ! day || ! month || ! year ) {
      today = moment().format( this.state.format );
    } else {
      today = moment(`${day}/${month}/${year}`, this.state.format).format( this.state.format );
    }
    if ( today.indexOf('Invalid date') !== -1 ) {
      today = moment().format( this.state.format );
    }

    this.setState({ today: today, selected: true });
    if (this.props.onChange) {
      this.props.onChange(today);
    }
  }

  getWeeks() {
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <td key={i} className="emptySlot">
          {""}
        </td>
      );
    }

    const daysInMonth = [];
    let dimCount =
      this.getSelectedDaysInMonth() || this.getCurrentDaysInMonth();

    // add date handlers here
    for (let i = 1; i <= dimCount; i++) {
      // let className = ( i == this.getCurrentDay() ? 'day current-day' : 'day' );
      let className = "day";
      const month = this.state.selected
        ? this.getSelectedMonth()
        : this.getCurrentMonth();
      const year = this.state.selected
        ? this.getSelectedYear()
        : this.getCurrentYear();
      const date = this.state.selected
        ? this.getSelectedDay()
        : this.getCurrentDay();

      if (date == i) {
        className = `${className} selected-day`;
      }
      if (
        this.getCurrentMonth() == this.getSelectedMonth() &&
        i == this.getCurrentDay()
      ) {
        className = `${className} current-day`;
      }
      // console.log("datexxxxxxxxxx",date, i);

      daysInMonth.push(
        <td
          key={i + Math.random()}
          className={className}
          onClick={() => {
            this.handleDayClick(i, month, year);
          }}
        >
          <span>{i}</span>
        </td>
      );
    }

    const totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.map((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }

      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    let trElements = rows.map((d, i) => {
      return <tr key={Math.random() + d + i}>{d}</tr>;
    });

    return trElements;
  }

  // add a month to a date
  addOneMonth() {
    let date;
    if (this.state.selected && this.state.today) {
      date = moment(this.state.today, this.state.format).format(
        this.state.format
      );
    } else {
      date = moment().format(this.state.format);
    }

    let splitted = date && date.split("/");
    if (splitted[1] > 12) {
      splitted[1] = 1;
      splitted[2] = +splitted[2] + 1;
    } else {
      splitted[1] = +splitted[1] + 1;
    }

    const final = splitted.join("/");
    const finalDate = moment(final, this.state.format).format(
      this.state.format
    );
    this.setState({ today: finalDate, selected: true });
    if (this.props.onChange) {
      this.props.onChange(finalDate);
    }
  }

  // remove a month from a date
  removeOneMonth() {
    let date;
    if (this.state.selected && this.state.today) {
      date = moment(this.state.today, this.state.format).format(
        this.state.format
      );
    } else {
      date = moment().format(this.state.format);
    }

    let splitted = date && date.split("/");
    if (splitted[1] < 1) {
      splitted[1] = 12;
      splitted[2] = +splitted[2] - 1;
    } else {
      splitted[1] = +splitted[1] - 1;
    }

    const final = splitted.join("/");
    const finalDate = moment(final, this.state.format).format(
      this.state.format
    );
    this.setState({ today: finalDate, selected: true });
    if (this.props.onChange) {
      this.props.onChange(finalDate);
    }
  }

  render() {
    console.log("--------- this.state.today", this.state.today);
    console.log("--------- props value", this.props.value);
    return (
      <div className="hijri-datepicker">
        <input
          type="text"
          value={this.state.today?this.state.today:this.props.value?moment(this.props.value, this.state.format).format(
            this.state.format
          ):moment(new Date())
          .localeData()
          .longDateFormat("L")
          .toLowerCase()}
          disabled={
            this.props.disabled
              ? this.props.disabled === true
                ? true
                : false
              : false
          }
          onChange={this.handleChange}
          onClick={this.handleClick}
          className="hijri-datepicker-input input"
          placeholder="dd/mm/yyyy"
        />

        {this.state.popup && (
          <div
            className="hijri-datepicker-calendar"
            ref={node => {
              this.node = node;
            }}
          >
            <header>
              <div>
                <span className="month">
                  { this.state.selected
                    ? `${this.getSelectedMonthName() ? `${this.getSelectedMonthName()},` : ''}`
                    : `${this.getCurrentMonthName() ? `${this.getCurrentMonthName()},` : ''}`
                  }
                </span>
                <span className="year">
                  {this.state.selected
                    ? this.getSelectedYear()
                    : this.getCurrentYear()}
                </span>
              </div>
              <div>
                <button
                  onClick={() => {
                    this.removeOneMonth();
                  }}
                >
                  &lt;
                </button>
                <button onClick={this.setTodaysDate}>&middot;</button>
                <button
                  onClick={() => {
                    this.addOneMonth();
                  }}
                >
                  &gt;
                </button>
              </div>
            </header>

            <main>
              <table>
                <thead>
                  <tr>{this.getWeekdays()}</tr>
                </thead>
                <tbody>{this.getWeeks()}</tbody>
              </table>
            </main>
          </div>
        )}
      </div>
    );
  }
}

export default HijriDatePicker;
