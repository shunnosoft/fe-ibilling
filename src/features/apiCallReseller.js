import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

// import { hideModal } from "./actions/managerHandle";
import {
  
  FetchAreaSuccess,
} from "./areaSlice";
import {
  addCollectorSuccess,
  deleteCollectorSuccess,
  editCollectorSuccess,
  getCollectorBills,
  getCollectorSuccess,
} from "./collectorSlice";
import {
  addCustomerSuccess,
  deleteCustomerSuccess,
  editCustomerSuccess,
  getCustomerSuccess,
  updateBalance,
} from "./customerSlice";

import { updateProfile } from "./authSlice";
import {
  getAllBillsSuccess,
  getDepositSuccess,
  getmyDepositSucces,
  getTotalBalanceSuccess,
  updateDepositSuccess,
} from "./paymentSlice";
import { getChartSuccess } from "./chartsSlice";
import { getMikrotikSuccess, getpppoePackageSuccess } from "./mikrotikSlice";
import { getAllRechargeHistory } from "./rechargeSlice";

export const getCharts = async (dispatch, resellerId, Year, Month, User) => {
  try {
    let link = `/dashboard/${resellerId}?year=${Year}&month=${Month}`;
    if (User)
      link = `/dashboard/${resellerId}?year=${Year}&month=${Month}&user=${User}`;
    const res = await apiLink(link);
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
  }
};

//Areas

// export const getArea = async (dispatch, resellerId) => {
//   try {
//     const res = await apiLink.get(`/reseller/area/${resellerId}`);
//     dispatch(FetchAreaSuccess(res.data));
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// Collector
export const getCollector = async (dispatch, resellerId) => {
  try {
    const res = await apiLink.get(`/reseller/collector/${resellerId}`);
    dispatch(getCollectorSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

export const addCollector = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`reseller/collector/${data.reseller}`, data);
    dispatch(addCollectorSuccess(res.data));
    setIsLoading(false);
    toast.success("কালেক্টর সংযুক্ত সফল হয়েছে! ");
    document.querySelector("#collectorModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editCollector = async (dispatch, data, setIsLoading) => {
  const { resellerId, collectorId, ...rest } = data;
  try {
    const res = await apiLink.patch(
      `reseller/collector/${resellerId}/${collectorId}`,
      rest
    );
    dispatch(editCollectorSuccess(res.data));
    setIsLoading(false);
    toast.success("কালেক্টর এডিট সফল হয়েছে! ");
    document.querySelector("#collectorEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteCollector = async (dispatch, ids, setIsDeleting) => {
  setIsDeleting(true);
  try {
    await apiLink.delete(
      `reseller/collector/${ids.resellerId}/${ids.collectorId}`
    );
    dispatch(deleteCollectorSuccess(ids.collectorId));
    setIsDeleting(false);
    toast.success("কালেক্টর ডিলিট সফল হয়েছে");
  } catch (err) {
    if (err.response) {
      setIsDeleting(false);
      toast.error(err.response.data.message);
    }
  }
};

//Customers
export const getCustomer = async (dispatch, reseller, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/reseller/customer/${reseller}`);
    dispatch(getCustomerSuccess(res.data));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

 
export const addCustomer = async (dispatch, data, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.post("/reseller/customer", data);
    dispatch(addCustomerSuccess(res.data));
    setIsloading(false);
    toast.success("কাস্টমার সংযুক্ত সফল হয়েছে! ");
    document.querySelector("#customerModal").click();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editCustomer = async (dispatch, data, setIsloading) => {
   setIsloading(true)
  const { singleCustomerID, reseller, ...sendingData } = data;
  try {
    const res = await apiLink.patch(
      `/reseller/customer/${reseller}/${singleCustomerID}`,
      sendingData
    );
    dispatch(editCustomerSuccess(res.data));
    setIsloading(false);
    toast.success("কাস্টমার এডিট সফল হয়েছে!");
    document.querySelector("#customerEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteACustomer = async (dispatch, IDs) => {
  try {
    await apiLink.delete(`/reseller/customer/${IDs.ispID}/${IDs.customerID}`);
    dispatch(deleteCustomerSuccess(IDs.customerID));

    toast.success("কাস্টমার ডিলিট সফল হয়েছে! ");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
};

//password update
export const passwordUpdate = async (data, setIsLoadingpass) => {
  setIsLoadingpass(true);

  try {
    await apiLink.post(`/auth/update-password`, data);
    setIsLoadingpass(false);
    toast.success("পাসওয়ার্ড আপডেট সফল হয়েছে");
  } catch (error) {
    console.log(error.message);
    setIsLoadingpass(false);
    toast.error(error.response?.data.message);
  }
};

export const profileUpdate = async (dispatch, data, id, setIsLoading) => {
  setIsLoading(true);

  try {
    const res = await apiLink.patch(`/reseller/${id}`, data);
    console.log(res.data);
    dispatch(updateProfile(res.data));
    setIsLoading(false);
    toast.success("প্রোফাইল আপডেট সফল হয়েছে");
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
};

//Bill

export const billCollect = async (dispatch, billData, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/reseller/monthlyBill", billData);
    dispatch(updateBalance(res.data));
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();

    toast.success("বিল গ্রহণ সফল হয়েছে।");
  } catch (error) {
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();

    toast.error(error.response?.data.message);
  }
};

export const addDeposit = async (dispatch, data, setLoading) => {
  setLoading(true);
  // console.log(data, "from api calls");

  try {
    await apiLink.post(`/deposit`, data);

    // dispatch(addDepositSuccess(res.data));
    setLoading(false);
    toast.success("ডিপোজিট প্রদান সফল হয়েছে");
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data.message);
    // if (error.response.status === 400) {
    //   toast.success("ডিপোজিট অলরেডি পেন্ডিং এ আছে");
    // } else {

    // }
  }
};

//balance

export const getTotalbal = async (dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.get(`bill/monthlyBill/balance`);
    console.log(res.data);
    dispatch(getTotalBalanceSuccess(res.data));
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data.message);
  }
};

export const getDeposit = async (dispatch, data) => {
  try {
    const res = await apiLink.get(
      `/deposit/${data.depositerRole}/${data.resellerID}`
    );

    dispatch(getDepositSuccess(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

export const depositAcceptReject = async (
  dispatch,
  status,
  id,
  setAccLoading
) => {
  console.log(status, id);
  setAccLoading(true);
  try {
    const res = await apiLink.patch(`/deposit/${id}`, { status: status });
    dispatch(updateDepositSuccess(res.data));
    setAccLoading(false);
    toast.success("ডিপোজিট গ্রহণ সফল হয়েছে।");
  } catch (error) {
    setAccLoading(false);

    toast.error(error.response?.data.message);
  }
};

export const getAllBills = async (dispatch, resellerId) => {
  try {
    const res = await apiLink.get(`/reseller/bills/${resellerId}`);
    dispatch(getAllBillsSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

//my deposit

export const getMyDeposit = async (dispatch) => {
  try {
    const res = await apiLink.get("/deposit");
    dispatch(getmyDepositSucces(res.data));
  } catch (error) {
    console.log(error?.response?.data.message);
  }
};

//Collector Bills

export const getCollectorBill = async (dispatch) => {
  try {
    const res = await apiLink.get("/bill/monthlyBill");

    dispatch(getCollectorBills(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

//sub areas for reseller

export const getSubAreas = async (dispatch, resellerId) => {
  try {
    const res = await apiLink.get(`/reseller/subArea/${resellerId}`);
    dispatch(FetchAreaSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
};


// mikrotiks 

export const getMikrotik = async (dispatch,resellerId) =>{
  try {
      const res = await apiLink.get(`/reseller/mikrotik/${resellerId}`)
      dispatch(getMikrotikSuccess(res.data))
  } catch (error) {
    console.log(error)
    
  }
}

export const fetchpppoePackage = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/mikrotik/ppp/package/${IDs.mikrotikId}`,
    });
    dispatch(getpppoePackageSuccess(res.data));
  } catch (error) {
    
  }
};

export const rechargeHistoryfuncR =async (dispatch,resellerId)=>{
  try {
    const res = await apiLink.get(`/reseller/recharge/${resellerId}`)
    dispatch(getAllRechargeHistory(res.data))
  } catch (error) {
    console.log(error.response?.data.message)
    
  }
}