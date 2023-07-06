import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  customerPackage,
  getPackagesByIspOwer,
} from "../features/getIspOwnerUsersApi";
import PackageChangeModal from "./packageChangeModal";
import moment from "moment";

//package change functional korte hobe
export default function Packages() {
  const dispatch = useDispatch();

  // get own data
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  // ispOwner permission
  const permission = userData?.ispOwner.bpSettings;

  // get all packages
  const packages = useSelector((state) => state.package.packages);

  // find alias name method
  const findAliasName = (ownPackage) => {
    const findItem = packages.find((item) => item.name.includes(ownPackage));
    return findItem;
  };

  const packageChange = (value) => {
    const temp = packages.find((item) => item.id === value);
    return temp;
  };

  // customer package
  const [changePackage, setChangePackage] = useState("");

  // get packages api call
  useEffect(() => {
    getPackagesByIspOwer(dispatch);
    customerPackage(userData.id, setChangePackage);
  }, []);

  return (
    <div className="client_page_packages mx-auto">
      {permission?.showCustomerPanelPackage ? (
        <>
          <p>Current package:</p>
          <div className="packages_info_wraper mw-75 ">
            <p>
              Package:{" "}
              {!userData?.reseller && (
                <span className="badge bg-secondary">
                  {findAliasName(userData?.pppoe.profile)?.aliasName ||
                    findAliasName(userData?.pppoe.profile)?.name}
                </span>
              )}
              {userData?.reseller && (
                <span className="badge bg-secondary">
                  {findAliasName(userData?.pppoe.profile)?.name}
                </span>
              )}
            </p>
            {permission?.showCustomerPanelPackage && (
              <p>
                Package rate:{" "}
                <span className="badge bg-warning text-dark">
                  {userData?.monthlyFee} TK
                </span>{" "}
              </p>
            )}

            {userData.userType === "pppoe" && (
              <button
                data-bs-toggle="modal"
                data-bs-target="#change_package_modal"
                className="btn btn-sm btn-success ms-3"
                disabled={changePackage.status === "pending"}
              >
                Change package
              </button>
            )}
          </div>

          {changePackage && (
            <div className="mt-3">
              <p style={{ color: "#3eff00" }}>Change Package :</p>
              <div className="packages_info_wraper d-flex justify-content-between w-25">
                <p>{moment(changePackage.createdAt).format("YYYY-MM-DD")}</p>
                <p>{packageChange(changePackage.mikrotikPackage)?.name}</p>
                <div>
                  {changePackage.status === "pending" ? (
                    <span className="badge bg-warning text-dark">
                      {changePackage.status}
                    </span>
                  ) : (
                    <span className="badge bg-success text-white">
                      {changePackage.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

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
                      {!userData?.reseller && (
                        <h5 className="card-title">
                          {item.aliasName || item.name}
                        </h5>
                      )}
                      {userData?.reseller && (
                        <h5 className="card-title">{item.name}</h5>
                      )}

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
        </>
      ) : (
        <>
          <div className="text-center mt-3">
            <p
              className="fs-4 fst-italic text-warning"
              style={{ fontWeight: "500" }}
            >
              Package not showing<span className="text-danger">!</span>
            </p>
          </div>
        </>
      )}

      <PackageChangeModal />
    </div>
  );
}
