import React from "react";
import { ErrorMessage, useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";

const DatePickerField = ({ label, validation, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    <div className="mb-3">
      <label htmlFor={field.name} className="changeLabelFontColor">
        {label} {validation}
      </label>

      <DatePicker
        className={`form-control shadow-none ${
          meta.touched && meta.error && "is-invalid"
        }`}
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />

      <ErrorMessage
        component="div"
        name={field.name}
        className="errorMessage text-danger"
      />
    </div>
  );
};

export default DatePickerField;
