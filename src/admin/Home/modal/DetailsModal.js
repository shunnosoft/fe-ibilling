import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  ArchiveFill,
  KeyFill,
  PenFill,
  Person,
  PlugFill,
  Telephone,
  TextCenter,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/table/Table";
import {
  getSubAreas,
  getSubAreasApi,
} from "../../../features/actions/customerApiCall";
import { getIspOwnersStaffs } from "../../../features/apiCallAdmin";
import {
  deleteSingleMikrotik,
  fetchMikrotik,
} from "../../../features/apiCalls";
import { PasswordResetApi } from "../../../features/resetPasswordApi";
import { NumberChangeApi } from "../../../features/modifyNumberApi";
import TdLoader from "../../../components/common/TdLoader";

const DetailsModal = ({ ownerId }) => {
  // import dispatch
  const dispatch = useDispatch();

  // get all data
  const data = useSelector((state) => state.admin?.ispOwners);

  // get ispOwner staffs
  const staffs = useSelector((state) => state.admin?.staffs);

  // get all subareas
  const subAreas = useSelector((state) => state.area?.subArea);

  // get all ispOwner mikrotiks
  const allmikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  // get single isp owner data
  const ownerData = data.find((item) => item.id === ownerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //mikrotik connection state
  const [isChecking, setIsChecking] = useState(false);

  // reduced form resellerCustomerCount
  const customerCount = staffs?.resellerCustomerCount?.reduce((acc, curr) => {
    acc += curr.customerCount;
    return acc;
  }, 0);

  //mikrotik connection test handler
  const mikrotikConnectionTest = async (id, name) => {
    setIsChecking(true);

    await apiLink({
      method: "GET",
      url: `/mikrotik/testConnection/${ownerId}/${id}`,
    })
      .then(() => {
        setIsChecking(false);
        toast.success(`${name} এর কানেকশন ঠিক আছে`);
      })
      .catch(() => {
        setIsChecking(false);

        toast.error(`দুঃখিত, ${name} এর কানেকশন ঠিক নেই!`);
      });
  };

  //mikrotik delete handler
  const mikrotikDelete = (id) => {
    let confirm = window.confirm("You want to delete Mikrotik");
    if (confirm) {
      const deleteMiktotik = allmikrotiks.find((item) => item.id === id);
      const IDs = {
        ispOwner: deleteMiktotik.ispOwner,
        id: deleteMiktotik.id,
      };
      deleteSingleMikrotik(dispatch, IDs, setIsLoading);
    }
  };

  // ispOwner total customer
  const totalCustomer =
    customerCount +
    staffs.pppoeCustomerCount +
    staffs.firewallQueueCustomerCount +
    staffs.simpleQueueCustomerCount;

  //API call
  useEffect(() => {
    if (ownerId) {
      getIspOwnersStaffs(ownerId, dispatch, setIsLoading);
      getSubAreas(dispatch, ownerId);
      fetchMikrotik(dispatch, ownerId, setIsLoading);
    }
  }, [ownerId]);

  //Reset Password
  const resetPassHandler = (id) => {
    const confirm = window.confirm("Do you want to reset Password?");
    if (confirm) {
      PasswordResetApi(id, setIsLoading);
    }
  };

  const [editToggle, setEditToggle] = useState("");
  const [editNumber, setEditNumber] = useState("");

  //Mobile change handler
  const editNumberHandler = (MobileId, MobileRole) => {
    const data = {
      mobile: editNumber,
      profileId: MobileId,
      role: MobileRole,
    };

    const confirm = window.confirm("Do you want to update Number?");

    if (confirm) {
      NumberChangeApi(data, setIsLoading, setEditToggle, dispatch);
    }
  };

  //edit toggle handler
  const editHandler = (Pid) => {
    setEditToggle(Pid);
  };

  return (
    <>
      <div>
        <div
          className="modal fade"
          id="showCustomerDetails"
          tabIndex="-1"
          aria-labelledby="customerModalDetails"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title me-3">
                  netFee Id:
                  <span className="text-success"> {ownerData?.netFeeId} </span>
                </h5>
                <h5 className="modal-title me-3">
                  Mobile:
                  <span className="text-success"> {ownerData?.mobile} </span>
                </h5>
                <h5 className="modal-title me-3" id="customerModalDetails">
                  Name:
                  <span className="text-success"> {ownerData?.name} </span>
                </h5>
                <h5 className="modal-title me-3" id="customerModalDetails">
                  Company:
                  <span className="text-success"> {ownerData?.company} </span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {isLoading ? (
                  <TdLoader />
                ) : (
                  <Tabs
                    defaultActiveKey={"details"}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="details" title="Details">
                      <div class="d-flex justify-content-evenly pb-2">
                        <strong>
                          <p class="h6 m-2">Total Customer: {totalCustomer}</p>
                        </strong>
                        <strong>
                          <p class="h6 m-2">
                            PPPoE Customer: {staffs.pppoeCustomerCount}
                          </p>
                        </strong>
                        <strong>
                          <p class="h6 m-2">
                            Firewall Customer:{" "}
                            {staffs.firewallQueueCustomerCount}
                          </p>
                        </strong>

                        <strong>
                          <p class="h6 m-2">
                            Simple Customer: {staffs.simpleQueueCustomerCount}
                          </p>
                        </strong>
                        <strong>
                          <p class="h6 m-2">
                            Reseller Customer: {customerCount}
                          </p>
                        </strong>
                      </div>
                      <div className="profileMain">
                        <div>
                          <h5 class="text-primary">ISP Owner</h5>
                          <hr />

                          <table class="table table-bordered">
                            <tbody>
                              <tr>
                                <td scope="col">ISP ID</td>
                                <td>{ownerData?.id}</td>
                              </tr>
                              <tr>
                                <td scope="col">Name</td>
                                <td>{ownerData?.name}</td>
                              </tr>
                              <tr>
                                <td scope="col">Company</td>
                                <td>{ownerData?.company}</td>
                              </tr>
                              <tr>
                                <td scope="col">Mobile</td>
                                <td>{ownerData?.mobile}</td>
                              </tr>
                              <tr>
                                <td scope="col">Address</td>
                                <td>{ownerData?.address}</td>
                              </tr>
                              <tr>
                                <td scope="col">Email</td>
                                <td>
                                  <i className="text-body">
                                    {" "}
                                    {ownerData?.email}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Status</td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge bg-info">
                                      {ownerData?.status}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Signature</td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.signature}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">SMS Balance</td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge  bg-info">
                                      {ownerData?.smsBalance}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">SMS Rate</td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.smsRate}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">SMS Type</td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.smsType}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Bill Collection Type</td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge bg-info">
                                      {ownerData?.billCollectionType}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Create At</td>
                                <td>
                                  <i className="text-secondary">
                                    {moment(ownerData?.createdAt).format("lll")}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Division</td>
                                <td>{ownerData?.division}</td>
                              </tr>
                              <tr>
                                <td scope="col">District</td>
                                <td>{ownerData?.district}</td>
                              </tr>
                              <tr>
                                <td scope="col">Upazila</td>
                                <td>{ownerData?.upazila}</td>
                              </tr>
                            </tbody>
                          </table>

                          <br />
                          <h5 class="text-primary">Reference</h5>
                          <h6>
                            <strong>Name: </strong>
                            <i className="text-body">
                              {ownerData?.reference?.name}
                            </i>
                          </h6>
                          <h6>
                            <strong>Mobile: </strong>
                            <i className="text-body">
                              {ownerData?.reference?.mobile}
                            </i>
                          </h6>
                        </div>

                        <div>
                          <h5 class="text-primary">BP Setting</h5>
                          <hr />

                          <table class="table table-bordered">
                            <tbody>
                              <tr>
                                <td scope="col">Complain Management</td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings
                                      ?.complainManagement ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Customer Limit</td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge bg-info">
                                      {ownerData?.bpSettings?.customerLimit}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Customer Portal</td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings?.customerPortal ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Execute Billing Cycle </td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings
                                      ?.executeBillingCycle ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Mikrotik </td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings?.hasMikrotik ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Mikrotik Length </td>
                                <td>
                                  <i className="text-primary">
                                    <span class="badge bg-info">
                                      {allmikrotiks.length}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">PG</td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings?.hasPG ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Reseller </td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings?.hasReseller ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Inventory </td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings?.inventory ? (
                                      <span class="badge rounded-pill bg-success">
                                        YES
                                      </span>
                                    ) : (
                                      <span class="badge rounded-pill bg-danger">
                                        NO
                                      </span>
                                    )}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Invoice Date </td>
                                <td>
                                  <i className="text-danger">
                                    {ownerData?.bpSettings?.monthlyDueDate &&
                                      moment(
                                        ownerData?.bpSettings?.monthlyDueDate
                                      ).format("lll")}
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">
                                  Registration Payment Status{" "}
                                </td>
                                <td>
                                  {" "}
                                  <i className="text-body">
                                    <span
                                      class={`badge bg-${
                                        ownerData?.bpSettings?.paymentStatus ===
                                        "paid"
                                          ? "success"
                                          : "danger"
                                      }`}
                                    >
                                      {ownerData?.bpSettings?.paymentStatus}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Monthly Payment Status </td>
                                <td>
                                  <i className="text-body">
                                    <span
                                      class={`badge bg-${
                                        ownerData?.bpSettings
                                          ?.monthlyPaymentStatus === "paid"
                                          ? "success"
                                          : "danger"
                                      }`}
                                    >
                                      {
                                        ownerData?.bpSettings
                                          ?.monthlyPaymentStatus
                                      }
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Package </td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge bg-info">
                                      {ownerData?.bpSettings?.pack}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Package Type </td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge bg-info">
                                      {ownerData?.bpSettings?.packType}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Package Rate </td>
                                <td>
                                  <i className="text-body">
                                    <span class="badge bg-info">
                                      {ownerData?.bpSettings?.packageRate}
                                    </span>
                                  </i>
                                </td>
                              </tr>
                              <tr>
                                <td scope="col">Queue Type </td>
                                <td>
                                  <i className="text-body">
                                    {ownerData?.bpSettings?.queueType}
                                  </i>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="staffs" title="Staffs">
                      {isLoading ? (
                        <div className="text-center">
                          <Loader />
                        </div>
                      ) : (
                        <div className="staffs d-flex justify-content-evenly">
                          {staffs?.manager ? (
                            <div className="manager">
                              <h5 className="text-primary">Manager</h5>
                              <h6 className="mt-3">
                                <Person /> {staffs.manager.name}
                              </h6>

                              <h6>
                                <Telephone /> {staffs.manager.mobile}
                                {"  "}
                                <PenFill
                                  className="text-primary"
                                  onClick={() =>
                                    editHandler(staffs?.manager.id)
                                  }
                                />{" "}
                                <KeyFill
                                  className="text-danger"
                                  size={25}
                                  onClick={() =>
                                    resetPassHandler(staffs.manager.user)
                                  }
                                />
                              </h6>

                              {editToggle === staffs?.manager.id && (
                                <>
                                  <h6>
                                    <input
                                      type="number"
                                      className="w-75 me-2"
                                      onChange={(e) =>
                                        setEditNumber(e.target.value)
                                      }
                                    />
                                  </h6>
                                  <h6>
                                    <button
                                      onClick={() =>
                                        editNumberHandler(
                                          staffs.manager.id,
                                          "manager"
                                        )
                                      }
                                      class="btn btn-primary btn-sm py-0 me-3"
                                    >
                                      Submit
                                    </button>
                                    <button
                                      class="btn btn-primary btn-sm py-0"
                                      onClick={() => setEditToggle("")}
                                    >
                                      Cancel
                                    </button>
                                  </h6>
                                </>
                              )}
                            </div>
                          ) : (
                            <div>Manager not found !</div>
                          )}
                          {staffs.collectors?.length > 0 ? (
                            <div className="collector">
                              <h5 className="text-primary">
                                IspOwner Collectors
                              </h5>
                              {staffs.collectors?.map((item, key) => (
                                <>
                                  <h6 key={key} className="mt-3">
                                    <Person /> {item?.name}
                                  </h6>
                                  <h6>
                                    {" "}
                                    <Telephone /> {item?.mobile}
                                    {"  "}
                                    <PenFill
                                      className="text-primary"
                                      onClick={() => editHandler(item?.id)}
                                    />
                                    {"  "}
                                    <KeyFill
                                      className="text-danger"
                                      size={25}
                                      onClick={() =>
                                        resetPassHandler(item.user)
                                      }
                                    />
                                  </h6>

                                  {editToggle === item?.id && (
                                    <>
                                      <h6>
                                        <input
                                          type="number"
                                          className="w-75 me-2"
                                          onChange={(e) =>
                                            setEditNumber(e.target.value)
                                          }
                                        />
                                      </h6>
                                      <h6>
                                        <button
                                          onClick={() =>
                                            editNumberHandler(
                                              item.id,
                                              "collector"
                                            )
                                          }
                                          class="btn btn-primary btn-sm py-0 me-3"
                                        >
                                          Submit
                                        </button>
                                        <button
                                          class="btn btn-primary btn-sm py-0"
                                          onClick={() => setEditToggle("")}
                                        >
                                          Cancel
                                        </button>
                                      </h6>
                                    </>
                                  )}
                                </>
                              ))}
                              <h5 className="text-primary mt-4">
                                Resellers Collector
                              </h5>
                              {staffs.resellerCollectors?.map((item, key) => (
                                <>
                                  <h6 key={key} className="mt-3">
                                    <Person /> {item?.name}
                                  </h6>
                                  <h6>
                                    {" "}
                                    <Telephone /> {item?.mobile}
                                    {"  "}
                                    <PenFill
                                      className="text-primary"
                                      onClick={() => editHandler(item?.id)}
                                    />
                                    {"  "}
                                    <KeyFill
                                      className="text-danger"
                                      size={25}
                                      onClick={() =>
                                        resetPassHandler(item.user)
                                      }
                                    />
                                  </h6>

                                  {editToggle === item?.id && (
                                    <>
                                      <h6>
                                        <input
                                          type="number"
                                          className="w-75 me-2"
                                          onChange={(e) =>
                                            setEditNumber(e.target.value)
                                          }
                                        />
                                      </h6>
                                      <h6>
                                        <button
                                          onClick={() =>
                                            editNumberHandler(
                                              item.id,
                                              "collector"
                                            )
                                          }
                                          class="btn btn-primary btn-sm py-0 me-3"
                                        >
                                          Submit
                                        </button>
                                        <button
                                          class="btn btn-primary btn-sm py-0"
                                          onClick={() => setEditToggle("")}
                                        >
                                          Cancel
                                        </button>
                                      </h6>
                                    </>
                                  )}
                                </>
                              ))}
                            </div>
                          ) : (
                            <div>Collector not found !</div>
                          )}
                          {staffs.resellers?.length > 0 ? (
                            <div className="resellers">
                              <h5 className="text-primary">Resellers</h5>
                              <table class="table table-bordered">
                                <tbody>
                                  {staffs.resellerCustomerCount?.map(
                                    (item, key) => (
                                      <tr>
                                        <td key={key} className="mt-3">
                                          <Person /> {item?.name}
                                          {"  "}
                                        </td>
                                        <td>
                                          <Telephone /> {item?.mobile}
                                          {"  "}
                                          <PenFill
                                            className="text-primary"
                                            onClick={() => editHandler(item.id)}
                                          />
                                          {editToggle === item?.id && (
                                            <>
                                              <h6>
                                                <input
                                                  type="number"
                                                  className="w-75 me-2"
                                                  onChange={(e) =>
                                                    setEditNumber(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </h6>
                                              <h6>
                                                <button
                                                  onClick={() =>
                                                    editNumberHandler(
                                                      item.id,
                                                      "reseller"
                                                    )
                                                  }
                                                  class="btn btn-primary btn-sm py-0 me-3"
                                                >
                                                  Submit
                                                </button>
                                                <button
                                                  class="btn btn-primary btn-sm py-0"
                                                  onClick={() =>
                                                    setEditToggle("")
                                                  }
                                                >
                                                  Cancel
                                                </button>
                                              </h6>
                                            </>
                                          )}
                                        </td>
                                        <td>{item?.customerCount}</td>
                                        <td>
                                          <KeyFill
                                            className="text-danger"
                                            size={25}
                                            onClick={() =>
                                              resetPassHandler(item?.user)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div>Reseller not Found !</div>
                          )}
                        </div>
                      )}
                    </Tab>

                    <Tab eventKey="subAreas" title="Sub Areas">
                      {subAreas && subAreas.length > 0 ? (
                        <>
                          <h4 type="button" class="btn btn-primary">
                            Total Sub Area{" "}
                            <span class="badge bg-secondary">
                              {subAreas.length}
                            </span>
                          </h4>
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th>Sub Area Name</th>
                                <th>Sub Area Id</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subAreas.map((item, key) => (
                                <tr key={key}>
                                  <th scope="col">{item?.name}</th>
                                  <td>{item?.id}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="text-center">Sub Area not found !</div>
                      )}
                    </Tab>

                    <Tab eventKey="Mikrotik" title="Mikrotik">
                      {isChecking && (
                        <span className="text-danger">
                          <Loader /> ...
                        </span>
                      )}
                      {allmikrotiks && allmikrotiks.length > 0 ? (
                        <>
                          <h4 className="text-primary fs-5">
                            Total Mikrotik
                            <span class="badge bg-secondary ms-2">
                              {allmikrotiks.length}
                            </span>
                          </h4>
                          <table class="table table-hover table-striped">
                            <thead>
                              <tr>
                                <th scope="col">Mikrotik ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">User Name</th>
                                <th scope="col">host</th>
                                <th scope="col">port</th>
                                <th>Connection</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allmikrotiks.map((item, key) => (
                                <tr key={key}>
                                  <td scope="row">{item?.id}</td>
                                  <td>{item?.name}</td>
                                  <td>{item?.username}</td>
                                  <td>{item?.host}</td>
                                  <td>{item?.port}</td>
                                  <td>
                                    {" "}
                                    <button
                                      title="checkConnection"
                                      style={{ padding: "0.10rem .5rem" }}
                                      className="btn btn-sm btn-primary mx-1"
                                      onClick={() =>
                                        mikrotikConnectionTest(
                                          item?.id,
                                          item?.name
                                        )
                                      }
                                    >
                                      <PlugFill />
                                    </button>
                                    {/* <button
                                      title="deletekrotik"
                                      onClick={() => mikrotikDelete(item?.id)}
                                      style={{ padding: "0.10rem .5rem" }}
                                      className="btn btn-sm btn-danger"
                                    >
                                      <ArchiveFill />
                                    </button> */}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="text-center">Mikrotik not found !</div>
                      )}
                    </Tab>

                    {/* start */}
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsModal;
