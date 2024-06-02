import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FtextField } from "../../../../components/common/FtextField";
import { Card } from "react-bootstrap";
import useISPowner from "../../../../hooks/useISPOwner";
import { useSelector } from "react-redux";

const ResellerPackage = ({ reseller, useState }) => {
  const { t } = useTranslation();

  // get parent state
  const {
    ispCommission,
    commissionType,
    resellerPackage,
    packageBasedType,
    resellerMikrotik,
    packageCommission,
    resellerCommission,
    setIspCommission,
    setCommissionType,
    setResellerPackage,
    setPackageBasedType,
    setResellerMikrotik,
    setPackageCommission,
    setResellerCommission,
  } = useState;

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, hasMikrotik } = useISPowner();

  // get mikrotik pakages from redux store
  const { mikrotiks, packages } = useSelector(
    (state) => state.reseller.allMikrotikPakages
  );

  // get without mikrotik packages from redux store
  const woPackages = useSelector((state) => state.package.packages);

  useEffect(() => {
    // set ispOwner reseller mikrotik checked key include
    let tempMikrotiks = [];
    mikrotiks?.map((mikrotik) => {
      let modifiedMikrotik;
      if (reseller?.mikrotiks.includes(mikrotik.id)) {
        modifiedMikrotik = {
          ...mikrotik,
          isChecked: true,
        };
      } else {
        modifiedMikrotik = {
          ...mikrotik,
          isChecked: false,
        };
      }

      tempMikrotiks.push(modifiedMikrotik);
    });

    // set reseller mikrotik
    setResellerMikrotik(tempMikrotiks);

    // set ispOwner reseller mikrotik packages checked key include
    const allPackages = hasMikrotik ? packages : woPackages;
    let tempPackages = [];
    allPackages?.map((pack) => {
      let modifiedPackage;
      if (reseller?.mikrotikPackages.includes(pack.id)) {
        modifiedPackage = {
          ...pack,
          isChecked: true,
        };
      } else {
        modifiedPackage = {
          ...pack,
          isChecked: false,
        };
      }
      tempPackages.push(modifiedPackage);
    });

    // set reseller packages
    setResellerPackage(tempPackages);
  }, [reseller]);

  // reseller commission type global handler
  const resellerCommissionHandler = (e) => {
    setResellerCommission(e.target.value);
    setIspCommission(100 - e.target.value);
  };

  // mikrotik select handler for reseller
  const handleMikrotik = ({ target: { checked, id } }) => {
    let tempMikrotiks = [...resellerMikrotik];

    // temporary state set reseller single mikrotik
    tempMikrotiks = tempMikrotiks.map((val) =>
      val.id === id ? { ...val, isChecked: checked } : val
    );

    if (reseller?.mikrotiks.includes(id)) {
      // set reseller mikrotik
      setResellerMikrotik(tempMikrotiks);

      if (!checked) {
        //  temporary state set reseller single package
        let tempPackages = [...resellerPackage];

        tempPackages = tempPackages.map((val) =>
          val.mikrotik === id ? { ...val, isChecked: checked } : val
        );

        // set reseller mikrotik packages
        setResellerPackage(tempPackages);
      }
    } else {
      setResellerMikrotik(tempMikrotiks);
    }
  };

  // mikrotik package select handler for reseller
  const handleMikrotikPackage = ({ target: { checked, id } }) => {
    //  temporary state set reseller single package
    let temp = [...resellerPackage];

    temp = temp.map((val) =>
      val.id === id ? { ...val, isChecked: checked } : val
    );

    setResellerPackage(temp);
  };

  // mikrotik package rate handler for reseller pay
  const handleMikrotikPackageRate = ({ target: { id, value } }) => {
    // if package based then set package commission
    let tempPackageCommission = [...packageCommission];

    const existingPackage = tempPackageCommission.find(
      (item) => item.mikrotikPackage === id
    );

    let temp = { ...existingPackage };

    // if existing package then update else add
    if (existingPackage) {
      temp.ispOwnerRate = Number(value);
      tempPackageCommission[
        tempPackageCommission.findIndex((item) => item.mikrotikPackage === id)
      ] = temp;
    } else {
      const data = {
        ispOwner: ispOwnerId,
        ispOwnerRate: Number(value),
        mikrotikPackage: id,
      };

      tempPackageCommission.push(data);
    }

    setPackageCommission(tempPackageCommission);
  };
  console.log(resellerPackage);
  return (
    <>
      <div className="d-flex justify-content-evenly mt-4">
        <div>
          <p className="radioTitle">{t("commissionType")}</p>
          <div className="d-flex">
            <div className="form-check form-check-inline mt-0">
              <input
                id="global"
                className="form-check-input"
                type="radio"
                name="global"
                value="global"
                checked={commissionType === "global"}
                onChange={(e) => setCommissionType(e.target.value)}
              />

              <label className="form-check-label" htmlFor="global">
                {t("globalCommission")}
              </label>
            </div>

            <div className="form-check form-check-inline mt-0">
              <input
                id="packageBased"
                className="form-check-input"
                type="radio"
                name="packageBased"
                value="packageBased"
                checked={commissionType === "packageBased"}
                onChange={(e) => setCommissionType(e.target.value)}
              />

              <label className="form-check-label" htmlFor="packageBased">
                {t("packageBased")}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
        {commissionType === "global" && (
          <div className="displayGrid2">
            <div>
              <label className="form-check-label" htmlFor="commissionRate">
                {t("share")}
              </label>

              <input
                className="form-control"
                id="commissionRate"
                type="number"
                name="resellerCommission"
                value={resellerCommission}
                min={1}
                onChange={resellerCommissionHandler}
              />
            </div>

            <div>
              <label className="form-control-labels" htmlFor="ispOwner">
                {t("ispOwner")}
              </label>

              <input
                className="form-control"
                id="ispOwner"
                type="number"
                value={ispCommission}
                min={0}
                disabled={true}
              />
            </div>
          </div>
        )}

        {commissionType === "packageBased" && (
          <div className="w-25">
            <label className="form-control-label">{t("ispOwnerShare")}</label>
            <select
              className="form-select mw-100 mt-0"
              type="number"
              onChange={(e) => setPackageBasedType(e.target.value)}
            >
              <option
                selected={packageBasedType === "percentage"}
                value="percentage"
              >
                {t("percentage")}
              </option>

              <option
                selected={packageBasedType === "fixedRate"}
                value="fixedRate"
              >
                {t("fixedRate")}
              </option>
            </select>
          </div>
        )}
      </div>

      <Card className="bg-light border border-2 border-light mt-3">
        {hasMikrotik ? (
          <Card.Body className="displayGrid">
            <Card.Title className="inputLabelFontColor">
              {t("selectMikrotikPackage")}
            </Card.Title>
            <Card.Text>
              {commissionType === "global" ? (
                <div className="displayGrid3">
                  {resellerMikrotik?.map((item) => (
                    <div key={item.id}>
                      <div className="form-check">
                        <input
                          className={`form-check-input ${
                            item.isChecked ? `bg-success` : `bg-danger`
                          }
                        `}
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          onChange={handleMikrotik}
                          checked={item.isChecked}
                        />
                        <label className="form-check-label" htmlFor={item.id}>
                          <b className="h5">{item.name}</b>
                        </label>
                      </div>

                      {resellerPackage?.map(
                        (pack) =>
                          pack.mikrotik === item.id && (
                            <div key={pack.id} className="displayGrid gap-0">
                              <div className="packageBased">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  id={pack.id}
                                  onChange={handleMikrotikPackage}
                                  checked={pack.isChecked}
                                  disabled={!item.isChecked}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={pack.id}
                                >
                                  {pack.name}
                                </label>

                                <span className="text-secondary">
                                  &#2547;{pack.rate}
                                </span>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="displayGrid3">
                  {resellerMikrotik?.map((item) => (
                    <div key={item.id}>
                      <div className="form-check">
                        <input
                          className={`form-check-input ${
                            item.isChecked ? `bg-success` : `bg-danger`
                          }
                          `}
                          type="checkbox"
                          value={item.id}
                          id={item.id}
                          onChange={handleMikrotik}
                          checked={item.isChecked}
                        />
                        <label className="form-check-label" htmlFor={item.id}>
                          <b className="h5">{item.name}</b>
                        </label>
                      </div>

                      {resellerPackage?.map((pack) => {
                        const value = packageCommission?.reduce((acc, curr) => {
                          if (curr?.mikrotikPackage === pack.id) {
                            acc = curr.ispOwnerRate;
                          }
                          return acc;
                        }, "");
                        return (
                          pack.mikrotik === item.id && (
                            <div key={pack.id} className="displayGrid gap-0">
                              <div className="packageBased">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  id={pack.id}
                                  onChange={handleMikrotikPackage}
                                  checked={pack.isChecked}
                                  disabled={!item.isChecked}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={pack.id}
                                >
                                  {pack.name}
                                </label>

                                <span className="text-secondary">
                                  &#2547;{pack.rate}
                                </span>
                              </div>

                              <div
                                className={`d-flex align-items-center ${
                                  pack.isChecked ? "d-block" : "d-none"
                                }`}
                              >
                                <input
                                  className="form-control w-75 shadow-none m-1"
                                  type="number"
                                  id={pack.id}
                                  min={0}
                                  max={
                                    packageBasedType === "percentage"
                                      ? 100
                                      : undefined
                                  }
                                  value={value}
                                  onChange={handleMikrotikPackageRate}
                                  placeholder="Package Rate"
                                />
                                {packageBasedType === "percentage" ? (
                                  <p className="mx-1">%</p>
                                ) : packageBasedType === "fixedRate" ? (
                                  <p className="mx-1">&#2547;</p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </Card.Text>
          </Card.Body>
        ) : (
          <Card.Body className="displayGrid">
            <Card.Title className="inputLabelFontColor">
              {t("selectPacage")}
            </Card.Title>
            <Card.Text>
              {commissionType === "global" ? (
                <div className="displayGrid3">
                  <div>
                    {resellerPackage?.map((pack) => (
                      <div key={pack.id} className="displayGrid gap-0">
                        <div className="packageBased">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            id={pack.id}
                            onChange={handleMikrotikPackage}
                            checked={pack.isChecked}
                          />
                          <label className="form-check-label" htmlFor={pack.id}>
                            {pack.name}
                          </label>

                          <span className="text-secondary">
                            &#2547;{pack.rate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="displayGrid3">
                  {resellerPackage?.map((pack) => {
                    const value = packageCommission?.reduce((acc, curr) => {
                      if (curr?.mikrotikPackage === pack.id) {
                        acc = curr.ispOwnerRate;
                      }
                      return acc;
                    }, "");
                    return (
                      <div key={pack.id} className="displayGrid gap-0">
                        <div className="packageBased">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            id={pack.id}
                            onChange={handleMikrotikPackage}
                            checked={pack.isChecked}
                          />
                          <label className="form-check-label" htmlFor={pack.id}>
                            {pack.name}
                          </label>

                          <span className="text-secondary">
                            &#2547;{pack.rate}
                          </span>
                        </div>

                        <div
                          className={`d-flex align-items-center ${
                            pack.isChecked ? "d-block" : "d-none"
                          }`}
                        >
                          <input
                            className="form-control w-75 shadow-none m-1"
                            type="number"
                            id={pack.id}
                            min={0}
                            max={
                              packageBasedType === "percentage"
                                ? 100
                                : undefined
                            }
                            value={value}
                            onChange={handleMikrotikPackageRate}
                            placeholder="Package Rate"
                          />
                          {packageBasedType === "percentage" ? (
                            <p className="mx-1">%</p>
                          ) : packageBasedType === "fixedRate" ? (
                            <p className="mx-1">&#2547;</p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Text>
          </Card.Body>
        )}
      </Card>
    </>
  );
};

export default ResellerPackage;
