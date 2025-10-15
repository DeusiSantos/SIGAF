import React from "react";
import CustomInput from "../../../../../core/components/CustomInput";

const Input = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
  errorMessage,
  helperText,
  success,
  options = [],
  ...rest
}) => {
  return (
    <CustomInput
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      type={type}
      errorMessage={errorMessage}
      helperText={helperText}
      success={success}
      options={options}
      {...rest}
    />
  );
};

export default Input;
