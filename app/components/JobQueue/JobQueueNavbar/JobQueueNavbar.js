import React, { Fragment } from "react";
import Button from "../../Button/Button";
import Icon from "../../Icon/Icon";
import Navbar from "../../Navbar/Navbar";
import { ADD_JOB } from "../../Modal/ModalRoot";
import Modal from "../../Modal/Modal";
import Select from "../../Select/Select";
import Input from "../../Input/Input";
import "./JobQueueNavbar.scss";


const JobQueueNavbar = ({
  requestShowModal,
  requestActiveJobs,
  requestShowNotification,
  requestInputFieldChanged,
  requestShowJobFilteredData,
  requestCloseFilter,
  requestCloseActionFilter,
  formatMessage,
  jobFilter,
  val = [],
  lookups,
  requestWildcardSearch,
  requestSetWildcardSearch,
  wildcardSearchTextSelector,
  requestSystemPermissions
}) => {
  const changeSelectOption = e => {
    requestInputFieldChanged(e, "jobFilter");
    e.target.value = "";
  };

  const changeChildSelectOption = e => {
    requestShowJobFilteredData({ key: "", value: e.target.value });
  };

  return (
    <Fragment>
      <Navbar
        className="jobqueue-navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="left">
          <Icon
            style={{ lineHeight: "36px", alignItems: "flex-start" }}
            icon="home fa-2x"
          />
          &nbsp;&nbsp;
          <span style={{ lineHeight: "18px", marginTop: "5px" }}>
            {formatMessage({ id: "availableJobs" })}
          </span>
          &nbsp;&nbsp;
          <Button
            className="is-primary"
            text={formatMessage({ id: "addJob" })}
            leftIcon="plus"
            onClick={() => requestShowModal({ modalType: ADD_JOB })}
          />
          &nbsp;&nbsp;
          <Button
            className="is-primary"
            text={formatMessage({ id: "refresh" })}
            leftIcon="refresh"
            onClick={() => {
              requestActiveJobs();
              requestCloseFilter();
              requestCloseActionFilter();
              requestSystemPermissions();
            }}
          />
          &nbsp;&nbsp;
        </div>
        {jobFilter &&
          jobFilter.content[0].map(option => {
            let fmId = option.displayName;
            if (!fmId) {
              fmId = "Option";
            }
            let data = {
              value: option.value,
              displayName: formatMessage({ id: fmId })
            };
         
            if(!val.find(c=>c.value===data.value)){
              val.push(data);
            }
            
           
          })}
        <div className="right">
          <span style={{ lineHeight: "18px", marginTop: "5px" }}>
            {formatMessage({ id: "filter" })}
          </span>
          &nbsp;&nbsp;
          <form
            onSubmit={e => {
              e.preventDefault();
              requestShowJobFilteredData({
                key: "",
                value: wildcardSearchTextSelector
              });
            }}
          >
            <div
              className={
                jobFilter
                  ? jobFilter.type === "USER ID" ||
                  jobFilter.type === "JOB ID" ||
                  jobFilter.type === "TERMINAL ID"
                    ? "showFilter"
                    : "hideFilter"
                  : "hideFilter"
              }
            >
              <Input
                type="text"
                className={"input"}
                refs="search"
                onChange={e => {
                  requestSetWildcardSearch(e.target.value);
                }}
                close={() => requestCloseFilter()}
                search={() =>
                  requestShowJobFilteredData({
                    key: "",
                    value: wildcardSearchTextSelector
                  })
                }
                value={wildcardSearchTextSelector || ""}
                defaultValue={wildcardSearchTextSelector || ""}
                leftIcon="times"
                rightIcon="search"
                placeholder={
                  jobFilter
                    ? formatMessage({ id: "Enter" }) + formatMessage({id:jobFilter.type})
                    : ""
                }
              />
            </div>
          </form>
          &nbsp;&nbsp;&nbsp;
          <Select
            defaultValue={
              jobFilter && jobFilter.type
                ? jobFilter.type
                : formatMessage({ id: "filter" })
            }
            leftIcon="times"
            onClick={() => requestCloseFilter()}
            className={
              "level-right " +
              (jobFilter
                ? jobFilter.type === "LOCATION ID" ||
                  // jobFilter.type === "JOB ID" ||
                  jobFilter.type === "JOB TYPE"
                  ? "showFilter"
                  : "hideFilter"
                : "hideFilter")
            }
            formatMessage={formatMessage}
            onChange={e => changeChildSelectOption(e)}
            id="1"
            name={
              jobFilter && jobFilter.type
                ? jobFilter.type
                : formatMessage({ id: "filter" })
            }
            options={val}
          />{" "}
          &nbsp;&nbsp;&nbsp;
          <Select
            defaultValue={formatMessage({ id: "filter" })}
            // leftIcon="plus"
            className="level-right"
            formatMessage={formatMessage}
            onChange={e => changeSelectOption(e)}
            id="1"           
            name="filter"
            options={[
              {
                value: "USER ID",
                displayName: formatMessage({ id: "USER ID" })
              },
              {
                value: "TERMINAL ID",
                displayName: formatMessage({ id: "TERMINAL ID" })
              },
              {
                value: "JOB TYPE",
                displayName: formatMessage({ id: "JOB TYPE" })
              },
              {
                value: "JOB ID",
                displayName: formatMessage({ id: "JOB ID" })
              },
              {
                value: "LOCATION ID",
                displayName: formatMessage({ id: "LOCATION ID" })
              }
            ]}
            value={jobFilter&&jobFilter.type||""}
          />
        </div>
      </Navbar>
    </Fragment>
  );
};

export default JobQueueNavbar;
