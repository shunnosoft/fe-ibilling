import { ErrorMessage, useField } from "formik";
import React from "react";

export const TextField = ({ label, validation, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-2">
      <label htmlFor={field.name}>
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
        className="errorMessage"
      />
    </div>
  );
};

export const initialValues = {
  company: "",
  name: "",
  mobile: "",
  address: "",
  email: "",
  maxUser: "",
  refName: "",
  refMobile: "",
};
