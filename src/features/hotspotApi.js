import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import { getPackageSuccess } from "./hotspotSlice";

const netFeeLang = localStorage.getItem("netFee:lang");
const langMessage = (color, bangla, english) => {
  // Notification for english language for
  if (netFeeLang === "bn") {
    if (color === "success") {
      return toast.success(bangla);
    } else {
      return toast.error(bangla);
    }
  }
  // Notification for Bangla language
  if (netFeeLang === "en") {
    if (color === "success") {
      return toast.success(english);
    } else {
      return toast.error(english);
    }
  }
};

export const getHotspotPackage = async (
  dispatch,
  ispOwner,
  mikrotikId,
  setHotspotPackageLoading
) => {
  setHotspotPackageLoading(true);
  try {
    const res = await apiLink.get(
      `hotspot/sync/package/${ispOwner}/${mikrotikId}`
    );
    dispatch(getPackageSuccess(res.data.updatedPackages));
    langMessage(
      "success",
      " প্যাকেজ সিঙ্ক সফল হয়েছে!",
      " Package sync Successfully"
    );
  } catch (err) {
    console.log(err.response.data);
    toast.error(err.response.data.message);
  }
  setHotspotPackageLoading(false);
};
