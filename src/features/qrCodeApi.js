import { toast } from "react-toastify";

import { publicRequest } from "../api/apiLink";
const apiKey =
  "021b3d466696fc6044786ed6858a8e731051c83d4054a5f038e5e1eba42c323188374f1d05d852287462b5e67587bd91218f297ff71f088811778ea79a71677f";

export const getIspOwner = async (ispId, setIsLoading, setIspInfo) => {
  setIsLoading(true);
  try {
    const { data } = await publicRequest.get(`isp?netFeeId=${ispId}`, {
      headers: {
        apiKey,
      },
    });
    setIspInfo(data);
  } catch (error) {
    toast.error("Invalid ISP");
    console.log(error);
  }
  setIsLoading(false);
};

export const getCustomerInfo = async (
  ispOwnerId,
  setIsLoading,
  setCustomerInfo,
  input
) => {
  setIsLoading(true);

  try {
    const { data } = await publicRequest.get(
      `isp/customer/${ispOwnerId}?customerId=${input}`,
      {
        headers: {
          apiKey,
        },
      }
    );
    console.log(data);
    setCustomerInfo(data);
  } catch (error) {
    toast.error(error.response?.data?.message);

    console.log(error);
  }

  setIsLoading(false);
};
