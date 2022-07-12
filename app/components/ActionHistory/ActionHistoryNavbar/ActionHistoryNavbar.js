import React, { Fragment } from "react";
import Select from "../../Select/Select";
import Button from "../../Button/Button";
import Input from "../../Input/Input"
import Navbar from "../../Navbar/Navbar";
import { NEW_ACTION } from "../../Modal/ModalRoot";
import "./ActionHistoryNavbar.scss";
const val = [
  { value: "one", displayName: "one" },
  { value: "two", displayName: "two" }
];

const ActionHistoryNavbar = ({
  requestShowModal,
  filter,
  formatMessage,
  requestInputFieldChanged,
  requestRemoveFilter,
  requestShowFilteredData,
  requestCloseActionFilter,
  val = [],
  requestSetWildcardActionSearch,
  wildacardActionSearchTextSelector
}) => {
  const changeSelectOption = e => {
    requestInputFieldChanged(e, "filter");
    e.target.value = "";
  };

  return (
    <Fragment>
      <Navbar
        className="actionHistory-navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="first">
          <span>{formatMessage({ id: "transactionHistory" })}</span>&nbsp;&nbsp;&nbsp;
          {/* <Button
            className="is-primary level-left"
            text={formatMessage({ id: "newAction" })}
            leftIcon="plus"
            onClick={() => requestShowModal({ modalType: NEW_ACTION })}
          /> */}
        </div>

        {filter &&
          filter.content[0].map(option => {
            var data = {
              value: option.value,
              displayName: formatMessage({ id: option.displayName })
            };
            val.push(data);
          })}
        <div className="second">
        <form onSubmit={e => {
            e.preventDefault();
             requestShowFilteredData({ key: "", value: wildacardActionSearchTextSelector })
            }}>
            <div className={(filter ?filter.type==="USER ID"? "showFilter" : "hideFilter" : "hideFilter")}>
          <Input
            type="text"
            className={"input"}
            refs="search"
            placeholder={filter?formatMessage({id:"Enter"})+filter.type:""}
            onChange={e => {
              requestSetWildcardActionSearch(e.target.value);
            }}
            close={() => requestCloseActionFilter()}
            search={()=>requestShowFilteredData({ key: "", value: wildacardActionSearchTextSelector })}
            // onChange={e => changeChildSelectOption(e)}
            value={wildacardActionSearchTextSelector||""}
            defaultValue={wildacardActionSearchTextSelector||""}
            leftIcon="times"
            rightIcon="search"
          />
          </div>
          </form>

          <Select
            defaultValue={
              filter && filter.type
                ? filter.type
                : formatMessage({ id: "filter" })
            }
            leftIcon="times"
            onClick={() => requestCloseActionFilter()}
            className={"level-right " + (filter ?filter.type!=="USER ID"? "showFilter" : "hideFilter" : "hideFilter")}
            formatMessage={formatMessage}
            onChange={e =>
              requestShowFilteredData({
                key: "",
                value: e.target.value
              })
            }
            id="1"
            name={
              filter && filter.type
                ? filter.type
                : formatMessage({ id: "filter" })
            }
            options={val}
          />
          &nbsp;&nbsp;&nbsp;
          <Select
            defaultValue={formatMessage({ id: "filter" })}
            // leftIcon="plus"
            className="level-right"
            formatMessage={formatMessage}
          value={filter &&filter.type||""}
            onChange={e => changeSelectOption(e)}
            id="1"
            name="filter"
            options={[
              {
                value: "ACTION STATE",
                displayName: formatMessage({ id: "ACTION STATE" })
              },
              {
                value: "ACTION TYPE",
                displayName: formatMessage({ id: "ACTION TYPE" })
              },
              {
                value: "USER ID",
                displayName: formatMessage({ id: "USER ID" })
              }
            ]}
          />
        </div>
      </Navbar>
    </Fragment>
  );
};

export default ActionHistoryNavbar;
