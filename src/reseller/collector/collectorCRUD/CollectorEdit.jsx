import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// custom hooks import
import useDataInputOption from "../../../hooks/useDataInputOption";
import useISPowner from "../../../hooks/useISPOwner";

// internal importsp
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editCollector } from "../../../features/apiCallReseller";
import { collectorPermission } from "./collectorPermission";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CollectorEdit = ({ show, setShow, collectorId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hook
  const { userData, permission } = useISPowner();

  // get reseller all collector from redux store
  const collectors = useSelector((state) => state?.collector?.collector);

  // get reseller area data from redux store
  const area = useSelector((state) => state.area.area);

  // reseller id from reseller profile
  const resellerId = userData?.id;

  // find single collector data
  const data = collectors.find((item) => item.id === collectorId);

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
  const dataInputOption = useDataInputOption(inputPermission, null, null, data);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // collector permission state
  const [permissions, setPermissions] = useState([]);

  // collector area id state
  const [areaIds, setAreaIds] = useState([]);

  // set collector permission
  useEffect(() => {
    if (data) {
      // set area id for the collector
      setAreaIds(data?.areas);

      // set collector permission
      setPermissions(collectorPermission(data.permissions, permission));
    }
  }, [data]);

  // area select handler function
  const setAreaHandler = (e) => {
    if (!areaIds.includes(e.target.value)) {
      setAreaIds([...areaIds, e.target.value]);
    } else {
      setAreaIds(areaIds.filter((val) => val !== e.target.value));
    }
  };

  // collector permission handler function
  const handleChange = (e) => {
    const { name, checked } = e.target;
    let temp = permissions.map((val) =>
      val.value === name ? { ...val, isChecked: checked } : val
    );
    setPermissions(temp);
  };

  // collector edit handler
  const collectorEditHandler = async (formValue) => {
    let temp = {};

    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });

    const newPermission = {
      ...data.permissions,
      ...temp,
    };

    const sendingData = {
      ...formValue,
      areas: areaIds,
      collectorId: data?.id,
      resellerId: resellerId,
      permissions: newPermission,
    };

    // edit collector api
    editCollector(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
        header={data.name + " " + t("editProfile")}
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
              form="collectorEdit"
              className="btn btn-success customBtn"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
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
            collectorEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="collectorEdit">
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
                            checked={areaIds.includes(val.id)}
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

              <Card className="mt-3 bg-light">
                <Card.Body>
                  <Card.Title className="inputLabelFontColor">
                    {t("changePermission")}
                  </Card.Title>
                  <Card.Text>
                    <div className="displayGrid3">
                      {permissions.map(
                        (val, key) =>
                          !val?.isDisabled && (
                            <div className="CheckboxContainer" key={key}>
                              <input
                                type="checkbox"
                                className="CheckBox"
                                name={val.value}
                                checked={val.isChecked}
                                disabled={val?.isDisabled}
                                onChange={handleChange}
                                id={val.value + key}
                              />
                              <label
                                htmlFor={val.value + key}
                                className="checkboxLabel"
                              >
                                {val.label}
                              </label>
                            </div>
                          )
                      )}
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

export default CollectorEdit;
