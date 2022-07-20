import React, { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { changePackageApi } from "../features/getIspOwnerUsersApi";
import Loader from "../components/common/Loader";

const animatedComponents = makeAnimated();

const PackageChangeModal = () => {
  const packages = useSelector((state) => state.package.packages);
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );

  const options = packages.map((item) => {
    return { value: item.id, label: item.name };
  });

  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const changePackageController = async () => {
    const sendingData = {
      mikrotikPackage: selectedPackage.value,
      pppoe: {
        service: "pppoe",
        disabled: userData.pppoe.disabled,
        name: userData.pppoe.name,
        password: userData.pppoe.password,
        profile: selectedPackage.name,
      },
    };
    console.log(sendingData);
    changePackageApi(sendingData, setLoading);
  };

  return (
    <div class="modal fade" id="change_package_modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-black">Change Package</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
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
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onClick={changePackageController}
              type="button"
              class="btn btn-primary"
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
