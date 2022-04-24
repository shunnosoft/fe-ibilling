import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import * as Yup from "yup";
import "./expenditure.css";
import { FtextField } from "../../components/common/FtextField";
import { Plus, PlusSquare } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { TextField } from "../auth/register/TextField";
export default function CreateExpenditure() {
  const [isLoading, setIsLoading] = useState(false);
  const expSectors = useSelector(
    (state) => state.expenditure.expenditureSectors
  );

  const collectorValidator = Yup.object({
    amount: Yup.number().required("***"),
    newExp: Yup.string(),
  });
  useEffect(() => {
    //call getExppourpose here
  }, []);
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
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  //   collectorPostHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="newexp">
                      <div
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
                      </div>
                      <FtextField
                        style={{ marginRight: "10px" }}
                        type="number"
                        label="পরিমাণ"
                        name="amount"
                      ></FtextField>
                    </div>
                    <h6 className="mt-2">পূর্বের খাতসমূহ থেকে সিলেক্ট করুন</h6>
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
                        // onSelect={}
                      >
                        {expSectors?.map((exp) => {
                          return <option value={exp.name}>{exp.name}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <h6>খরচের বিবরণ </h6>
                      <textarea
                        name=""
                        id=""
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
