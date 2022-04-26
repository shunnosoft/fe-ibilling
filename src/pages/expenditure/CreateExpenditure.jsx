import { Form, Formik } from "formik";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Loader from "../../components/common/Loader";
import * as Yup from "yup";
import "./expenditure.css";
import { FtextField } from "../../components/common/FtextField";
import { Plus, PlusSquare } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { addExpenditure, getExpenditureSectors } from "../../features/apiCalls";
export default function CreateExpenditure() {
  const [isLoading, setIsLoading] = useState(false);
  const [pourpose, setPourpose] = useState("");
  const expSectors = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const desRef = useRef("");
  const collectorValidator = Yup.object({
    amount: Yup.number().required("***"),
    newExp: Yup.string(),
    description: Yup.string(),
  });

  // useEffect(() => {
  // }, [ispOwnerId, dispatch]);
  const handleSelect = (e) => {
    console.log(e.target.value);
    setPourpose(e.target.value);
  };
  const expenditureHandler = async (formdata, resetForm) => {
    if (pourpose !== "") {
      const data = {
        amount: formdata.amount,
        description: desRef.current.value,
        expenditurePurpose: pourpose,
      };
      userRole === "ispOwner"
        ? (data.ispOwner = userData.id)
        : userRole === "reseller"
        ? (data.reseller = userData.id)
        : (data.staff = userData.id);

      await addExpenditure(dispatch, data, setIsLoading, resetForm);
      setPourpose("");
      desRef.current.value = "";
    }
  };
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="createExpenditure"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন খরচ অ্যাড
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{
                  newExp: "",
                  amount: 0,
                  description: "",
                }}
                validationSchema={collectorValidator}
                onSubmit={(values, { resetForm }) => {
                  expenditureHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div style={{ marginBottom: "20px" }}>
                      <select
                        style={{
                          width: "300px",
                          marginTop: "10px",
                          border: "2px solid skyblue",
                          height: "40px",
                          borderRadius: "5px",
                        }}
                        name=""
                        id=""
                        onChange={handleSelect}
                      >
                        <option value="">খরচ খাত সিলেক্ট করুন</option>
                        {expSectors?.map((exp, key) => {
                          return (
                            <option
                              selected={pourpose === exp.id}
                              key={key}
                              value={exp.id}
                            >
                              {exp.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="newexp">
                      {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <FtextField
                          type="text"
                          label="নতুন খাত  যুক্ত করুন"
                          name="newExp"
                          style={{ marginRight: "100px" }}
                        ></FtextField>
                        <Plus
                          style={{ marginLeft: "3px", marginTop: "6px" }}
                          className="addcutmButton"
                        ></Plus>
                      </div> */}
                      <FtextField
                        style={{ marginRight: "10px" }}
                        type="number"
                        label="পরিমাণ"
                        name="amount"
                      ></FtextField>
                    </div>

                    <div>
                      <h6>খরচের বিবরণ </h6>
                      <textarea
                        name="description"
                        ref={desRef}
                        style={{
                          width: "100%",
                          height: "100px",
                          border: "2px solid skyblue",
                          paddingLeft: "5px",
                        }}
                      ></textarea>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success customBtn"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "সেভ করুন"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
