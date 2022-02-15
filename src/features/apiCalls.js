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
      toast("Manager added successfully");
      hideModal();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        toast("Manager add failed");
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
        toast(err.response.data.message);
      }
    });
};

export const editManager = async (dispatch, managerData) => {
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";
  try {
    console.log(managerData.ispOwner);
    console.log(managerData);
    const res = await apiLink.patch(
      `/v1/ispOwner/manager/${managerData.ispOwner}`,
      managerData
    );

    dispatch(managerEditSuccess(res.data));
    button.style.display = "initial";
    hideModal();
    toast("Manager edit successfull");
  } catch (error) {
    button.style.display = "initial";
    toast("Manager edit Failed");
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

export const addArea = async (dispatch, data) => {
  try {
    const res = await apiLink.post("/v1/ispOwner/area", data);
    dispatch(AddAreaSuccess(res.data));
    document.querySelector("#areaModal").click();
    toast("এরিয়া অ্যাড সফল হয়েছে ");
  } catch (error) {
    toast("Add area filed");
  }
};
export const editArea = async (dispatch, data) => {
  try {
    const res = await apiLink.patch(
      `/v1/ispOwner/area/${data.ispOwner}/${data.id}`,
      data
    );
    dispatch(EditAreaSuccess(res.data));
    document.querySelector("#areaEditModal").click();
    toast("এরিয়া এডিট সফল হয়েছে ");
  } catch (error) {
    toast("edit area filed");
  }
};

export const deleteArea = async (dispatch, data) => {
  try {
    await apiLink.delete(`/v1/ispOwner/area/${data.ispOwner}/${data.id}`);
    dispatch(DeleteAreaSuccess(data.id));
    toast("এরিয়া ডিলিট হয়েছে");
  } catch (error) {
    toast("এরিয়া ডিলিট failed");
  }
};

//subarea

export const addSubArea = async (dispatch, data) => {
  try {
    const res = await apiLink.post("/v1/ispOwner/subArea", data);

    dispatch(AddSubAreaSuccess(res.data));
    document.querySelector("#subAreaModal").click();
    toast("Sub এরিয়া অ্যাড সফল হয়েছে ");

    // hideModal();
  } catch (error) {
    toast(error.message);
  }
};

// PATCH sub area
export const editSubArea = async (dispatch, data) => {
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
      document.querySelector("#subAreaEditModal").click();
      toast("সাব-এরিয়া Edit সফল হয়েছে ");
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// DELETE sub area
export const deleteSubArea = async (dispatch, data) => {
  const { ispOwnerId, subAreaId, areaId } = data;

  await apiLink({
    url: `/v1/ispOwner/subArea/${ispOwnerId}/${subAreaId}`,
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        dispatch(DeleteSubAreaSuccess({ areaId, subAreaId }));
        document.querySelector("#subAreaModal").click();
        toast("সাব-এরিয়া Delete সফল হয়েছে ");
        // getArea(dispatch, ispOwnerId);
      }
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// Collector

export const getCollector = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/v1/ispOwner/collector/${ispOwnerId}`);
    dispatch(getCollectorSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const addCollector = async (dispatch, data) => {
  try {
    const res = await apiLink.post("v1/ispOwner/collector", data);
    dispatch(addCollectorSuccess(res.data));
    toast("কালেক্টর অ্যাড সফল হয়েছে! ");
    document.querySelector("#collectorModal").click();
  } catch (err) {
    if (err.response) {
      toast(err.response.data.message);
    }
  }
};

export const editCollector = async (dispatch, data) => {
  const { ispOwnerId, collectorId, ...rest } = data;
  try {
    const res = await apiLink.patch(
      `v1/ispOwner/collector/${ispOwnerId}/${collectorId}`,
      rest
    );
    dispatch(editCollectorSuccess(res.data));
    toast("কালেক্টর এডিট সফল হয়েছে! ");
    document.querySelector("#collectorEditModal").click();
  } catch (err) {
    if (err.response) {
      toast(err.response.data.message);
    }
  }
};

export const deleteCollector = async (dispatch, ids) => {
  try {
    await apiLink.delete(
      `v1/ispOwner/collector/${ids.ispOwnerId}/${ids.collectorId}`
    );
    dispatch(deleteCollectorSuccess(ids.collectorId));
    toast("কালেক্টর ডিলিট সফল হয়েছে! ");
  } catch (err) {
    if (err.response) {
      toast(err.response.data.message);
    }
  }
};

//Customers

export const getCustomer = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/v1/ispOwner/customer/${ispOwnerId}`);
    dispatch(getCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const addCustomer = async (dispatch, data) => {
  console.log(data);
  try {
    const res = await apiLink.post("/v1/ispOwner/customer", data);
    dispatch(addCustomerSuccess(res.data));
    toast("কাস্টমার অ্যাড সফল হয়েছে! ");
    document.querySelector("#customerModal").click();
  } catch (err) {
    if (err.response) {
      toast(err.response.data.message);
    }
  }
};

export const editCustomer = async (dispatch, data) => {
  const { singleCustomerID, ispOwner, ...sendingData } = data;

  try {
    const res = await apiLink.patch(
      `/v1/ispOwner/customer/${ispOwner}/${singleCustomerID}`,
      sendingData
    );
    dispatch(editCustomerSuccess(res.data));
    toast("কাস্টমার এডিট সফল হয়েছে! ");
    document.querySelector("#customerEditModal").click();
  } catch (err) {
    if (err.response) {
      toast(err.response.data.message);
    }
  }
};

export const deleteACustomer = async (dispatch, IDs) => {
  try {
    await apiLink.delete(
      `/v1/ispOwner/customer/${IDs.ispID}/${IDs.customerID}`
    );
    dispatch(deleteCustomerSuccess(IDs.customerID));
    toast("কাস্টমার ডিলিট সফল হয়েছে! ");
  } catch (err) {
    if (err.response) {
      toast(err.response.data.message);
    }
  }
};

//Mikrotik

// get Mikrotik Sync user
export const fetchMikrotikSyncUser = async (dispatch, IDs) => {
  await apiLink({
    method: "GET",
    url: `/v1/mikrotik/customer/${IDs.ispOwner}/${IDs.mikrotikId}`,
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncUserSuccess(res.data));
    })
    .catch(() => {
      toast("Sync গ্রাহক পাওয়া যায়নি!");
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
    console.log(error.message);
  }
};

// POST mikrotik
export const postMikrotik = async (dispatch, data) => {
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
      document.querySelector("#MikrotikModal").click();
      toast("মাইক্রোটিক অ্যাড সফল হয়েছে ");
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
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
      toast("মাইক্রোটিক এডিট সফল হয়েছে ");
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// GET single mikrotik
export const fetchSingleMikrotik = async (mikrotik, id) => {
  const data = mikrotik.find((item) => item.id === id);
  if (data) {
    return data;
  } else {
    toast("Single mikrotik pawa jay ni");
  }
};

// DELETE single mikrotik
export const deleteSingleMikrotik = async (dispatch, IDs) => {
  await apiLink({
    method: "DELETE",
    url: `/v1/mikrotik/${IDs.ispOwner}/${IDs.id}`,
  })
    .then((res) => {
      dispatch(deleteMikrotikSuccess(IDs.id));
      // toast("মাইক্রোটিক ডিলিট সফল হয়েছে");
    })
    .catch(() => {
      toast("Server Error!");
    });
};

//  test
export const mikrotikTesting = async (IDs) => {
  await apiLink({
    method: "GET",
    url: `/v1/mikrotik/testConnection/${IDs.ispOwner}/${IDs.id}`,
  })
    .then(() => {
      toast("মাইক্রোটিক কানেকশন ঠিক আছে");
    })
    .catch(() => {
      toast("Error - মাইক্রোটিক কানেকশন !");
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
    toast("PPPoE গ্রাহক পাওয়া যায়নি!");
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
    toast("এক্টিভ গ্রাহক পাওয়া যায়নি!");
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
  } catch (error) {
    toast("PPPoE প্যাকেজ পাওয়া যায়নি!");
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
      toast("PPPoE প্যাকেজ রেট এডিট সফল হয়েছে!");
    })
    .catch((err) => {
      if (err.response) {
        toast("Error! ", err.response.message);
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
      toast("PPPoE প্যাকেজ ডিলিট সফল হয়েছে!");
    })
    .catch((err) => {
      if (err.response) {
        toast("ডিলিট Error! ", err.response.message);
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
export const postReseller = async (dispatch, data) => {
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
      document.querySelector("#resellerModal").click();
      toast("রি-সেলার অ্যাড সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// Edit reseller
export const editReseller = async (dispatch, data) => {
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
      document.querySelector("#resellerModalEdit").click();
      toast("রি-সেলার Edit সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// Delete reseller
export const deleteReseller = async (dispatch, IDs) => {
  const { ispId, resellerId } = IDs;
  await apiLink({
    url: `/v1/ispOwner/reseller/${ispId}/${resellerId}`,
    method: "DELETE",
  })
    .then(() => {
      dispatch(deleteResellerSuccess(resellerId));
      document.querySelector("#resellerModal").click();
      toast("রি-সেলার Delete সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

//profile Update

// const profileUpdate =async(dispatch,data)=>{
//   try {
//     const res = await apiLink.post()

//   } catch (error) {
//     toast("Profile Update failed")

//   }

// }

//password update
export const passwordUpdate = async (data) => {

   
  try {
    await apiLink.post(`/v1/auth/update-password`, data);

    toast("password update successfull");
  } catch (error) {
    console.log(error.message)
    toast(error.message);
  }
};

export const profileUpdate=async (dispatch,data, id) =>{

  try {
   const res =  await apiLink.patch(`/v1/ispOwner/${id}`,data); 
    dispatch(updateProfile(res.data))
    toast("Profile Update successfull")
  } catch (error) {
    toast(error.message)
    
  }

}