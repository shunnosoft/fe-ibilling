import { toast } from "react-toastify";
import { publicRequest } from "../../api/apiLink";
import { getCreateUser, getPublicHotspotPackages } from "./publicSlice";

const apiKey =
  "021b3d466696fc6044786ed6858a8e731051c83d4054a5f038e5e1eba42c323188374f1d05d852287462b5e67587bd91218f297ff71f088811778ea79a71677f";

export const getHotspotPublicPackage = async (
  dispatch,
  ispOwner,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await publicRequest.get(`isp/hotspot/package/${ispOwner}`, {
      headers: {
        apiKey,
      },
    });

    dispatch(getPublicHotspotPackages(res.data));
  } catch (error) {
    toast.error(error.data.message);
  }
  setIsLoading(false);
};

export const hotspotUserCreate = async (
  dispatch,
  ispOwner,
  data,
  setIsLoading,
  setModalStatus
) => {
  setIsLoading(true);
  try {
    const res = await publicRequest.post(`isp/hotspot/${ispOwner}`, data, {
      headers: {
        apiKey,
      },
    });
    dispatch(getCreateUser(res.data));
    toast.success("User Created successfully.");
    setModalStatus("");
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

export const hotspotUserFind = async (
  dispatch,
  ispOwner,
  mobile,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await publicRequest.get(
      `isp/find/customer/${ispOwner}?mobile=${mobile}`,
      {
        headers: {
          apiKey,
        },
      }
    );
    dispatch(getCreateUser(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};
