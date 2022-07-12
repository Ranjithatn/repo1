import React from "react";
import Input from "../Input/Input";
import Label from "../Label/Label";

const InputField = ({
  labelId,
  labelName,
  labelClassName,
  labelText,
  inputId,
  inputClassName,
  value,
  onChange,
  inputName,
  inputType,
  placeholder,
  helpMsg,
  helpClassName,
  disabled = false,
  onKeyPress,
}) => {
  return (
    <div className="field">
      {labelText && (
        <Label
          className={labelClassName ? labelClassName : ""}
          text={labelText}
          name={labelName ? labelName : ""}
          htmlFor={inputId ? inputId : ""}
        />
      )}
      <div className="control">
        <Input
          className={inputClassName ? inputClassName : ""}
          placeholder={placeholder ? placeholder : ""}
          type={inputType ? inputType : "text"}
          inputClassName={inputClassName}
          value={value}
          id={inputId ? inputId : ""}
          name={inputName ? inputName : ""}
          onChange={onChange}
          disabled={disabled}
          onKeyPress={ onKeyPress ? onKeyPress : () => {} }
        />
      </div>
      {helpMsg && (
        <p className={"help" + (helpClassName ? " " + helpClassName : "")}>
          {helpMsg}
        </p>
      )}
    </div>
  );
};

export default InputField;
