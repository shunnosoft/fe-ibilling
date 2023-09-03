import { ErrorMessage, useField } from "formik";
import React from "react";

export const FtextField = ({ label, validation, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label htmlFor={field.name} className="changeLabelFontColor">
        {label} {validation && <span className="text-danger">*</span>}
      </label>
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
  );
};
