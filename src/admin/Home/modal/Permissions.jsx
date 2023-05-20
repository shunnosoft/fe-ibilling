import React from "react";
import { ispOwnerPermission } from "../ispOwnerPermission/Permission";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { updateOwner } from "../../../features/apiCallAdmin";
import { useDispatch } from "react-redux";

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const Permissions = ({ ownerId, openIs }) => {
  const dispatch = useDispatch();
  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // get single isp owner data
  const ownerData = ispOwners.find((item) => item.id === ownerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // permission state
  const [permissions, setPermissions] = useState([]);

  //modal handler
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  // set permission in state
  useEffect(() => {
    if (openIs) {
      setShow(openIs);
    }
    if (ownerData) {
      setPermissions(ispOwnerPermission(ownerData?.bpSettings));
    }
  }, [openIs, ownerData, ispOwners]);

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

    updateOwner(ownerId, sendingData, setIsLoading, dispatch, setShow);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <div className="d-flex">
              <h4 className="text-success me-3">Change Permissions : </h4>
              <h5 className="text-secondary me-3">
                NetFee Id:
                <span className="text-success">{ownerData?.netFeeId}</span>
              </h5>
              <h5 className="text-secondary me-3">
                Mobile:
                <span className="text-success">{ownerData?.mobile}</span>
              </h5>

              <h5 className="text-secondary me-3">
                Company:
                <span className="text-success">{ownerData?.company}</span>
              </h5>
              <h5 className="text-secondary me-3">
                Name:
                <span className="text-success">{ownerData?.name}</span>
              </h5>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {/* model body here */}

          <div className="container" style={{ display: "inline-block" }}>
            <div className="displayGrid3">
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
                  <label htmlFor={val.value + key} className="checkboxLabel ">
                    {val.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={handleClose}
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
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Permissions;
