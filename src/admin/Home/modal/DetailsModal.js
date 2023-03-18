import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  ArchiveFill,
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
import { getSubAreasApi } from "../../../features/actions/customerApiCall";
import { getIspOwnersStaffs } from "../../../features/apiCallAdmin";
import {
  deleteSingleMikrotik,
  fetchMikrotik,
} from "../../../features/apiCalls";

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
  let allmikrotiks = [];
  allmikrotiks = useSelector((state) => state.mikrotik.mikrotik);
  console.log(allmikrotiks);

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

  useEffect(() => {
    if (ownerId) {
      getIspOwnersStaffs(ownerId, dispatch, setIsLoading);
      getSubAreasApi(dispatch, ownerId);
      fetchMikrotik(dispatch, ownerId, setIsLoading);
    }
  }, [ownerId]);

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
                <h4
                  style={{ color: "#0abb7a" }}
                  className="modal-title"
                  id="customerModalDetails"
                >
                  {ownerData?.name}
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* <h2 className="ProfileName">{ownerData?.name}</h2> */}
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
                          Firewall Customer: {staffs.firewallQueueCustomerCount}
                        </p>
                      </strong>

                      <strong>
                        <p class="h6 m-2">
                          Simple Customer: {staffs.simpleQueueCustomerCount}
                        </p>
                      </strong>
                      <strong>
                        <p class="h6 m-2">Reseller Customer: {customerCount}</p>
                      </strong>
                    </div>
                    <div className="profileMain">
                      <div>
                        <h5 class="text-primary">ISP Owner</h5>
                        <hr />

                        <table class="table table-bordered">
                          <tbody>
                            <tr>
                              <th scope="col">ISP ID</th>
                              <td>{ownerData?.id}</td>
                            </tr>
                            <tr>
                              <th scope="col">Name</th>
                              <td>{ownerData?.name}</td>
                            </tr>
                            <tr>
                              <th scope="col">Mobile</th>
                              <td>
                                <i className="text-body">{ownerData?.mobile}</i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Address</th>
                              <td>
                                <i className="text-body">
                                  {ownerData?.address}
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Email</th>
                              <td>
                                <i className="text-body"> {ownerData?.email}</i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Status</th>
                              <td>
                                <i className="text-body">
                                  <span class="badge bg-info">
                                    {ownerData?.status}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Signature</th>
                              <td>
                                <i className="text-body">
                                  {ownerData?.signature}
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">SMS Balance</th>
                              <td>
                                <i className="text-body">
                                  <span class="badge  bg-info">
                                    {ownerData?.smsBalance}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">SMS Rate</th>
                              <td>
                                <i className="text-body">
                                  {ownerData?.smsRate}
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">SMS Type</th>
                              <td>
                                <i className="text-body">
                                  {ownerData?.smsType}
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Bill Collection Type</th>
                              <td>
                                <i className="text-body">
                                  <span class="badge bg-info">
                                    {ownerData?.billCollectionType}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Create At</th>
                              <td>
                                <i className="text-secondary">
                                  {moment(ownerData?.createdAt).format("lll")}
                                </i>
                              </td>
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
                              <th scope="col">Complain Management</th>
                              <td>
                                <i className="text-body">
                                  {ownerData?.bpSettings?.complainManagement ? (
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
                              <th scope="col">Customer Limit</th>
                              <td>
                                <i className="text-body">
                                  <span class="badge bg-info">
                                    {ownerData?.bpSettings?.customerLimit}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Customer Portal</th>
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
                              <th scope="col">Execute Billing Cycle </th>
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
                              <th scope="col">Mikrotik </th>
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
                              <th scope="col">Mikrotik Length </th>
                              <td>
                                <i className="text-primary">
                                  <span class="badge bg-info">
                                    {allmikrotiks.length}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">PG</th>
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
                              <th scope="col">Reseller </th>
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
                              <th scope="col">Inventory </th>
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
                              <th scope="col">Invoice Date </th>
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
                              <th scope="col">Registration Payment Status </th>
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
                              <th scope="col">Monthly Payment Status </th>
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
                              <th scope="col">Package </th>
                              <td>
                                <i className="text-body">
                                  <span class="badge bg-info">
                                    {ownerData?.bpSettings?.pack}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Package Type </th>
                              <td>
                                <i className="text-body">
                                  <span class="badge bg-info">
                                    {ownerData?.bpSettings?.packType}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Package Rate </th>
                              <td>
                                <i className="text-body">
                                  <span class="badge bg-info">
                                    {ownerData?.bpSettings?.packageRate}
                                  </span>
                                </i>
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">Queue Type </th>
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
                            </h6>
                          </div>
                        ) : (
                          <div>Manager not found !</div>
                        )}
                        {staffs.collectors?.length > 0 ? (
                          <div className="collector">
                            <h5 className="text-primary">Collectors</h5>
                            {staffs.collectors?.map((item, key) => (
                              <>
                                <h6 key={key} className="mt-3">
                                  <Person /> {item?.name}
                                </h6>
                                <h6>
                                  {" "}
                                  <Telephone /> {item?.mobile}
                                </h6>
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
                                      </td>
                                      <td>
                                        <Telephone /> {item?.mobile}
                                      </td>
                                      <td>{item?.customerCount}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div>Reseller not Found</div>
                        )}
                      </div>
                    )}
                  </Tab>

                  <Tab eventKey="subAreas" title="Sub Areas">
                    <h4 type="button" class="btn btn-primary">
                      Total Sub Area{" "}
                      <span class="badge bg-secondary">{subAreas.length}</span>
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
                  </Tab>

                  <Tab eventKey="Mikrotik" title="Mikrotik">
                    {isChecking && (
                      <span className="text-danger">
                        <Loader /> ...
                      </span>
                    )}
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
                            <td>{item?.host}</td>
                            <td>{item?.port}</td>
                            <td>
                              {" "}
                              <button
                                title="checkConnection"
                                style={{ padding: "0.10rem .5rem" }}
                                className="btn btn-sm btn-primary mx-1"
                                onClick={() =>
                                  mikrotikConnectionTest(item?.id, item?.name)
                                }
                              >
                                <PlugFill />
                              </button>
                              <button
                                title="deletekrotik"
                                onClick={() => mikrotikDelete(item?.id)}
                                style={{ padding: "0.10rem .5rem" }}
                                className="btn btn-sm btn-danger"
                              >
                                <ArchiveFill />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Tab>

                  {/* start */}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsModal;
