import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPackagesByIspOwer } from "../features/getIspOwnerUsersApi";
import PackageChangeModal from "./packageChangeModal";

//package change functional korte hobe
export default function Packages() {
  const dispatch = useDispatch();

  // get own data
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  // get all packages
  const packages = useSelector((state) => state.package.packages);

  // find alias name method
  const findAliasName = (ownPackage) => {
    const findItem = packages.find((item) => item.name.includes(ownPackage));
    return findItem;
  };

  // get packages api call
  useEffect(() => {
    getPackagesByIspOwer(dispatch);
  }, []);

  return (
    <div className="client_page_packages mx-auto">
      <p>Current package:</p>
      <div className="packages_info_wraper mw-75 ">
        <p>
          Package:{" "}
          <span className="badge bg-secondary">
            {findAliasName(userData?.pppoe.profile)?.aliasName ||
              findAliasName(userData?.pppoe.profile)?.name}
          </span>
        </p>
        <p>
          Package rate:{" "}
          <span className="badge bg-warning text-dark">
            {userData?.monthlyFee} TK
          </span>{" "}
        </p>
        <button
          data-bs-toggle="modal"
          data-bs-target="#change_package_modal"
          className="btn btn-sm btn-success ms-3"
        >
          Change package
        </button>
      </div>

      <h3 className="text-uppercase mt-3">Our packages</h3>

      <div className="packageList">
        <div className="row">
          {packages.map((item) => (
            <div key={item.id} className="col-md-4 package_list_card">
              <div
                className="card text-white mb-3"
                style={{ backgroundColor: "#1b2430", position: "static" }}
              >
                <div className="card-header">Package</div>
                <div className="card-body " style={{ color: "#3eff00" }}>
                  <h5 className="card-title">{item.aliasName || item.name}</h5>
                  <p className="card-text">
                    {item.rate} TK /{" "}
                    <span className="badge bg-secondary">Month</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PackageChangeModal />
    </div>
  );
}
