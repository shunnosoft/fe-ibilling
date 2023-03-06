// import { publicRequest } from "../api/apiLink";

// export const getIspOwner = async (ispId, setIsLoading, setIspInfo) => {
//   setIsLoading(true);
//   try {
//     const res = await publicRequest.get(`isp?netFeeId=${ispId}`);

//     setIspInfo(res.data);
//   } catch (error) {
//     console.log(error);
//   }

//   setIsLoading(false);
// };

// export const getCustomerInfo = async (
//   ispOwnerId,
//   setIsLoading,
//   setCustomerInfo,
//   searchType,
//   input
// ) => {
//   setIsLoading(true);

//   let url = "";
//   if (searchType === "mobile") {
//     url = `isp/customer/${ispOwnerId}/?mobile=${input}&customerId=${""}`;
//   } else {
//     url = `isp/customer/${ispOwnerId}/?mobile=${""}&customerId=${input}`;
//   }

//   try {
//     const res = await publicRequest.get(url);
//     setCustomerInfo(res.data);
//   } catch (error) {
//     console.log(error);
//   }

//   setIsLoading(false);
// };
