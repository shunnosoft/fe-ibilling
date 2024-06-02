import React from "react";
import { useTranslation } from "react-i18next";
import InformationTooltip from "../../../../components/common/tooltipInformation/InformationTooltip";

const ResellerPermission = ({ useState }) => {
  const { t } = useTranslation();

  // get parent state
  const { permissions, setPermissions } = useState;

  // permission select  handle for the reseller
  const resellerPermissionHandler = (e) => {
    const { name, checked } = e.target;

    //  temporary state set collector single & multiple permission
    let temp = [...permissions];

    if (name === "allPermissions") {
      temp = temp.map((val) => ({ ...val, isChecked: checked }));
    } else {
      temp = temp.map((val) =>
        val.value === name ? { ...val, isChecked: checked } : val
      );
    }

    // set manager permissions state
    setPermissions(temp);
  };

  return (
    <>
      <div className="displayGrid3">
        <div className="CheckboxContainer">
          <input
            type="checkbox"
            className="CheckBox"
            name="allPermissions"
            onChange={resellerPermissionHandler}
            id="selectAllPermissions"
            checked={permissions.every((item) => item.isChecked)}
          />
          <label
            htmlFor="selectAllPermissions"
            className="checkboxLabel text-info fw-bold"
          >
            {t("allPermission")}
          </label>
        </div>

        {permissions.map((val, key) => (
          <div
            className="CheckboxContainer d-flex justify-content-between"
            key={key}
          >
            <div>
              <input
                type="checkbox"
                className="CheckBox"
                name={val.value}
                checked={val.isChecked}
                onChange={resellerPermissionHandler}
                id={val.value + key}
              />
              <label htmlFor={val.value + key} className="checkboxLabel">
                {val.label}
              </label>
            </div>

            {/* there is information to grant permission tooltip */}
            {val?.info && <InformationTooltip data={val} />}
          </div>
        ))}
      </div>
    </>
  );
};

export default ResellerPermission;
