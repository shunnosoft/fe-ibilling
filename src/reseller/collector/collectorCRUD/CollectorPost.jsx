import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// custom hooks import
import useDataInputOption from "../../../hooks/useDataInputOption";
import useISPowner from "../../../hooks/useISPOwner";

// internal imports
import "../../Customer/customer.css";
import Loader from "../../../components/common/Loader";
import { FtextField } from "../../../components/common/FtextField";
import { addCollector } from "../../../features/apiCallReseller";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CollectorPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // call the data input option function
  const inputPermission = {
    name: true,
    mobile: true,
    nid: true,
    address: true,
    email: true,
    status: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(inputPermission, null);

  // get user & current user data form useISPOwner hook
  const { ispOwnerId, currentUser } = useISPowner();

  // get reseller area data from redux store
  const area = useSelector((state) => state.area.area);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // area id state
  const [areaIds, setAreaIds] = useState([]);

  // area select handler function
  const setAreaHandler = (e) => {
    if (!areaIds.includes(e.target.value)) {
      setAreaIds([...areaIds, e.target.value]);
    } else {
      setAreaIds(areaIds.filter((val) => val !== e.target.value));
    }
  };

  // collector create function handler
  const collectorPostHandler = async (data) => {
    const sendingData = {
      ...data,
      areas: areaIds,
      reseller: currentUser.reseller.id,
      ispOwner: ispOwnerId,
    };

    // call the add collector api
    addCollector(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"xl"}
        header={t("addNewCollector")}
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
              form="collectorPost"
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
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values) => {
            collectorPostHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="collectorPost">
              <div className="d-flex justify-content-center">
                <div className="displayGrid col-6">
                  {dataInputOption?.inputOption.map(
                    (item) => item?.isVisible && <FtextField {...item} />
                  )}
                </div>
              </div>

              {/* collector area select option */}
              <Card className="mt-3 bg-light">
                <Card.Body>
                  <Card.Title className="inputLabelFontColor">
                    {t("selectArea")}
                  </Card.Title>
                  <Card.Text>
                    <div className="displayGrid4">
                      {area?.map((val, key) => (
                        <div key={key} className="form-check">
                          <input
                            id={val.id}
                            type="checkbox"
                            className="form-check-input"
                            value={val.id}
                            onChange={setAreaHandler}
                          />
                          <label className="areaParent ms-1" htmlFor={val.id}>
                            {val.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default CollectorPost;
