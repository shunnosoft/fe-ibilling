import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import { Field, Form, Formik } from "formik";
import Loader from "../../../../components/common/Loader";
import * as Yup from "yup";
import { bulkCustomerUserTypeUpdate } from "../../../../features/actions/bulkOperationApi";
import { useDispatch } from "react-redux";

const BulkUserTypeUpdate = ({ bulkCustomer, show, setShow }) => {
  const dispatch = useDispatch();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // IspOwner user type update function
  const userTypeUpdate = (formValue) => {
    const data = {
      customerIds: bulkCustomer.map((item) => item.original.id),
      ...formValue,
    };

    bulkCustomerUserTypeUpdate(dispatch, data, setIsLoading, setShow);
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header="User Type Update">
      <Formik
        initialValues={{
          userType: "simple-queue",
        }}
        validationSchema={Yup.object({
          userType: Yup.string().required("User Type must be selected."),
        })}
        onSubmit={(values) => {
          userTypeUpdate(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form id="packageUpdate">
            <Field
              as="select"
              name="userType"
              className="form-select mt-0 mw-100"
            >
              <option value="simple-queue">Simple Queue</option>
              <option value="firewall-queue">Firewall Queue</option>
              <option value="core-queue">Core Queue</option>
            </Field>
          </Form>
        )}
      </Formik>

      <div className="displayGrid1 float-end mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={isLoading}
          onClick={() => setShow(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          form="packageUpdate"
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Submit"}
        </button>
      </div>
    </RootBulkModal>
  );
};

export default BulkUserTypeUpdate;
