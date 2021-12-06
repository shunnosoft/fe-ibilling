import React from "react";
import { ErrorMessage, useField } from "formik";

export const LoginField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="form-floating mb-2">
      <label htmlFor={field.name}>{label}</label>
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
        className="errorMessage"
      />
    </div>
  );
};
