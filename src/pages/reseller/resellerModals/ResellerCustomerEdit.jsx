import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { fetchpppoePackage } from "../../../features/apiCalls";
import { editResellerCustomer } from "../../../features/resellerCustomerAdminApi";
// import { fetchpppoePackage } from "../../../features/apiCallReseller";

const ResellerCustomerEdit = ({ customerId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [packageId, setPackageId] = useState();
  console.log(packageId);
  // get all data from redux state
  const resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.resellerCustomer
  );

  const data = resellerCustomer.find((item) => item.id === customerId);
  console.log(data);

  const getMikrotik = useSelector(
    (state) => state.persistedReducer?.mikrotik?.mikrotik
  );

  console.log(getMikrotik);

  const singleMikrotik = getMikrotik.find((item) => item.id === data?.mikrotik);
  console.log(singleMikrotik?.id);

  useEffect(() => {
    setPackageId(data?.mikrotikPackage);
    if (singleMikrotik) {
      const IDs = {
        ispOwner: data?.ispOwner,
        mikrotikId: singleMikrotik?.id,
      };
      fetchpppoePackage(dispatch, IDs, singleMikrotik?.name);
    }
  }, [singleMikrotik?.id]);
  console.log(singleMikrotik);

  const ppPackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );
  console.log(ppPackage);

  const handleSubmit = () => {
    const sendingData = {
      mikrotik: singleMikrotik?.id,
      mikrotikPackage: packageId,
      pppoe: {
        name: data?.pppoe?.name,
        password: data?.pppoe?.password,
        service: data?.pppoe?.service,
        comment: data?.pppoe?.comment,
        profile: data?.pppoe?.profile,
        disabled: data?.pppoe?.disabled,
      },
    };
    console.log(sendingData);
    editResellerCustomer(
      dispatch,
      sendingData,
      data?.reseller,
      customerId,
      setIsLoading
    );
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="CustomerEditModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              এডিট করুন
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="comstomerFieldsTitle">মাইক্রোটিক সিলেক্ট করুন</p>
            <select
              className="form-select"
              aria-label="Default select example"
              // onChange={selectMikrotik}
              disabled
              value={data?.mikrotik || ""}
            >
              <option value={singleMikrotik?.id || ""}>
                {singleMikrotik?.name || ""}
              </option>
            </select>
            <div>
              <p className="comstomerFieldsTitle">প্যাকেজ সিলেক্ট করুন</p>
              <select
                className="form-select mb-3"
                aria-label="Default select example"
                onChange={(event) => setPackageId(event.target.value)}
              >
                {ppPackage &&
                  ppPackage?.map((item, key) => (
                    <option
                      selected={item.id === data?.mikrotikPackage}
                      key={key}
                      value={item.id || ""}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="modal-footer" style={{ border: "none" }}>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                disabled={isLoading}
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "সাবমিট"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerCustomerEdit;
