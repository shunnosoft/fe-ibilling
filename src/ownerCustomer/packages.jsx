import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiLink from "../api/apiLink";
import { getPackagesByIspOwer } from "../features/getIspOwnerUsersApi";

//package change functional korte hobe
export default function Packages() {
  const dispatch = useDispatch();
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );

  const packages = useSelector((state) => state.package.packages);

  const changePackageController = async (selectedPackage) => {
    const sendingData = {
      mikrotikPackage: selectedPackage.id,
      pppoe: {
        service: "pppoe",
        disabled: userData.pppoe.disabled,
        name: userData.pppoe.name,
        password: userData.pppoe.password,
        profile: selectedPackage.name,
      },
    };

    const res = await apiLink.patch("/customer/package", sendingData);
    console.log(res.data.data);
  };

  useEffect(() => {
    getPackagesByIspOwer(dispatch);
  }, []);

  return (
    <div className="client_page_packages mx-auto">
      <p>Current package:</p>
      <div className="packages_info_wraper mw-75 ">
        <p>
          Package:{" "}
          <span className="badge bg-secondary">{userData?.pppoe.profile}</span>
        </p>
        <p>
          Package rate:{" "}
          <span className="badge bg-warning text-dark">
            {userData?.monthlyFee} TK
          </span>{" "}
        </p>
      </div>

      <h3 className="text-uppercase mt-3">Our packages</h3>

      <div className="packageList">
        <div className="row">
          {packages.map((item) => (
            <div className="col-md-4 package_list_card">
              <div
                className="card text-white mb-3"
                style={{ backgroundColor: "#1b2430" }}
              >
                <div className="card-header">Package</div>
                <div className="card-body " style={{ color: "#3eff00" }}>
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.rate}</p>
                </div>
                <div
                  onClick={() => changePackageController(item)}
                  className="card-footer bg-success package_select_button"
                >
                  Select package
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
