import apiLink from "../api/apiLink";

export const addStaticCustomerApi = async (
  dispatch,
  data,
  setIsloading,
  resetForm
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(
      "ispOwner/static-customer/" + data.ispOwner,
      data
    );
    console.log(res);
  } catch (error) {
    console.log(error.response);
  }
  setIsloading(false);
};
