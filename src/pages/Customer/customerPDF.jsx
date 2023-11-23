import React, { forwardRef, useMemo } from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GeoAlt, Phone } from "react-bootstrap-icons";

const PrintCustomer = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { page, printCopy, currentCustomers, filterData, printOptions } = props;

  //user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  //user Data
  const userData = useSelector((state) =>
    userRole === "manager"
      ? state.persistedReducer.auth.ispOwnerData
      : state.persistedReducer.auth.userData
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  //get pppoe package
  const ppoePackage = useSelector((state) => state?.package?.pppoePackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  //total monthly fee and due calculation
  const monthlyFee = useMemo(() => {
    let totalMonthlyFee = 0;

    page === "customer" &&
      currentCustomers?.map((item) => {
        // sum of all monthly fee
        totalMonthlyFee += item.monthlyFee;
      });

    return { totalMonthlyFee };
  }, [page, currentCustomers]);

  // customer current package find
  const getCustomerPackage = (value) => {
    if (value?.userType === "hotspot") {
      const findPack = hotsPackage.find((item) =>
        item.id.includes(value?.hotspotPackage)
      );
      return findPack;
    } else if (value?.userType === "pppoe") {
      const findPack = ppoePackage.find((item) =>
        item.id.includes(value?.mikrotikPackage)
      );
      return findPack;
    } else {
      const findPack = allPackages.find((item) =>
        item.id.includes(value?.mikrotikPackage)
      );
      return findPack;
    }
  };

  return (
    <div ref={ref}>
      {page === "customer" && (
        <>
          <div className="page_header letter_header d-flex justify-content-end align-items-center pb-3 ">
            {/* <div className="logo_side">
          <div className="company_logo">
            <img src="/assets/img/logo.png" alt="Company Logo" />
          </div>
          <div className="company_name">{ispOwnerData.company}</div>
        </div> */}
            <div className="details_side">
              <p>
                {t("companyName")} {userData.company}
              </p>
              {userData?.address && (
                <p>
                  {t("address")} {userData?.address}
                </p>
              )}
            </div>
          </div>
          {filterData && (
            <ul className="d-flex justify-content-evenly filter_list">
              {filterData?.area && (
                <li>
                  {t("area")} : {filterData?.area}
                </li>
              )}
              {filterData?.subArea && (
                <li>
                  {t("subArea")} : {filterData?.subArea}
                </li>
              )}
              {filterData?.status && (
                <li>
                  {t("status")} : {filterData?.status}
                </li>
              )}
              {filterData?.payment && (
                <li>
                  {t("paymentStatus")} : {filterData?.payment}
                </li>
              )}
              {filterData?.startDate && (
                <li>
                  {t("startDate")} :
                  {moment(filterData?.startDate).format("DD-MM-YYYY")}
                </li>
              )}
              {filterData?.endDate && (
                <li>
                  {t("endDate")} :
                  {moment(filterData?.endDate).format("DD-MM-YYYY")}
                </li>
              )}
              {filterData?.customerType && (
                <li>
                  {t("customerType")} : {filterData?.customerType}
                </li>
              )}
            </ul>
          )}

          <ul className="d-flex justify-content-evenly filter_list">
            <li>
              {t("totalCustomer")} : {currentCustomers.length}
            </li>
            <li>
              {t("totalMonthlyFee")} :{" "}
              {FormatNumber(monthlyFee.totalMonthlyFee)}
            </li>
          </ul>
          <table className="table table-striped ">
            <thead>
              <tr className="spetialSortingRow">
                {printOptions?.map(
                  (item) =>
                    item.checked && (
                      <>
                        <th scope="col">{t(item.value)}</th>
                      </>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {page === "customer" &&
                currentCustomers?.map(
                  (val, key) =>
                    printOptions?.length > 0 && (
                      <tr key={key} id={val.id}>
                        {printOptions[0].checked && (
                          <td className="prin_td">{val?.customerId}</td>
                        )}
                        {printOptions[1].checked && (
                          <>
                            <td className="prin_td">
                              <p>{val.name}</p>
                              <p>
                                {val?.userType === "pppoe"
                                  ? val?.pppoe?.name
                                  : val?.userType === "firewall-queue"
                                  ? val?.queue?.address
                                  : val?.userType === "core-queue"
                                  ? val?.queue?.srcAddress
                                  : val?.userType === "simple-queue"
                                  ? val?.queue?.target
                                  : val?.hotspot?.name}
                              </p>
                            </td>
                          </>
                        )}
                        {printOptions[2].checked && (
                          <td className="prin_td">
                            <p>
                              <Phone className="text-info" />
                              {val?.mobile ? val?.mobile : "N/A"}
                            </p>

                            <p>
                              <GeoAlt /> {val?.address ? val?.address : "N/A"}
                            </p>
                          </td>
                        )}
                        {printOptions[3].checked && (
                          <td className="prin_td">
                            {val && getCustomerPackage(val)?.name}
                          </td>
                        )}
                        {printOptions[4].checked && (
                          <td className="prin_td">
                            <p>{val.monthlyFee}</p>
                            <p
                              className={`text-${
                                val?.balance > -1 ? "success" : "danger"
                              }`}
                            >
                              {val?.balance}
                            </p>
                          </td>
                        )}
                        {printOptions[5].checked && (
                          <td className="prin_td">
                            {moment(val?.billingCycle).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </td>
                        )}
                        {printOptions[6].checked && (
                          <td className="prin_td">
                            <p>{badge(val?.paymentStatus)}</p>
                            <p>{badge(val?.status)}</p>
                          </td>
                        )}
                        {printOptions[7].checked && (
                          <td className="prin_td">
                            {moment(val?.createdAt).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </td>
                        )}
                      </tr>
                    )
                )}
            </tbody>
          </table>
        </>
      )}

      {page === "billReport" && (
        <div>
          {printCopy === "both" && (
            <div>
              <div className="text-center mb-1">{t("officeCopy")}</div>
              <div
                className="text-center bg-primary text-white fw-bold p-1"
                style={{ borderRadius: "1.1rem" }}
              >
                <h2>{userData?.company}</h2>
                {userData?.address && (
                  <p>
                    {t("address")} : {userData?.address}
                  </p>
                )}
              </div>

              <div className="container">
                {printOptions.length > 0 && (
                  <div className="displayGridHorizontalFill5_5">
                    {printOptions[1].checked && (
                      <p>
                        {t("name")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers?.name}
                        </strong>
                      </p>
                    )}
                    {printOptions[2].checked && (
                      <p>
                        {t("pppoe")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers.pppoe?.name}
                        </strong>
                      </p>
                    )}
                    {printOptions[3].checked && currentCustomers?.mobile && (
                      <p>
                        {t("mobile")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers?.mobile}
                        </strong>
                      </p>
                    )}
                    {printOptions[4].checked && currentCustomers?.address && (
                      <p>
                        <span>
                          {t("address")} : {currentCustomers?.address}
                        </span>
                      </p>
                    )}
                    {printOptions[5].checked && (
                      <p>
                        {t("package")}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers.customer?.userType === "pppoe"
                            ? currentCustomers.package
                            : ""}
                        </strong>
                      </p>
                    )}
                    {printOptions[6].checked && (
                      <p>
                        {t("monthlyFee")}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers.customer?.monthlyFee}
                        </strong>
                      </p>
                    )}
                    <p>
                      {currentCustomers?.collectedBy && (
                        <span>
                          {t("billCollected")} : {currentCustomers?.name}
                        </span>
                      )}
                    </p>
                    {printOptions[15]?.checked && (
                      <p>
                        {t("paidDate")}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {moment(currentCustomers?.createdAt).format(
                            "MMM DD YYYY"
                          )}
                        </strong>
                      </p>
                    )}
                  </div>
                )}

                <table
                  className="table text-center align-center"
                  style={{ lineHeight: "7px" }}
                >
                  <tbody>
                    <tr>
                      <th>{t("billDhoron")}</th>
                      <td>
                        {currentCustomers?.billType == "bill"
                          ? t("bill")
                          : t("connectionFee")}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("amount")}</th>
                      <td> {currentCustomers?.amount}</td>
                    </tr>
                    <tr>
                      <th>{t("due")}</th>
                      <td>{currentCustomers?.due}</td>
                    </tr>
                    <tr>
                      <th>{t("discount")}</th>
                      <td>{currentCustomers?.discount}</td>
                    </tr>
                    <tr>
                      <th>{t("medium")}</th>
                      <td>{currentCustomers?.medium}</td>
                    </tr>
                    <tr>
                      <th>{t("billingCycle")}</th>
                      <td>
                        {moment(currentCustomers?.billingCycle).format(
                          "MMM DD YYYY"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("billComment")}</th>
                      <td>
                        {currentCustomers?.startDate && (
                          <span>
                            {moment(currentCustomers?.startDate).format(
                              "MMM DD YYYY"
                            )}{" "}
                            -
                          </span>
                        )}

                        {currentCustomers?.endDate && (
                          <span>
                            {moment(currentCustomers?.endDate).format(
                              "MMM DD YYYY"
                            )}
                          </span>
                        )}
                        <span>
                          {currentCustomers?.month} {currentCustomers?.note}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  className="d-flex justify-content-between h5"
                  style={{ marginTop: "1.8rem" }}
                >
                  <div>
                    <hr className="mb-1" />
                    <p>{t("Proprietor")}</p>
                  </div>

                  <div>
                    <hr className="mb-1" />
                    <p>{t("customer")}</p>
                  </div>
                </div>
              </div>

              {/* hhhhhhhhhhhhhhhhhhh */}
              <div>
                <hr className="mb-1 mt-1" />
              </div>
            </div>
          )}

          <div>
            <div className="text-center mb-1 ">{t("customerCopy")}</div>
            <div
              className="text-center bg-primary text-white fw-bold p-1 "
              style={{ borderRadius: "1.1rem" }}
            >
              <h2>{userData?.company}</h2>
              {userData?.address && (
                <p>
                  {t("address")} : {userData?.address}
                </p>
              )}
            </div>

            <div className="container">
              <div className="container">
                {printOptions.length > 0 && (
                  <div className="displayGridHorizontalFill5_5">
                    {printOptions[1].checked && (
                      <p>
                        {t("name")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers?.name}
                        </strong>
                      </p>
                    )}
                    {printOptions[2].checked && (
                      <p>
                        {t("pppoe")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers.pppoe?.name}
                        </strong>
                      </p>
                    )}
                    {printOptions[3].checked && currentCustomers?.mobile && (
                      <p>
                        {t("mobile")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers?.mobile}
                        </strong>
                      </p>
                    )}
                    {printOptions[4].checked && currentCustomers?.address && (
                      <p>
                        <span>
                          {t("address")} : {currentCustomers?.address}
                        </span>
                      </p>
                    )}
                    {printOptions[5].checked && (
                      <p>
                        {t("package")}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers.customer?.userType === "pppoe"
                            ? currentCustomers.package
                            : ""}
                        </strong>
                      </p>
                    )}
                    {printOptions[6].checked && (
                      <p>
                        {t("monthlyFee")}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {currentCustomers.customer?.monthlyFee}
                        </strong>
                      </p>
                    )}
                    <p>
                      {currentCustomers?.collectedBy && (
                        <span>
                          {t("billCollected")} : {currentCustomers?.name}
                        </span>
                      )}
                    </p>
                    {printOptions[15].checked && (
                      <p>
                        {t("paidDate")}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {moment(currentCustomers?.createdAt).format(
                            "MMM DD YYYY"
                          )}
                        </strong>
                      </p>
                    )}
                  </div>
                )}

                <table
                  className="table text-center align-center"
                  style={{ lineHeight: "7px" }}
                >
                  <tbody>
                    <tr>
                      <th>{t("billDhoron")}</th>
                      <td>
                        {currentCustomers?.billType == "bill"
                          ? t("bill")
                          : t("connectionFee")}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("amount")}</th>
                      <td> {currentCustomers?.amount}</td>
                    </tr>
                    <tr>
                      <th>{t("due")}</th>
                      <td>{currentCustomers?.due}</td>
                    </tr>
                    <tr>
                      <th>{t("discount")}</th>
                      <td>{currentCustomers?.discount}</td>
                    </tr>
                    <tr>
                      <th>{t("medium")}</th>
                      <td>{currentCustomers?.medium}</td>
                    </tr>
                    <tr>
                      <th>{t("billingCycle")}</th>
                      <td>
                        {moment(currentCustomers?.billingCycle).format(
                          "MMM DD YYYY"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("billComment")}</th>
                      <td>
                        {currentCustomers?.startDate && (
                          <span>
                            {moment(currentCustomers?.startDate).format(
                              "MMM DD YYYY"
                            )}{" "}
                            -
                          </span>
                        )}

                        {currentCustomers?.endDate && (
                          <span>
                            {moment(currentCustomers?.endDate).format(
                              "MMM DD YYYY"
                            )}
                          </span>
                        )}
                        <span>
                          {currentCustomers?.month} {currentCustomers?.note}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  className="d-flex justify-content-between h5"
                  style={{ marginTop: "1.8rem" }}
                >
                  <div>
                    <hr className="mb-1" />
                    <p>{t("Proprietor")}</p>
                  </div>

                  <div>
                    <hr className="mb-1" />
                    <p>{t("customer")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default PrintCustomer;
