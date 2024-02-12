import { ErrorMessage, Field, useField } from "formik";
import React, { useState } from "react";
import { InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import DatePicker from "react-datepicker";
import InformationTooltip from "./tooltipInformation/InformationTooltip";

export const FtextField = ({ label, validation, ...props }) => {
  const [field, meta, { setValue }] = useField(props);

  // password type default password
  const [passType, setPassType] = useState("password");

  return (
    <div>
      <label htmlFor={field.name} className="changeLabelFontColor">
        {label} {validation && <span className="text-danger me-4">*</span>}
        {props?.info && <InformationTooltip data={props?.info} />}
      </label>

      {/* field as key base */}
      {props?.component ? (
        props.component === "password" ? (
          <InputGroup>
            <Field
              className="form-control shadow-none"
              type={passType}
              name="password"
            />

            <InputGroup.Text style={{ cursor: "pointer" }}>
              <div>
                {passType === "password" ? (
                  <EyeSlash size={22} onClick={(e) => setPassType("text")} />
                ) : (
                  <Eye size={22} onClick={(e) => setPassType("password")} />
                )}
              </div>
            </InputGroup.Text>
          </InputGroup>
        ) : props.component === "customerStatus" ? (
          <div
            className={`${
              props?.className ? props?.className : "displayGrid3"
            }`}
          >
            {props?.inputField.map(
              (option) =>
                option?.isVisible && (
                  <div className="form-check form-check-inline mt-0">
                    <Field
                      className="form-check-input"
                      {...field}
                      {...option}
                      onChange={() => setValue(option?.value)}
                      autoComplete="off"
                    />
                    <label className="form-check-label" htmlFor={option?.id}>
                      {option?.label}
                    </label>
                  </div>
                )
            )}
          </div>
        ) : props.component === "addStaff" ? (
          <div className="displayGrid3">
            {props?.inputField.map(
              (option) =>
                option?.isVisible && (
                  <div className="form-check form-check-inline mt-0">
                    <Field
                      className="form-check-input"
                      {...field}
                      {...option}
                      onChange={(e) => {
                        field.onChange(e);
                        props?.onChange(e);
                      }}
                      autoComplete="off"
                    />
                    <label className="form-check-label" htmlFor={option?.id}>
                      {option?.label}
                    </label>
                  </div>
                )
            )}
          </div>
        ) : ["autoDisable", "nextMonthAutoDisable"].includes(
            props?.component
          ) ? (
          <div className="displayGrid2">
            <div className="customerAutoDisable">
              <Field
                className="form-check-input me-2"
                {...field}
                {...props}
                autoComplete="off"
              />
              <label className="form-check-label" htmlFor={props?.id}>
                {props?.label}
              </label>
            </div>
          </div>
        ) : (
          <DatePicker
            className="form-control mw-100"
            {...field}
            {...props}
            selected={(field.value && new Date(field.value)) || null}
            onChange={(val) => {
              setValue(val);
            }}
            autoComplete="off"
          />
        )
      ) : props?.as ? (
        <Field
          className={`form-select shadow-none mw-100 mt-0 ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
          autoComplete="off"
          onChange={(e) => {
            field.onChange(e);
            props?.onChange(e);
          }}
        >
          <option selected>{props.firstOptions}</option>
          {props.options?.map((opt) => (
            <option
              selected={field?.value === opt[props?.valueAccessor]}
              value={opt[props?.valueAccessor]}
            >
              {opt[props?.textAccessor]}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          className={`form-control shadow-none ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...(props !== undefined)}
          value={props?.value ? props.value : field.value}
          onChange={(e) => {
            field.onChange(e);
            props?.onChange && props?.onChange(e);
          }}
          placeholder={props?.placeholder}
          autoComplete="off"
        ></Field>
      )}

      <ErrorMessage
        component="div"
        name={field.name}
        className="errorMessage text-danger mb-0"
      />
    </div>
  );
};
