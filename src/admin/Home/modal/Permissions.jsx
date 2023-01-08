import React from "react";
import { ispOwnerPermission } from "../ispOwnerPermission/Permission";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { updateOwner } from "../../../features/apiCallAdmin";
import { useDispatch } from "react-redux";

const Permissions = ({ ownerId }) => {
  const dispatch = useDispatch();
  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // get single isp owner data
  const ownerData = ispOwners.find((item) => item.id === ownerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // permission state
  const [permissions, setPermissions] = useState([]);

  console.log(ownerData?.bpSettings);

  // set permission in state
  useEffect(() => {
    if (ownerData) {
      setPermissions(ispOwnerPermission(ownerData?.bpSettings));
    }
  }, [ownerData, ispOwners]);

  // handle change
  const handleChange = (e) => {
    const { name, checked } = e.target;
    let temp = permissions.map((val) =>
      val.value === name ? { ...val, isChecked: checked } : val
    );
    setPermissions(temp);
  };

  // submit handler
  const permissionHandler = () => {
    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });
    const updatePermission = {
      ...ownerData?.bpSettings,
      ...temp,
    };

    const sendingData = {
      ...ownerData,
      bpSettings: updatePermission,
    };

    updateOwner(ownerId, sendingData, setIsLoading, dispatch);
  };

  return (
    <div
      className="modal fade"
      id="clientParmissionModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title" id="exampleModalLabel">
              <div className="d-flex">
                <h5>
                  Changes Permission for{" "}
                  <span className="text-success"> {ownerData?.name} </span>
                </h5>
                {/* <h5 className="ms-5">
                    Mobile:
                    <span className="text-success"> {ispOwner?.mobile}</span>
                  </h5> */}
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* model body here */}

            <div style={{ display: "inline-block" }}>
              {permissions?.map((val, key) => (
                <div className="CheckboxContainer" key={key}>
                  <input
                    type="checkbox"
                    className="CheckBox"
                    name={val.value}
                    checked={val.isChecked}
                    onChange={handleChange}
                    id={val.value + key}
                  />
                  <label htmlFor={val.value + key} className="checkboxLabel">
                    {val.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={permissionHandler}
              className="btn btn-success customBtn"
              disabled={isLoading}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
