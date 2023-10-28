import React from "react";
import { useField, ErrorMessage } from "formik";

const SelectField = ({ label, validation, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      {label ? (
        <label
          className="changeLabelFontColor"
          htmlFor={props.id || props.name}
        >
          {label} {validation && <span className="text-danger">*</span>}
        </label>
      ) : (
        ""
      )}

      <select
        style={{ display: "inline-block" }}
        className={`form-control shadow-none ${
          meta.touched && meta.error && "is-invalid"
        }`}
        {...field}
        {...props}
      />
      <ErrorMessage
        component="div"
        name={field.name}
        className="errorMessage text-danger"
      />
    </div>
  );
};

export default SelectField;
