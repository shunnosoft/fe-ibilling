import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";
import useDataInputOption from "../../../hooks/useDataInputOption";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addStaff } from "../../../features/apiCallStaff";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const StaffPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // call the data input option function
  const inputPermission = {
    name: true,
    mobile: true,
    nid: true,
    address: true,
    email: true,
    fatherName: true,
    salary: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(inputPermission, "staff");

  // get user & current user data form useISPOwner hook
  const { ispOwnerId, currentUser } = useISPowner();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // staff create function handler
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
      ispOwnerId,
      user: currentUser.user.id,
    };

    // staff create api call
    addStaff(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
        header={t("addNewStaff")}
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
              form="staffPost"
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
            refName: "",
            refMobile: "",
            refEmail: "",
            refAddress: "",
            refRelation: "",
            refNid: "",
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values) => {
            staffHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="staffPost">
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

export default StaffPost;
