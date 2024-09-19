import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { useTranslation } from "react-i18next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"; // Assuming you're using Yup for validation
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  getNetworkDevice,
  networkDeviceAssign,
} from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import useISPowner from "../../../hooks/useISPOwner";
import Select from "react-select";

const AssignDevice = ({ show, setShow, data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  // get network devices form redux store
  const devices = useSelector((state) => state.network?.devices);

  // get all customer
  const customers = useSelector((state) => state.customer.customer);

  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);

  const [remarks, setRemarks] = useState("");

  const [candidateValue, setCandidateValue] = useState("");

  useEffect(() => {
    getNetworkDevice(dispatch, ispOwnerId, setIsLoading);
  }, [data]);

  // Define input fields with properties
  const inputOptions = [
    {
      as: "select",
      id: "candidateId",
      name: "candidateId",
      label: `${t("network")} ${t("device")}`,
      firstOptions: t("selectDeviceType"),
      options: devices,
      textAccessor: "name",
      valueAccessor: "id",
      validation: true,
      isVisible: true,
      disabled: false,
    },
    {
      type: "text",
      id: "location",
      name: "location",
      label: t("deviceLocation"),
      validation: true,
      isVisible: true,
      disabled: false,
    },
  ];

  const options =
    customers?.map((customer) => ({
      label: customer.name,
      value: customer.id,
    })) || [];

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    candidateId: Yup.string().required(t("requiredField")),
    location: Yup.string().required(t("requiredField")),
    customer: Yup.string().when("candidateValue", {
      is: "onu",
      then: Yup.string().required(t("assignCustomer")),
    }),
  });

  const deviceAssignChangeHandler = (
    { target: { name, value } },
    setFieldValue
  ) => {
    if (name === "candidateId") {
      const candidate = devices?.find((item) => item.id === value);
      setCandidateValue(candidate.candidateType);
      setFieldValue("candidateId", value);
    }
  };

  // Handle form submission
  const deviceAssignHandler = async (values) => {
    const assignData = {
      ...values,
      remarks,
      ispOwner: ispOwnerId,
    };

    if (data) {
      assignData.parentId = data?._id;
      assignData.parentPath = `${data.parentPath}/${data.documentId}`;
    } else {
      delete assignData.parentId;
      delete assignData.parentPath;
    }

    if (candidateValue !== "onu") {
      delete assignData.customer;
    }

    await networkDeviceAssign(dispatch, assignData, setIsLoading, setShow);
  };

  return (
    <ComponentCustomModal
      show={show}
      setShow={() => setShow(false)}
      centered
      size="md"
      header={`${data?.device?.name}-${data?.output?.portName} ${t(
        "assign"
      )} ${t("device")}`}
      footer={
        <div className="displayGrid1 float-end">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            form="assignDeviceForm"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </div>
      }
    >
      <Formik
        initialValues={{
          candidateId: "",
          location: "",
          customer: "",
        }}
        validationSchema={validationSchema}
        onSubmit={deviceAssignHandler}
      >
        {({ setFieldValue }) => (
          <Form
            id="assignDeviceForm"
            onChange={(e) => deviceAssignChangeHandler(e, setFieldValue)}
          >
            <div className="displayGrid2 mb-3">
              {inputOptions?.map(
                (item) => item?.isVisible && <FtextField {...item} />
              )}
            </div>

            {candidateValue === "onu" && (
              <div className="mb-3">
                <label className="changeLabelFontColor">
                  {t("selectCustomer")}
                </label>

                <Field name="customer">
                  {({ field, form }) => (
                    <Select
                      options={options}
                      value={options.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        form.setFieldValue(field.name, selectedOption.value)
                      }
                      placeholder="Search Customer"
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="customer"
                  component="div"
                  className="text-danger"
                />
              </div>
            )}

            <textarea
              class="form-control"
              name="remarks"
              rows="3"
              placeholder="Note"
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
            ></textarea>
          </Form>
        )}
      </Formik>
    </ComponentCustomModal>
  );
};

export default AssignDevice;
