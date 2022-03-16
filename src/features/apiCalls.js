import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import {
  managerAddSuccess,
  managerDeleteSuccess,
  managerEditSuccess,
  managerFetchFailure,
  managerFetchStart,
  managerFetchSuccess,
} from "./managerSlice";
import { hideModal } from "./actions/managerHandle";
import {
  AddAreaSuccess,
  AddSubAreaSuccess,
  DeleteAreaSuccess,
  DeleteSubAreaSuccess,
  EditAreaSuccess,
  EditSubAreaSuccess,
  FetchAreaSuccess,
} from "./areaSlice";
import {
  addCollectorSuccess,
  deleteCollectorSuccess,
  editCollectorSuccess,
  getCollectorSuccess,
} from "./collectorSlice";
import {
  addCustomerSuccess,
  deleteCustomerSuccess,
  editCustomerSuccess,
  getCustomerSuccess,
  updateBalance,
} from "./customerSlice";
import {
  addMikrotikSuccess,
  deleteMikrotikSuccess,
  deletepppoePackageSuccess,
  editMikrotikSuccess,
  editpppoePackageSuccess,
  fetchMikrotikSyncUserSuccess,
  getMikrotikSuccess,
  getpppoeActiveUserSuccess,
  getpppoePackageSuccess,
  getpppoeUserSuccess,
} from "./mikrotikSlice";
import {
  addResellerSuccess,
  deleteResellerSuccess,
  editResellerSuccess,
  getResellerrSuccess,
} from "./resellerSlice";
import { updateProfile } from "./authSlice";
import {
  getAllBillsSuccess,
  getDepositSuccess,
  getmyDepositSucces,
  getTotalBalanceSuccess,
  updateDepositSuccess,
} from "./paymentSlice";
import { getChartSuccess } from "./chartsSlice";
//manager
export const getManger = async (dispatch, ispWonerId) => {
  dispatch(managerFetchStart());
  try {
    const res = await apiLink.get(`/v1/ispOwner/manager/${ispWonerId}`);
    dispatch(managerFetchSuccess(res.data));
  } catch (error) {
    dispatch(managerFetchFailure());
  }
};

export const getCharts = async (dispatch, ispOwnerId, Year, Month, User) => {
  try {
    let link = `/v1/dashboard/${ispOwnerId}?year=${Year}&month=${Month}`;
    if (User)
      link = `/v1/dashboard/${ispOwnerId}?year=${Year}&month=${Month}&user=${User}`;
    const res = await apiLink(link);
    console.log("Charts: ", res.data);
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
  }
};

export const addManager = async (dispatch, managerData) => {
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";

  await apiLink({
    url: "/v1/ispOwner/manager",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: managerData,
  })
    .then((res) => {
      dispatch(managerAddSuccess(res.data));
      button.style.display = "initial";
      toast.success("Manager added successfully");
      document.querySelector("#writeModal").click();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        toast.error("Manager add failed");
      }
    });
};

export const deleteManager = async (dispatch, ispOwnerId) => {
  await apiLink({
    url: `/v1/ispOwner/manager/${ispOwnerId}`,
    method: "DELETE",
  })
    .then((res) => {
      dispatch(managerDeleteSuccess(res.data));
      // window.location.reload();
    })
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    });
};

export const editManager = async (dispatch, managerData, setIsLoading) => {
  setIsLoading(true);
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";
  try {
    const res = await apiLink.patch(
      `/v1/ispOwner/manager/${managerData.ispOwner}`,
      managerData
    );

    dispatch(managerEditSuccess(res.data));
    setIsLoading(false);
    button.style.display = "initial";
    hideModal();
    toast.success("Manager edit successfull");
  } catch (error) {
    setIsLoading(false);

    button.style.display = "initial";
    toast.error("Manager edit Failed");
  }
};

//Areas

export const getArea = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/v1/ispOwner/area/${ispOwnerId}`);
    dispatch(FetchAreaSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const addArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("/v1/ispOwner/area", data);

    dispatch(AddAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#areaModal").click();
    toast.success("এরিয়া অ্যাড সফল হয়েছে ");
  } catch (error) {
    setIsLoading(false);
    toast.error(error.message);
  }
};
export const editArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.patch(
      `/v1/ispOwner/area/${data.ispOwner}/${data.id}`,
      data
    );
    dispatch(EditAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#areaEditModal").click();
    toast.success("এরিয়া এডিট সফল হয়েছে ");
  } catch (error) {
    setIsLoading(false);
    toast.error("edit area filed");
  }
};

export const deleteArea = async (dispatch, data, setIsLoading) => {
  try {
    await apiLink.delete(`/v1/ispOwner/area/${data.ispOwner}/${data.id}`);
    dispatch(DeleteAreaSuccess(data.id));
    setIsLoading(false);
    toast.success("এরিয়া ডিলিট হয়েছে");
  } catch (error) {
    setIsLoading(false);
    toast.error("এরিয়া ডিলিট failed");
  }
};

//subarea

export const addSubArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("/v1/ispOwner/subArea", data);

    dispatch(AddSubAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#subAreaModal").click();
    toast.success("Sub এরিয়া অ্যাড সফল হয়েছে ");

    // hideModal();
  } catch (error) {
    setIsLoading(false);
    document.querySelector("#subAreaModal").click();
    toast.error(error.message);
  }
};

// PATCH sub area
export const editSubArea = async (dispatch, data, setIsLoading) => {
  const { ispOwnerID, id, ...rest } = data;
  await apiLink({
    url: `/v1/ispOwner/subArea/${ispOwnerID}/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(EditSubAreaSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#subAreaEditModal").click();
      toast.success("সাব-এরিয়া Edit সফল হয়েছে ");
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// DELETE sub area
export const deleteSubArea = async (dispatch, data, setIsLoading) => {
  const { ispOwnerId, subAreaId, areaId } = data;

  await apiLink({
    url: `/v1/ispOwner/subArea/${ispOwnerId}/${subAreaId}`,
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        dispatch(DeleteSubAreaSuccess({ areaId, subAreaId }));
        setIsLoading(false);
        document.querySelector("#subAreaModal").click();
        toast.success("সাব-এরিয়া Delete সফল হয়েছে ");
        // getArea(dispatch, ispOwnerId);
      }
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// Collector

export const getCollector = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/v1/ispOwner/collector/${ispOwnerId}`);
    dispatch(getCollectorSuccess(res.data));
  } catch (error) {
    toast.error(error.message);
  }
};

export const addCollector = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("v1/ispOwner/collector", data);
    dispatch(addCollectorSuccess(res.data));
    setIsLoading(false);
    toast.success("কালেক্টর অ্যাড সফল হয়েছে! ");
    document.querySelector("#collectorModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editCollector = async (dispatch, data, setIsLoading) => {
  const { ispOwnerId, collectorId, ...rest } = data;
  try {
    const res = await apiLink.patch(
      `v1/ispOwner/collector/${ispOwnerId}/${collectorId}`,
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
      `v1/ispOwner/collector/${ids.ispOwnerId}/${ids.collectorId}`
    );
    dispatch(deleteCollectorSuccess(ids.collectorId));
    setIsDeleting(false);
    toast.success("কালেক্টর ডিলিট সফল হয়েছে! ");
  } catch (err) {
    if (err.response) {
      setIsDeleting(false);
      toast.error(err.response.data.message);
    }
  }
};

//Customers
export const getCustomer = async (dispatch, ispOwner, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/v1/ispOwner/customer/${ispOwner}`);
    dispatch(getCustomerSuccess(res.data));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

export const addCustomer = async (dispatch, data, setIsloading) => {
  try {
    const res = await apiLink.post("/v1/ispOwner/customer", data);
    dispatch(addCustomerSuccess(res.data));
    setIsloading(false);
    toast.success("কাস্টমার অ্যাড সফল হয়েছে! ");
    document.querySelector("#customerModal").click();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editCustomer = async (dispatch, data, setIsloading) => {
  console.log("Edit Data: ", data);
  const { singleCustomerID, ispOwner, ...sendingData } = data;
  try {
    const res = await apiLink.patch(
      `/v1/ispOwner/customer/${ispOwner}/${singleCustomerID}`,
      sendingData
    );
    dispatch(editCustomerSuccess(res.data));
    setIsloading(false);
    toast.success("কাস্টমার এডিট সফল হয়েছে! ");
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
    await apiLink.delete(
      `/v1/ispOwner/customer/${IDs.ispID}/${IDs.customerID}`
    );
    dispatch(deleteCustomerSuccess(IDs.customerID));

    toast.success("কাস্টমার ডিলিট সফল হয়েছে! ");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
};

//Mikrotik

// get Mikrotik Sync user
export const fetchMikrotikSyncUser = async (dispatch, IDs, setIsLoadingCus) => {
  setIsLoadingCus(true);
  await apiLink({
    method: "GET",
    url: `/v1/mikrotik/customer/${IDs.ispOwner}/${IDs.mikrotikId}`,
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncUserSuccess(res.data));
      setIsLoadingCus(false);
      toast.success("PPPoE sync customer success");
    })
    .catch((error) => {
      setIsLoadingCus(false);
      toast.error(error.message);
    });
};

// GET mikrotik
export const fetchMikrotik = async (dispatch, ispOwnerId) => {
  try {
    const response = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/${ispOwnerId}`,
    });
    dispatch(getMikrotikSuccess(response.data));
  } catch (error) {
    toast.error(error.message);
  }
};

// POST mikrotik
export const postMikrotik = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  await apiLink({
    url: "/v1/mikrotik",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  })
    .then((res) => {
      dispatch(addMikrotikSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#MikrotikModal").click();
      toast.success("মাইক্রোটিক অ্যাড সফল হয়েছে ");
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// PATCH mikrotik
export const editSingleMikrotik = async (dispatch, data) => {
  const { ispId, id, ...rest } = data;

  await apiLink({
    url: `/v1/mikrotik/${ispId}/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(editMikrotikSuccess(res.data));
      document.querySelector("#configMikrotikModal").click();
      toast.success("মাইক্রোটিক এডিট সফল হয়েছে ");
    })
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    });
};

// GET single mikrotik
export const fetchSingleMikrotik = async (mikrotik, id) => {
  const data = mikrotik.find((item) => item.id === id);
  if (data) {
    return data;
  } else {
    toast.error("Single mikrotik not found!");
  }
};

// DELETE single mikrotik
export const deleteSingleMikrotik = async (
  dispatch,
  IDs,
  setIsloading,
  navigate
) => {
  setIsloading(true);
  await apiLink({
    method: "DELETE",
    url: `/v1/mikrotik/${IDs.ispOwner}/${IDs.id}`,
  })
    .then((res) => {
      dispatch(deleteMikrotikSuccess(IDs.id));
      setIsloading(false);
      toast.success("মাইক্রোটিক ডিলিট সফল হয়েছে");
      navigate("/mikrotik");
    })
    .catch((error) => {
      setIsloading(false);
      toast.error(error.message);
    });
};

//  test
export const mikrotikTesting = async (IDs) => {
  await apiLink({
    method: "GET",
    url: `/v1/mikrotik/testConnection/${IDs.ispOwner}/${IDs.id}`,
  })
    .then(() => {
      toast.success("মাইক্রোটিক কানেকশন ঠিক আছে");
    })
    .catch(() => {
      toast.error("Error - মাইক্রোটিক কানেকশন !");
    });
};

// get PPPoE user
export const fetchpppoeUser = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/PPPsecretUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    dispatch(getpppoeUserSuccess(res.data));
  } catch (error) {
    toast.error("PPPoE গ্রাহক পাওয়া যায়নি!");
  }
};

// get PPPoE Active user
export const fetchActivepppoeUser = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/PPPactiveUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    dispatch(getpppoeActiveUserSuccess(res.data));
  } catch (error) {
    toast.error("এক্টিভ গ্রাহক পাওয়া যায়নি!");
  }
};

// get pppoe Package
export const fetchpppoePackage = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/PPPpackages/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    dispatch(getpppoePackageSuccess(res.data));
    toast.success("PPPoE প্যাকেজ fetch success");
  } catch (error) {
    toast.error("PPPoE প্যাকেজ পাওয়া যায়নি!");
  }
};

// Edit pppoe Package
export const editPPPoEpackageRate = async (dispatch, data) => {
  const { mikrotikId, pppPackageId, ...rest } = data;
  await apiLink({
    method: "PATCH",
    url: `/v1/mikrotik/PPPpackage/${mikrotikId}/${pppPackageId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(editpppoePackageSuccess(res.data));
      document.querySelector("#pppoePackageEditModal").click();
      toast.success("PPPoE প্যাকেজ রেট এডিট সফল হয়েছে!");
    })
    .catch((err) => {
      if (err.response) {
        toast.error("Error! ", err.response.message);
      }
    });
};

// DELETE pppoe Package
export const deletePPPoEpackage = async (dispatch, IDs) => {
  const { mikrotikId, pppPackageId } = IDs;
  await apiLink({
    method: "DELETE",
    url: `/v1/mikrotik/PPPpackage/${mikrotikId}/${pppPackageId}`,
  })
    .then((res) => {
      dispatch(deletepppoePackageSuccess(pppPackageId));
      document.querySelector("#pppoePackageEditModal").click();
      toast.success("PPPoE প্যাকেজ ডিলিট সফল হয়েছে!");
    })
    .catch((err) => {
      if (err.response) {
        toast.error("ডিলিট Error! ", err.response.message);
      }
    });
};

// Reseller

// GET reseller
export const fetchReseller = async (dispatch, ispOwner) => {
  try {
    const res = await apiLink.get(`/v1/ispOwner/reseller/${ispOwner}`);
    dispatch(getResellerrSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
};

// add reseller
export const postReseller = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  await apiLink({
    url: "/v1/ispOwner/reseller",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  })
    .then((res) => {
      dispatch(addResellerSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#resellerModal").click();
      toast.success("রি-সেলার অ্যাড সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// Edit reseller
export const editReseller = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  const { ispId, resellerId, ...rest } = data;
  await apiLink({
    url: `/v1/ispOwner/reseller/${ispId}/${resellerId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(editResellerSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#resellerModalEdit").click();
      toast.success("রি-সেলার Edit সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// Delete reseller
export const deleteReseller = async (dispatch, IDs, setIsLoading) => {
  setIsLoading(true);
  const { ispId, resellerId } = IDs;
  await apiLink({
    url: `/v1/ispOwner/reseller/${ispId}/${resellerId}`,
    method: "DELETE",
  })
    .then(() => {
      dispatch(deleteResellerSuccess(resellerId));
      setIsLoading(false);
      document.querySelector("#resellerModal").click();
      toast.success("রি-সেলার Delete সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

//profile Update

// const profileUpdate =async(dispatch,data)=>{
//   try {
//     const res = await apiLink.post()

//   } catch (error) {
//     toast.success("Profile Update failed")

//   }

// }

//password update
export const passwordUpdate = async (data, setIsLoadingpass) => {
  setIsLoadingpass(true);

  try {
    await apiLink.post(`/v1/auth/update-password`, data);
    setIsLoadingpass(false);
    toast.success("password update successfull");
  } catch (error) {
    console.log(error.message);
    setIsLoadingpass(false);
    toast.error(error.message);
  }
};

export const profileUpdate = async (dispatch, data, id, setIsLoading) => {
  setIsLoading(true);

  try {
    const res = await apiLink.patch(`/v1/ispOwner/${id}`, data);
    console.log(res.data);
    dispatch(updateProfile(res.data));
    setIsLoading(false);
    toast.success("Profile Update successfull");
  } catch (error) {
    setIsLoading(false);
    toast.error(error.message);
  }
};

//Bill

export const billCollect = async (dispatch, billData, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/v1/bill/monthlyBill", billData);
    dispatch(updateBalance(res.data));
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();

    toast.success("Bill collect successfull");
  } catch (error) {
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();

    toast.error("Bill Collect Failed");
  }
};

export const addDeposit = async (dispatch, data, setLoading) => {
  setLoading(true);
  console.log(data, "from api calls");

  try {
    await apiLink.post(`/v1/deposit`, data);

    // dispatch(addDepositSuccess(res.data));
    setLoading(false);
    toast.success("ডিপোজিট  Success");
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
    const res = await apiLink.get(`v1/bill/monthlyBill/balance`);
    console.log(res.data);
    dispatch(getTotalBalanceSuccess(res.data));
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error.response.message);
  }
};

export const getDeposit = async (dispatch, data) => {
  try {
    const res = await apiLink.get(
      `/v1/deposit/${data.depositerRole}/${data.ispOwnerID}`
    );

    dispatch(getDepositSuccess(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

export const depositAcceptReject = async (dispatch, status, id) => {
  console.log(status, id);
  try {
    const res = await apiLink.patch(`/v1/deposit/${id}`, { status: status });
    dispatch(updateDepositSuccess(res.data));

    toast.success("Deposit Collect Success");
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllBills = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/v1/bill/${ispOwnerId}`);
    dispatch(getAllBillsSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

//my deposit

export const getMyDeposit = async (dispatch) => {
  try {
    const res = await apiLink.get("/v1/deposit");
    dispatch(getmyDepositSucces(res.data));
  } catch (error) {
    console.log(error?.response?.data.message);
  }
};
