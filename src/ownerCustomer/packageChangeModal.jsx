import React, { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { changePackageApi } from "../features/getIspOwnerUsersApi";
import Loader from "../components/common/Loader";

const animatedComponents = makeAnimated();

const PackageChangeModal = () => {
  // get all packages
  const packages = useSelector((state) => state.package.packages);

  // get own data
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  // package select option
  const options = packages.map((item) => {
    if (userData?.reseller) {
      return { value: item.id, label: item.name };
    } else {
      return { value: item.id, label: item?.aliasName || item.name };
    }
  });

  // loading state
  const [loading, setLoading] = useState(false);

  // package select option
  const [selectedPackage, setSelectedPackage] = useState(null);

  // handle submit method
  const changePackageController = () => {
    const sendingData = {
      customer: userData.id,
      mikrotikPackage: selectedPackage.value,
      name: userData.name,
      mobile: userData.mobile,
      customerId: userData.customerId,
      previousPackage: userData.mikrotikPackage,
      status: "pending",
      // pppoe: {
      //   service: "pppoe",
      //   disabled: userData.pppoe.disabled,
      //   name: userData.pppoe.name,
      //   password: userData.pppoe.password,
      //   profile: selectedPackage.label,
      // },
    };
    if (userData.reseller) {
      sendingData.reseller = userData.reseller;
    } else {
      sendingData.ispOwner = userData.ispOwner.id;
    }
    console.log(sendingData);
    changePackageApi(sendingData, setLoading);
  };

  return (
    <div className="modal fade" id="change_package_modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-black">Change Package</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Select
              className="w-100 mt-1 text-black"
              defaultValue={selectedPackage}
              onChange={setSelectedPackage}
              options={options}
              placeholder="Select Package"
              isSearchable
              components={animatedComponents}
              id="selectMonth"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onClick={changePackageController}
              type="button"
              className="btn btn-primary"
            >
              {loading ? <Loader /> : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageChangeModal;
