import React, { forwardRef, useMemo } from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GeoAlt, Phone } from "react-bootstrap-icons";

const PrintCustomer = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const {
    page,
    printCopy,
    filterData,
    printOptions,
    customerData,
    currentCustomers,
  } = props;

  //user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  //user Data
  const userData = useSelector((state) =>
    ["manager", "reseller", "collector"].includes(userRole)
      ? state.persistedReducer.auth.ispOwnerData
      : state.persistedReducer.auth.userData
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

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
          <div className="text-center bg-primary text-white fw-bold shadow-sm p-2 mb-2 rounded">
            <p>
              {t("companyName")} {userData.company}
            </p>
            {userData?.address && (
              <p>
                {t("address")} {userData?.address}
              </p>
            )}
          </div>

          {filterData && (
            <ul className="d-flex justify-content-evenly mb-1">
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
                  {moment(filterData?.startDate).format("YYYY-MM-DD")}
                </li>
              )}
              {filterData?.endDate && (
                <li>
                  {t("endDate")} :
                  {moment(filterData?.endDate).format("YYYY-MM-DD")}
                </li>
              )}
              {filterData?.customerType && (
                <li>
                  {t("customerType")} : {filterData?.customerType}
                </li>
              )}
            </ul>
          )}

          <ul className="d-flex justify-content-evenly mb-1">
            <li>
              {t("totalCustomer")} : {currentCustomers.length}
            </li>
            <li>
              {t("totalMonthlyFee")} :{FormatNumber(monthlyFee.totalMonthlyFee)}
            </li>
          </ul>

          <table className="table table-striped ">
            <thead>
              {printOptions?.length > 0 && (
                <tr className="spetialSortingRow">
                  {printOptions[0]?.checked && (
                    <th scope="col">{t(printOptions[0].value)}</th>
                  )}

                  {printOptions[1].checked && !printOptions[2].checked ? (
                    <th scope="col">{t(printOptions[1].value)}</th>
                  ) : !printOptions[1].checked && printOptions[2].checked ? (
                    <th scope="col">{t(printOptions[2].value)}</th>
                  ) : (
                    printOptions[1].checked &&
                    printOptions[2].checked && (
                      <th scope="col">
                        {t(printOptions[1].value)}/{t(printOptions[2].value)}
                      </th>
                    )
                  )}

                  {printOptions[3].checked && !printOptions[4].checked ? (
                    <th scope="col">{t(printOptions[3].value)}</th>
                  ) : !printOptions[3].checked && printOptions[4].checked ? (
                    <th scope="col">{t(printOptions[4].value)}</th>
                  ) : (
                    printOptions[3].checked &&
                    printOptions[4].checked && (
                      <th scope="col">
                        {t(printOptions[3].value)}/{t(printOptions[4].value)}
                      </th>
                    )
                  )}

                  {printOptions[5]?.checked && (
                    <th scope="col">{t(printOptions[5].value)}</th>
                  )}

                  {printOptions[6].checked && !printOptions[7].checked ? (
                    <th scope="col">{t(printOptions[6].value)}</th>
                  ) : !printOptions[6].checked && printOptions[7].checked ? (
                    <th scope="col">{t(printOptions[7].value)}</th>
                  ) : (
                    printOptions[6].checked &&
                    printOptions[7].checked && (
                      <th scope="col">
                        {t(printOptions[6].value)}/{t(printOptions[7].value)}
                      </th>
                    )
                  )}

                  {printOptions[8].checked && !printOptions[9].checked ? (
                    <th scope="col">
                      {t(printOptions[8].value)}&nbsp;
                      {t("date")}
                    </th>
                  ) : !printOptions[8].checked && printOptions[9].checked ? (
                    <th scope="col">
                      {t(printOptions[9].value)}&nbsp;
                      {t("date")}
                    </th>
                  ) : (
                    printOptions[8].checked &&
                    printOptions[9].checked && (
                      <th scope="col">
                        {t(printOptions[8].value)}/{t(printOptions[9].value)}
                      </th>
                    )
                  )}

                  {printOptions[10]?.checked && !printOptions[11]?.checked ? (
                    <th scope="col">{t(printOptions[10].value)}</th>
                  ) : !printOptions[10]?.checked &&
                    printOptions[11]?.checked ? (
                    <th scope="col">{t(printOptions[11].value)}</th>
                  ) : (
                    printOptions[10]?.checked &&
                    printOptions[11]?.checked && (
                      <th scope="col">
                        {t(printOptions[10].value)}/{t(printOptions[11].value)}
                      </th>
                    )
                  )}

                  {printOptions[12]?.checked && (
                    <th scope="col">{t(printOptions[12].value)}</th>
                  )}

                  {printOptions[13]?.checked && (
                    <th scope="col">{t(printOptions[13].value)}</th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {currentCustomers?.map(
                (val, key) =>
                  printOptions?.length > 0 && (
                    <tr key={key} id={val.id}>
                      {printOptions[0]?.checked && (
                        <td className="prin_td align-middle">
                          {val?.customerId}
                        </td>
                      )}

                      {printOptions[1]?.checked && !printOptions[2]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>{val.name}</p>
                        </td>
                      ) : !printOptions[1]?.checked &&
                        printOptions[2]?.checked ? (
                        <td className="prin_td align-middle">
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
                      ) : (
                        printOptions[1]?.checked &&
                        printOptions[2]?.checked && (
                          <td className="prin_td align-middle">
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
                        )
                      )}

                      {printOptions[3]?.checked && !printOptions[4]?.checked ? (
                        <td className="prin_td align-middle">
                          <p className="text-bolder">
                            {val?.mobile ? val?.mobile : "N/A"}
                          </p>
                        </td>
                      ) : !printOptions[3]?.checked &&
                        printOptions[4]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>{val?.address ? val?.address : "N/A"}</p>
                        </td>
                      ) : (
                        printOptions[3]?.checked &&
                        printOptions[4]?.checked && (
                          <td className="prin_td align-middle">
                            <p>
                              <Phone className="text-info" />
                              {val?.mobile ? val?.mobile : "N/A"}
                            </p>

                            <p>
                              <GeoAlt /> {val?.address ? val?.address : "N/A"}
                            </p>
                          </td>
                        )
                      )}

                      {printOptions[5]?.checked && (
                        <td className="prin_td align-middle">
                          {val && getCustomerPackage(val)?.name}
                        </td>
                      )}

                      {printOptions[6]?.checked && !printOptions[7]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>৳{val.monthlyFee}</p>
                        </td>
                      ) : !printOptions[6]?.checked &&
                        printOptions[7]?.checked ? (
                        <td className="prin_td align-middle">
                          <p
                            className={`text-${
                              val?.balance > -1 ? "success" : "danger"
                            }`}
                          >
                            ৳{val?.balance}
                          </p>
                        </td>
                      ) : (
                        printOptions[6]?.checked &&
                        printOptions[7]?.checked && (
                          <td className="prin_td align-middle">
                            <p>৳{val.monthlyFee}</p>
                            <p
                              className={`text-${
                                val?.balance > -1 ? "success" : "danger"
                              }`}
                            >
                              ৳{val?.balance}
                            </p>
                          </td>
                        )
                      )}

                      {printOptions[8]?.checked && !printOptions[9]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>
                            {moment(val?.billingCycle).format("YYYY-MM-DD")}
                          </p>
                        </td>
                      ) : !printOptions[8]?.checked &&
                        printOptions[9]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>{moment(val?.promiseDate).format("YYYY-MM-DD")}</p>
                        </td>
                      ) : (
                        printOptions[8]?.checked &&
                        printOptions[9]?.checked && (
                          <td className="prin_td align-middle">
                            <p>
                              {moment(val?.billingCycle).format("YYYY-MM-DD")}
                            </p>
                            <p>
                              {moment(val?.promiseDate).format("YYYY-MM-DD")}
                            </p>
                          </td>
                        )
                      )}

                      {printOptions[10]?.checked &&
                      !printOptions[11]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>{badge(val?.paymentStatus)}</p>
                        </td>
                      ) : !printOptions[10]?.checked &&
                        printOptions[11]?.checked ? (
                        <td className="prin_td align-middle">
                          <p>{badge(val?.status)}</p>
                        </td>
                      ) : (
                        printOptions[10]?.checked &&
                        printOptions[11]?.checked && (
                          <td className="prin_td align-middle">
                            <div className="d-flex gap-2">
                              <p>{badge(val?.paymentStatus)}</p>
                              <p>{badge(val?.status)}</p>
                            </div>
                          </td>
                        )
                      )}

                      {printOptions[12]?.checked && (
                        <td className="prin_td align-middle">
                          {moment(val?.createdAt).format("YYYY-MM-DD")}
                        </td>
                      )}

                      {printOptions[13]?.checked && (
                        <td className="prin_td align-middle">
                          {moment(val?.createdAt).format("YYYY-MM-DD")}
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
                {printOptions?.length > 0 && (
                  <div className="displayGridHorizontalFill5_5">
                    {printOptions[0]?.checked && (
                      <p>
                        {t(printOptions[0]?.value)} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData?.name}
                        </strong>
                      </p>
                    )}

                    {customerData?.mobile && printOptions[1]?.checked ? (
                      <p>
                        {t(printOptions[1]?.value)} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData?.mobile}
                        </strong>
                      </p>
                    ) : (
                      ""
                    )}

                    {printOptions[2]?.checked && (
                      <p>
                        {t(printOptions[2]?.value)}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData &&
                            getCustomerPackage(customerData)?.name}
                        </strong>
                      </p>
                    )}

                    {printOptions[3]?.checked && (
                      <p>
                        {t(printOptions[3]?.value)}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData?.monthlyFee}
                        </strong>
                      </p>
                    )}

                    {customerData?.address && printOptions[4]?.checked ? (
                      <p>
                        <span>
                          {t(printOptions[4]?.value)} :{customerData?.address}
                        </span>
                      </p>
                    ) : (
                      ""
                    )}

                    <p>
                      {currentCustomers?.collectedBy && (
                        <span>
                          {t("billCollected")} : {currentCustomers?.name}
                        </span>
                      )}
                    </p>

                    <p>
                      {t("paidDate")}:
                      <strong style={{ marginLeft: ".7rem" }}>
                        {moment(currentCustomers?.createdAt).format(
                          "MMM DD YYYY"
                        )}
                      </strong>
                    </p>
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
                            )}
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
                {printOptions?.length > 0 && (
                  <div className="displayGridHorizontalFill5_5">
                    {printOptions[0]?.checked && (
                      <p>
                        {t(printOptions[0]?.value)} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData?.name}
                        </strong>
                      </p>
                    )}

                    {customerData?.mobile && printOptions[1]?.checked ? (
                      <p>
                        {t(printOptions[1]?.value)} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData?.mobile}
                        </strong>
                      </p>
                    ) : (
                      ""
                    )}

                    {printOptions[2]?.checked && (
                      <p>
                        {t(printOptions[2]?.value)}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData &&
                            getCustomerPackage(customerData)?.name}
                        </strong>
                      </p>
                    )}

                    {printOptions[3]?.checked && (
                      <p>
                        {t(printOptions[3]?.value)}:
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData?.monthlyFee}
                        </strong>
                      </p>
                    )}

                    {customerData?.address && printOptions[4]?.checked ? (
                      <p>
                        <span>
                          {t(printOptions[4]?.value)} :{customerData?.address}
                        </span>
                      </p>
                    ) : (
                      ""
                    )}

                    <p>
                      {currentCustomers?.collectedBy && (
                        <span>
                          {t("billCollected")} : {currentCustomers?.name}
                        </span>
                      )}
                    </p>

                    <p>
                      {t("paidDate")}:
                      <strong style={{ marginLeft: ".7rem" }}>
                        {moment(currentCustomers?.createdAt).format(
                          "MMM DD YYYY"
                        )}
                      </strong>
                    </p>
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
                            )}
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
