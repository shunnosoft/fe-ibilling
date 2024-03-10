import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// custom hooks import
import useDataInputOption from "../../../hooks/useDataInputOption";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { updateStaffApi } from "../../../features/apiCallStaff";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const StaffEdit = ({ show, setShow, staffId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner all staffs
  const staffs = useSelector((state) => state.staff.staff);

  // find single staff
  const data = staffs.find((item) => item.id === staffId);

  // call the data input option function
  const inputPermission = {
    name: true,
    mobile: true,
    nid: true,
    address: true,
    email: true,
    fatherName: true,
    salary: true,
    due: true,
    status: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "staff",
    null,
    data
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // staff data update function handler
  const staffHandler = (formVlue) => {
    const {
      refName,
      refMobile,
      refEmail,
      refAddress,
      refRelation,
      refNid,
      ...rest
    } = formVlue;

    const sendingData = {
      ...rest,
      reference: {
        name: refName,
        mobile: refMobile,
        email: refEmail,
        address: refAddress,
        relation: refRelation,
        nid: refNid,
      },
    };

    // staff update api call
    updateStaffApi(dispatch, staffId, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
        header={t("updateStaff")}
        footer={
          <div className="displayGrid1 float-end">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              form="staffEdit"
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
            ...dataInputOption?.inputInitialValues,
            refName: data?.reference?.name || "",
            refMobile: data?.reference?.mobile || "",
            refEmail: data?.reference?.email || "",
            refAddress: data?.reference?.address || "",
            refRelation: data?.reference?.relation || "",
            refNid: data?.reference?.nid || "",
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values) => {
            staffHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="staffEdit">
              <div className="d-flex justify-content-center">
                <div className="displayGrid col-6">
                  {dataInputOption?.inputOption.map(
                    (item) => item?.isVisible && <FtextField {...item} />
                  )}
                </div>
              </div>

              {/* reference information start */}
              <Card className="mt-3 bg-light">
                <Card.Body>
                  <Card.Title className="inputLabelFontColor">
                    {t("referenceInformation")}
                  </Card.Title>
                  <Card.Text>
                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label={t("referenceName")}
                        name="refName"
                      />
                      <FtextField
                        type="text"
                        label={t("referenceMobile")}
                        name="refMobile"
                      />
                      <FtextField
                        type="text"
                        label={t("referenceEmail")}
                        name="refEmail"
                      />
                      <FtextField
                        type="text"
                        label={t("referenceNID")}
                        name="refNid"
                      />
                      <FtextField
                        type="text"
                        label={t("referenceAddress")}
                        name="refAddress"
                      />
                      <FtextField
                        type="text"
                        label={t("referenceRelation")}
                        name="refRelation"
                      />
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
              {/* reference information end */}
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default StaffEdit;
