import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import { postArea } from "../../../features/areaSlice";
import Loader from "../../../components/common/Loader";
import { fetchArea } from "../../../features/areaSlice";

export default function AreaPost() {
  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
  });

  const areaHandler = async (data) => {
    setIsLoading(true);
    if (auth.ispOwner) {
      const sendingData = {
        name: data.name,
        ispOwner: auth.ispOwner.id,
      };
      const response = await dispatch(postArea(sendingData));
      if (response) {
        dispatch(fetchArea(auth.ispOwner.id));
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="areaModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন এরিয়া অ্যাড করুন
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
                  name: "",
                  // ispOwner:
                }}
                validationSchema={linemanValidator}
                onSubmit={(values) => {
                  areaHandler(values);
                }}
              >
                {(formik) => (
                  <Form>
                    <FtextField type="text" label="এরিয়া নাম" name="name" />

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success customBtn"
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
