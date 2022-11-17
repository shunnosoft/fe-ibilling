import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import * as Yup from "yup";
import { createProductApi } from "../../../features/actions/inventoryAction";

export default function ProductPostModal() {
  //import hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get data from redux store
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //declare local state
  const [isLoading, setIsLoading] = useState(false);
  const [productDescription, setProductDescription] = useState("");

  const submitHandler = (data) => {
    if (!productDescription) {
      return alert("Please enter product description");
    }
    const productData = {
      ...data,
      description: productDescription,
      ispOwner,
    };
    createProductApi(dispatch, productData, setIsLoading);
  };

  //validator
  const productValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    purchaseAmount: Yup.string().required("Please Enter Purchase amount"),
    sellAmount: Yup.string().required("Please Enter sell amount"),
    quantity: Yup.string().required("Please Enter quantity"),
  });

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="productModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addProduct")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-4">
              <Formik
                initialValues={{
                  name: "",
                  description: "",
                  purchaseAmount: "",
                  sellAmount: "",
                  quantity: "",
                }}
                validationSchema={productValidator}
                onSubmit={submitHandler}
              >
                {() => (
                  <Form>
                    {/* <div className="displayGrid3"> */}
                    <FtextField
                      type="text"
                      label={t("name")}
                      name="name"
                      validation={"true"}
                    />
                    <textarea
                      name="description"
                      validation={"true"}
                      placeholder={t("description")}
                      className="form-control shadow-none mb-1"
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                    <FtextField
                      type="number"
                      label={t("purchaseAmount")}
                      name="purchaseAmount"
                    />
                    {/* </div> */}

                    {/* <div className="displayGrid3"> */}
                    <FtextField
                      type="number"
                      label={t("sellAmount")}
                      name="sellAmount"
                    />

                    <FtextField
                      type="text"
                      label={t("quantity")}
                      name="quantity"
                    />
                    {/* </div> */}
                    {/* <div className="displayGrid3">
                      <FtextField
                        type="number"
                        label={t("salary")}
                        name="salary"
                        validation={"true"}
                      />
                    </div> */}

                    <div className="modal-footer modalFooterEdit">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancel")}
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
