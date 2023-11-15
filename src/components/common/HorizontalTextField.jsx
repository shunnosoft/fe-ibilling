import { ErrorMessage, useField } from "formik";
import React from "react";

export const TextField = ({ label, validation, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="displayGridManual6_4">
      <label htmlFor={field.name} className="changeLabelFontColor manualLable">
        {label} {validation && <span className="text-danger">*</span>}
      </label>

      <div>
        <input
          className={`form-control shadow-none ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
          autoComplete="off"
        />
        <ErrorMessage
          component="div"
          name={field.name}
          className="errorMessage text-danger"
        />
      </div>
    </div>
  );
};
