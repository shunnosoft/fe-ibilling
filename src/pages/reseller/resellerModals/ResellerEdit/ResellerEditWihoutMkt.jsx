import PackageSelect from "./PackageSelect";

const GlobalPackageEditWithOutMkt = ({
  packages,
  handelMikrotikPakages,
  mikroTikPackagesId,
}) => {
  return (
    <>
      {packages.map((p) => (
        <div key={p.id} className="w-75">
          <PackageSelect
            id={p.id + "input009"}
            onChangeHandler={handelMikrotikPakages}
            isChecked={mikroTikPackagesId.includes(p.id)}
            packageInfo={{
              name: p.name,
              id: p.id,
            }}
          />
        </div>
      ))}
    </>
  );
};

export const PackageBasedEditWithOutMkt = ({
  packages,
  handelMikrotikPakages,
  mikroTikPackagesId,
  commissionType,
  handlePackageDividerInput,
  packageRateType,
  packageCommisson,
}) => {
  return (
    <>
      {packages.map((p) => {
        const value = packageCommisson?.reduce((acc, curr) => {
          if (curr?.mikrotikPackage === p.id) {
            acc = curr.ispOwnerRate;
          }
          return acc;
        }, "");

        return (
          <div key={p.id} className="w-75">
            <PackageSelect
              id={p.id + "input009"}
              onChangeHandler={handelMikrotikPakages}
              isChecked={mikroTikPackagesId.includes(p.id)}
              packageInfo={{
                name: p.name,
                id: p.id,
              }}
            />
            {commissionType === "packageBased" && (
              <div
                className={`d-flex align-items-center ${
                  mikroTikPackagesId.includes(p.id) ? "d-block" : "d-none"
                }`}
              >
                <input
                  className="form-control w-75 shadow-none m-1"
                  type="number"
                  id={p.id + "inputform"}
                  name={p.id}
                  onChange={handlePackageDividerInput}
                  min={0}
                  max={packageRateType === "percentage" ? 100 : undefined}
                  value={value}
                />
                {packageRateType === "percentage" ? (
                  <p className="mx-1">%</p>
                ) : (
                  <p className="mx-1">&#2547;</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default GlobalPackageEditWithOutMkt;
