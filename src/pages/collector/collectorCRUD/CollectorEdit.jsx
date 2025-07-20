import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "react-bootstrap";

// custom hooks impot
import useISPowner from "../../../hooks/useISPOwner";
import useDataInputOption from "../../../hooks/useDataInputOption";

// internal importsp
import Loader from "../../../components/common/Loader";
import { FtextField } from "../../../components/common/FtextField";
import { editCollector } from "../../../features/apiCalls";
import { collectorPermission } from "./collectorPermission";
import InformationTooltip from "../../../components/common/tooltipInformation/InformationTooltip";
import { areasSubareasChecked } from "../../staff/staffCustomFucn";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CollectorEdit = ({ show, setShow, collectorId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { role, bpSettings, permissions } = useISPowner();

  // get ispOwner all collector form redux store
  const collector = useSelector((state) => state?.collector?.collector);

  // get ispOwner all areas form redux store
  const area = useSelector((state) => state?.area?.area);

  // find single collector
  const single = collector.find((val) => val.id === collectorId);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

  // collector permissions state
  const [collectorPermissions, setCollectorPermissions] = useState([]);

  // call the data input option function
  const inputPermission = {
    name: true,
    mobile: true,
    address: true,
    email: true,
    nid: true,
    status: true,
    addStaff: true,
    salary: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    null,
    null,
    single
  );

  // set data for single collector
  useEffect(() => {
    setCollectorPermissions(
      collectorPermission(single.permissions, role, bpSettings, permissions)
    );
  }, [single]);

  // ispOwner all areas subarea handle
  useEffect(() => {
    let temp = [];

    storeSubArea?.map((sub) => {
      if (single?.areas.includes(sub?.id)) {
        let subarea = {
          ...sub,
          isChecked: true,
        };
        temp.push(subarea);
      } else {
        let subarea = {
          ...sub,
          isChecked: false,
        };
        temp.push(subarea);
      }
    });

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);
  }, [single, storeSubArea]);

  // select area handle for the collector
  const areaSubareaSelectHandler = ({ target }) => {
    const { name, checked, id } = target;

    let subAreas = [...areaSubareas];

    if (name === "area") {
      subAreas = subAreas.map((val) =>
        val.area === id ? { ...val, isChecked: checked } : val
      );
    } else {
      subAreas = subAreas.map((val) =>
        val.id === id ? { ...val, isChecked: checked } : val
      );
    }

    // set collector areas
    setAreaSubareas(subAreas);
  };

  // select permission handle for the collector
  const collectorPermissionHandler = (e) => {
    const { name, checked } = e.target;

    //  temporary state set collector single & multiple permission
    let temp = [...collectorPermissions];

    if (name === "allPermissions") {
      temp = temp.map((val) => ({ ...val, isChecked: checked }));
    } else {
      temp = temp.map((val) =>
        val.value === name ? { ...val, isChecked: checked } : val
      );
    }

    // set collector permissions state
    setCollectorPermissions(temp);
  };

  // collector update data submit handler
  const collectorEditHandler = async (data) => {
    // temporary state set collector single & multiple permission
    let temp = {};

    collectorPermissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });

    // temporary state set collector single & multiple permission
    const newP = {
      ...single.permissions,
      ...temp,
    };

    if (single.ispOwner) {
      // send data for api
      const sendingData = {
        ...data,
        areas: areaSubareas.filter((val) => val.isChecked).map((val) => val.id),
        ispOwner: single.ispOwner,
        ispOwnerId: single.ispOwner,
        collectorId: single.id,
        permissions: newP,
      };

      // edit collector api call
      editCollector(dispatch, sendingData, setIsLoading, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        size="xl"
        header={single?.name + " " + t("editProfile")}
        footer={
          <div className="displayGrid1 float-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShow(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              form="collectorEdit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        }
      >
        <Formik
          initialValues={{
            ...dataInputOption.inputInitialValues,
          }}
          validationSchema={dataInputOption.validationSchema}
          onSubmit={(values) => {
            collectorEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="collectorEdit">
              <Tabs
                defaultActiveKey={"basic"}
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                {/* collector profile data tab start*/}
                <Tab eventKey="basic" title={t("profile")}>
                  <div className="d-flex justify-content-center">
                    <div className="displayGrid col-6">
                      {dataInputOption?.inputOption.map(
                        (item) => item?.isVisible && <FtextField {...item} />
                      )}
                    </div>
                  </div>
                </Tab>
                {/* collector profile data tab end*/}

                {/* collector area tab start*/}
                <Tab eventKey="area" title={t("area")}>
                  <div className="AllAreaClass">
                    {area?.map((val, key) => (
                      <div key={key}>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="area"
                            id={val.id}
                            onChange={areaSubareaSelectHandler}
                            checked={
                              areaSubareas &&
                              areasSubareasChecked(val.id, areaSubareas)
                            }
                          />

                          <label htmlFor={val.id} className="areaParent ms-1">
                            {val.name}
                          </label>
                        </div>

                        {areaSubareas?.map(
                          (subArea, k) =>
                            subArea.area === val.id && (
                              <div key={k} className="displayFlex">
                                <input
                                  type="checkbox"
                                  id={subArea.id}
                                  checked={subArea.isChecked}
                                  onChange={areaSubareaSelectHandler}
                                />
                                <label
                                  htmlFor={subArea.id}
                                  className="text-secondary"
                                >
                                  {subArea.name}
                                </label>
                              </div>
                            )
                        )}
                      </div>
                    ))}
                  </div>
                </Tab>
                {/* collector area tab end*/}

                {/* collector permissions tab start*/}
                <Tab eventKey="changePermission" title={t("permissions")}>
                  <div className="displayGrid3">
                    <div className="CheckboxContainer">
                      <input
                        type="checkbox"
                        className="CheckBox"
                        name="allPermissions"
                        onChange={collectorPermissionHandler}
                        id="editAllPermissions"
                        checked={collectorPermissions.every(
                          (item) => item.isChecked
                        )}
                      />
                      <label
                        htmlFor="editAllPermissions"
                        className="checkboxLabel text-info fw-bold"
                      >
                        {t("allPermission")}
                      </label>
                    </div>
                    {collectorPermissions?.map(
                      (val, key) =>
                        !val.disabled && (
                          <div
                            className={
                              !val?.disabled &&
                              "CheckboxContainer d-flex justify-content-between"
                            }
                            key={key}
                          >
                            <div>
                              <input
                                type="checkbox"
                                className="CheckBox"
                                name={val.value}
                                checked={val.isChecked}
                                onChange={collectorPermissionHandler}
                                id={val.value + key}
                              />

                              <label
                                htmlFor={val.value + key}
                                className="checkboxLabel"
                              >
                                {t(val.label)}
                              </label>
                            </div>

                            {/* there is information to grant permission tooltip */}
                            {val?.info && <InformationTooltip data={val} />}
                          </div>
                        )
                    )}
                  </div>
                </Tab>
                {/* collector permissions tab end*/}
              </Tabs>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};
export default CollectorEdit;
