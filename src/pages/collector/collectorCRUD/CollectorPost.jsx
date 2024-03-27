import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { addCollector } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "react-bootstrap";
import { areasSubareasChecked } from "../../staff/staffCustomFucn";
import { toast } from "react-toastify";
import useDataInputOption from "../../../hooks/useDataInputOption";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CollectorPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  const dataInputOption = useDataInputOption(inputPermission, null);

  const area = useSelector((state) => state?.area?.area);
  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const auth = useSelector((state) => state.persistedReducer.auth?.currentUser);

  const [isLoading, setIsLoading] = useState(false);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

  // ispOwner all areas subarea handle
  useEffect(() => {
    let temp = [];

    area?.map((val) =>
      storeSubArea?.map((sub) => {
        if (val.id === sub.area) {
          let subarea = {
            ...sub,
            isChecked: false,
          };
          temp.push(subarea);
        }
      })
    );

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);
  }, [area, storeSubArea]);

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

  // collector create function handler
  const collectorPostHandler = async (data) => {
    // if add staff button is clicked then check the salary
    if (data.addStaff) {
      if (Number(data.salary) <= 0) {
        setIsLoading(false);
        return toast.warn(t("incorrectSalary"));
      }
    }

    if (auth.ispOwner) {
      // send data for api
      const sendingData = {
        ...data,
        salary: Number(data.salary),
        areas: areaSubareas.filter((val) => val.isChecked).map((val) => val.id),
        ispOwner: auth.ispOwner.id,
      };

      // if add staff button is not clicked then delete salary
      if (!data.addStaff) {
        delete sendingData.salary;
      }

      // add collector api call
      addCollector(dispatch, sendingData, setIsLoading, data.addStaff, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        size="xl"
        header={t("addNewCollector")}
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
            <Form>
              <Tabs
                defaultActiveKey="details"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                {/* collector profile informataion start */}
                <Tab eventKey="details" title={t("profile")}>
                  <div className="d-flex justify-content-center">
                    <div className="displayGrid col-6">
                      {dataInputOption?.inputOption.map(
                        (item) => item?.isVisible && <FtextField {...item} />
                      )}
                    </div>
                  </div>
                </Tab>
                {/* collector profile informataion end */}

                {/* collector areas tab start */}
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
                {/* collector areas tab end */}
              </Tabs>

              <div className="displayGrid1 float-end mt-4">
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
                  className="btn btn-success customBtn"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : t("submit")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default CollectorPost;
