import React from "react";
import Select from "components/Select/Select"
import Label from "components/Label/Label";

export default function Reason({ formatMessage, onChange, selectedRegion, selectedReason, reasons }) {
  return (
    <div className="reason">
      {/* <div className="field is-horizontal">
        <div className="field-label is-normal">
          <Label text={(selectedRegion && formatMessage({id: selectedRegion})) || ""} />
        </div>
        <div className="field-body">
          <div className="field is-narrow">
            <div className="control"> */}
      <Label text={(selectedRegion && formatMessage({ id: selectedRegion })) || ""} />
      <Select
        disabled={!selectedRegion || !selectedRegion}
        className="is-fullwidth"
        formatMessage={formatMessage}
        onChange={onChange}
        value={selectedReason}
        defaultValue={formatMessage({ id: "Select Reason" })}
        options={reasons}
      />
      {/* </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
