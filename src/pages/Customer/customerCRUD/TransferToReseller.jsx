import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// internal import
import Loader from "../../../components/common/Loader";
import { transferToResellerApi } from "../../../features/actions/customerApiCall";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import useISPowner from "../../../hooks/useISPOwner";

const TransferToReseller = ({ show, setShow, customerId, page }) => {
  //call dispatch
  const dispatch = useDispatch();

  //en bn hook call
  const { t } = useTranslation();

  //===> get user & current user data form useISPOwner hooks
  const { bpSettings } = useISPowner();

  const allSubArea = useSelector((state) => state?.area?.subArea);

  //get all reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  // get all customer
  const customer = useSelector((state) =>
    page === "pppoe"
      ? state?.customer?.customer
      : state?.customer?.staticCustomer
  );

  //state
  const [isLoading, setIsLoading] = useState(false);
  const [resellerId, setResellerId] = useState("");
  const [subAreaId, setSubAreaId] = useState("");

  // fing single reseller
  const selectedReseller = reseller.find((item) => item.id === resellerId);

  // select reseller sub areas handler
  let subAreas = [];
  if (selectedReseller) {
    subAreas = allSubArea?.filter((item) =>
      selectedReseller.subAreas.includes(item.id)
    );
  }

  // transfer to reseller
  const transferToReseller = () => {
    if (!resellerId || !subAreaId) {
      return alert("Please select a reseller and sub area");
    }

    //---> find single customer to transfer
    const selectedCustomer = customer.find((item) => item.id === customerId);

    let data;
    //---> check if selected reseller has mikrotik or not
    if (bpSettings?.hasMikrotik) {
      //---> check if selected reseller has mikrotik
      if (selectedReseller?.mikrotiks.includes(selectedCustomer.mikrotik)) {
        //---> check if selected reseller has package
        if (
          selectedReseller?.mikrotikPackages.includes(
            selectedCustomer.mikrotikPackage
          )
        ) {
          data = {
            ...selectedCustomer,
            reseller: selectedReseller.id,
            subArea: subAreaId,
          };
        } else {
          toast.error(t("customerDifferentPackage"));
        }
      } else {
        toast.error(t("customerDifferentMikrotik"));
      }
    } else {
      data = {
        ...selectedCustomer,
        reseller: selectedReseller.id,
        subArea: subAreaId,
      };
    }

    transferToResellerApi(dispatch, data, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("transferReseller")}
      >
        <div className="displayGrid">
          <div>
            <label className="form-label mb-0">{t("selectReseller")}</label>
            <select
              className="form-select mt-0 mw-100"
              onClick={(e) => setResellerId(e.target.value)}
            >
              <option selected value="">
                {t("selectReseller")}
              </option>
              {reseller.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label mb-0">{t("selectSubArea")}</label>
            <select
              className="form-select mt-0 mw-100"
              onClick={(e) => setSubAreaId(e.target.value)}
            >
              <option selected value="">
                {t("subArea")}
              </option>
              {subAreas.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>

          <button
            onClick={transferToReseller}
            type="button"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default TransferToReseller;
