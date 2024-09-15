import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { ErrorMessage, Field, Form, Formik, FieldArray } from "formik";
import { FtextField } from "../../../components/common/FtextField";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { Table } from "react-bootstrap";
import * as Yup from "yup";
import {
  createNetworkDevice,
  updateNetworkDevice,
} from "../../../features/apiCalls";
import { useDispatch } from "react-redux";
import useISPowner from "../../../hooks/useISPOwner";
import { toast } from "react-toastify";

const DeviceForm = ({ show, setShow, isUpdate, title, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  const [isLoading, setIsLoading] = useState(false);
  const [portItems, setPortItems] = useState([]);

  // Set default values from device prop or fallback to default values
  const initialValues = {
    candidateType: device?.candidateType || "",
    name: device?.name || "",
    brand: device?.brand || "",
    deviceModel: device?.deviceModel || "",
    ip: device?.ip || "",
    ratio: device?.ratio || "",
    outputs: device?.outputs || [], // Default to an empty array if no outputs are provided
  };

  // Validation schema for the form
  const validationSchema = Yup.object().shape({
    ratio: Yup.number().when("candidateType", {
      is: (val) => val !== "onu",
      then: Yup.number()
        .required(t("portRatioRequired"))
        .min(0, t("portRatioMin"))
        .max(50, t("portRatioMax")),
    }),

    outputs: Yup.array().when("candidateType", {
      is: (val) => val !== "onu",
      then: Yup.array().of(
        Yup.object().shape({
          portName: Yup.string().required(t("portNameRequired")),
          portPower: Yup.string().required(t("portPowerRequired")),
        })
      ),
    }),
  });

  const inputOption = [
    {
      as: "select",
      id: "candidateType",
      name: "candidateType",
      label: t("deviceType"),
      firstOptions: t("selectDeviceType"),
      textAccessor: "name",
      valueAccessor: "value",
      options: [
        {
          name: t("mikrotik"),
          value: "mikrotik",
        },
        {
          name: t("olt"),
          value: "olt",
        },
        {
          name: t("switch"),
          value: "switch",
        },
        {
          name: t("splitter"),
          value: "splitter",
        },
        {
          name: t("onu"),
          value: "onu",
        },
      ],
      validation: true,
      isVisible: true,
      disabled: false,
    },
    {
      type: "text",
      id: "name",
      name: "name",
      label: t("name"),
      validation: true,
      isVisible: true,
      disabled: false,
    },
    {
      type: "text",
      id: "brand",
      name: "brand",
      label: t("brand"),
      validation: false,
      isVisible: true,
      disabled: false,
    },
    {
      type: "text",
      id: "model",
      name: "deviceModel",
      label: t("model"),
      validation: false,
      isVisible: true,
      disabled: false,
    },
    {
      type: "text",
      id: "ip",
      name: "ip",
      label: t("ip"),
      validation: true,
      isVisible: true,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (portItems.length === 0) {
      setPortItems([]); // Initial empty array
    }
  }, []);

  // Function to dynamically generate ports based on watchPort value
  const generatePortItems = (watchPort) => {
    let newPortItems = [];
    if (Number(watchPort) > 0 && Number(watchPort) <= 50) {
      for (let i = 0; i < Number(watchPort); i++) {
        newPortItems.push({
          serial: i + 1,
          portName: "",
          portPower: "",
          color: "",
        });
      }
    }
    return newPortItems;
  };

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    const { outputs, ...rest } = values;

    const portNames = outputs
      .filter((item) => item.portName)
      .map((item) => item.portName);

    const arePortNamesUnique = new Set(portNames).size === portNames.length;
    if (!arePortNamesUnique) {
      return toast.error(t("duplicatePortNameFound"));
    }

    const deviceData = {
      ...rest,
      outputs: outputs.map((item) => {
        item.portPower = item.portPower.replace(/[^0-9%]/g, "");
        if (item.portPower && !item.portPower.endsWith("%")) {
          item.portPower += "%";
        }
        return item;
      }),
      ispOwner: ispOwnerId,
    };

    if (deviceData.candidateType === "onu") {
      delete deviceData.ratio;
      delete deviceData.outputs;
    }

    if (isUpdate) {
      await updateNetworkDevice(dispatch, deviceData, setIsLoading, setShow);
    } else {
      await createNetworkDevice(dispatch, deviceData, setIsLoading, setShow);
    }
    setSubmitting(false);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={true}
        size="lg"
        header={title}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true} // This ensures the form is updated when device prop changes
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form id="networkDevice">
              <div className="displayGrid2 mb-3">
                {inputOption?.map(
                  (item) => item?.isVisible && <FtextField {...item} />
                )}

                {/* Port ratio input */}
                {values.candidateType !== "onu" && (
                  <div className="form-group">
                    <label className="changeLabelFontColor">
                      {t("port")} <span className="text-danger me-4">*</span>
                    </label>
                    <Field
                      type="number"
                      name="ratio"
                      className="form-control"
                      placeholder="Enter number of ports"
                      onChange={(e) => {
                        handleChange(e);
                        const updatedPorts = generatePortItems(e.target.value);
                        setFieldValue("outputs", updatedPorts);
                      }}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="ratio"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                )}
              </div>

              {/* Port inputs dynamically generated */}
              {values.candidateType !== "onu" && (
                <FieldArray
                  name="outputs"
                  render={() => (
                    <>
                      {values.outputs && values.outputs.length > 0 && (
                        <Table>
                          <thead>
                            <tr>
                              <th>Sl</th>
                              <th>Port Name</th>
                              <th>Port Power %</th>
                              <th>Color</th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.outputs.map((port, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <Field
                                    name={`outputs[${index}].portName`}
                                    className="form-control"
                                    placeholder="Enter Port Name"
                                  />
                                  <ErrorMessage
                                    name={`outputs[${index}].portName`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </td>

                                <td>
                                  <Field
                                    name={`outputs[${index}].portPower`}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Port Power %"
                                  />
                                </td>

                                <td>
                                  <Field
                                    name={`outputs[${index}].color`}
                                    as="select"
                                    className="form-select mt-0"
                                  >
                                    <option value="mikrotik">
                                      {t("colourCode")}
                                    </option>
                                    <option value="blue">{t("blue")}</option>
                                    <option value="red">{t("red")}</option>
                                    <option value="purple">
                                      {t("purple")}
                                    </option>
                                    <option value="black">{t("black")}</option>
                                    <option value="yellow">
                                      {t("yellow")}
                                    </option>
                                    <option value="green">{t("green")}</option>
                                    <option value="pink">{t("pink")}</option>
                                    <option value="white">{t("white")}</option>
                                    <option value="gray">{t("gray")}</option>
                                    <option value="orange">
                                      {t("orange")}
                                    </option>
                                    <option value="brown">{t("brown")}</option>
                                  </Field>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </>
                  )}
                />
              )}

              {/* Loader */}
              {isLoading && <Loader />}

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {t("submit")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default DeviceForm;
