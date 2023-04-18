import PackageSelect from "./PackageSelect";

const GlobalPackageEdit = ({
  mikrotikpakages,
  allowedMikrotik,
  resellerMikrotik,
  mikroHandler,
  handelMikrotikPakages,
  mikroTikPackagesId,
}) => {
  return (
    <>
      {mikrotikpakages?.mikrotiks?.map((item) => (
        <div key={item.id}>
          <div className="form-check">
            <input
              checked={allowedMikrotik?.includes(item.id)}
              disabled={resellerMikrotik?.includes(item.id)}
              type="checkbox"
              className="getValueUsingClassesforMikrotik form-check-input"
              value={item.id}
              id={item.id + "008"}
              onChange={(e) => mikroHandler(e.target.value)}
            />
            <label className="form-check-label" htmlFor={item.id + "008"}>
              <b className="h5">{item.name}</b>
            </label>
          </div>

          {mikrotikpakages.packages.map(
            (p) =>
              p.mikrotik === item.id && (
                <div key={p.id} className="displayFlex">
                  <PackageSelect
                    id={p.id + "input009"}
                    onChangeHandler={handelMikrotikPakages}
                    isDisabled={!allowedMikrotik.includes(p.mikrotik)}
                    isChecked={mikroTikPackagesId.includes(p.id)}
                    packageInfo={{
                      name: p.name,
                      id: p.id,
                    }}
                  />
                </div>
              )
          )}
        </div>
      ))}
    </>
  );
};

export const PackageBasedEdit = ({
  mikrotikpakages,
  allowedMikrotik,
  reseller,
  mikroHandler,
  handelMikrotikPakages,
  mikroTikPackagesId,
  commissionType,
  handlePackageDividerInput,
  packageRateType,
  packageCommisson,
}) => {
  return (
    <>
      <div className="row">
        {mikrotikpakages?.mikrotiks?.map((item) => (
          <div className="col-md-3" key={item.id}>
            <h6 className="form-check mt-3">
              <input
                checked={allowedMikrotik?.includes(item.id)}
                disabled={reseller?.mikrotiks.includes(item.id)}
                type="checkbox"
                className="getValueUsingClasses form-check-input"
                value={item.id}
                id={item.id + "008"}
                onChange={(e) => mikroHandler(e.target.value)}
              />
              <label className="form-check-label" htmlFor={item.id + "008"}>
                <b className="h5">{item.name}</b>
              </label>
            </h6>

            {mikrotikpakages.packages.map((p) => {
              const value = packageCommisson?.reduce((acc, curr) => {
                if (curr?.mikrotikPackage === p.id) {
                  acc = curr.ispOwnerRate;
                }
                return acc;
              }, "");

              return (
                p.mikrotik === item.id && (
                  <div className="w-100 my-1" key={p.id}>
                    <PackageSelect
                      id={p.id + "input009"}
                      onChangeHandler={handelMikrotikPakages}
                      isDisabled={!allowedMikrotik.includes(p.mikrotik)}
                      isChecked={mikroTikPackagesId.includes(p.id)}
                      packageInfo={{
                        name: p.name,
                        id: p.id,
                      }}
                    />
                    {commissionType === "packageBased" && (
                      <div
                        className={`d-flex align-items-center ${
                          mikroTikPackagesId.includes(p.id)
                            ? "d-block"
                            : "d-none"
                        }`}
                      >
                        <input
                          className="form-control w-75 shadow-none m-1"
                          type="number"
                          id={p.id + "inputform"}
                          name={p.id}
                          onChange={handlePackageDividerInput}
                          min={0}
                          max={
                            packageRateType === "percentage" ? 100 : undefined
                          }
                          value={value}
                          placeholder="Package Rate"
                        />
                        {packageRateType === "percentage" ? (
                          <p className="mx-1">%</p>
                        ) : (
                          <p className="mx-1">&#2547;</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default GlobalPackageEdit;
