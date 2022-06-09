import "./area.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GeoAlt, ArrowRightShort, PlusLg } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ResellerPost from "./areaModals/AreaPost";
// import { fetchArea } from "../../features/areaSlice";
import AreaEdit from "./areaModals/AreaEdit";
// import TdLoader from "../../components/common/TdLoader";
import { deleteArea, getArea, getCustomer } from "../../features/apiCalls";
import ActionButton from "./ActionButton";
import Table from "../../components/table/Table";

export default function Area() {
  const area = useSelector((state) => state?.persistedReducer?.area?.area);
  const [loading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const cus = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [EditAarea, setEditAarea] = useState("");
  // let serial = 0;
  // const dispatchArea = () => {
  //   if (user.ispOwner) {
  //     dispatch(FetchAreaSuccess(user.ispOwner.id));
  //   }
  // };

  // const user = useSelector(state => state.auth.currentUser);
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  useEffect(() => {
    getArea(dispatch, ispOwnerId);
    getCustomer(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  const deleteSingleArea = async (id, ispOwner) => {
    let singleArea = area.find((a) => a.id === id);
    let isCustomer = false;
    const subAreas = singleArea?.subAreas;
    subAreas?.map((sub) => {
      cus.map((cus) => {
        if (cus.subArea === sub.id) {
          isCustomer = true;
        }
      });
    });
    if (isCustomer) {
      toast.warn("এই এরিয়া তে গ্রাহক থাকায় ডিলিট করা যাবে না");
    } else {
      let con = window.confirm("আপনি কি এরিয়া ডিলিট করতে চান?");
      if (con) {
        setIsLoading(true);
        const IDs = {
          ispOwner: ispOwner,
          id: id,
        };
        deleteArea(dispatch, IDs, setIsLoading);
      }
    }
  };

  const getSpecificArea = (id) => {
    if (area.length !== undefined) {
      const oneArea = area.find((val) => {
        return val.id === id;
      });
      setEditAarea(oneArea);
    }
  };

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "এরিয়া",
        accessor: "name",
      },
      {
        Header: <div className="text-center">সাব-এরিয়া</div>,
        id: "option1",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link to={`/subArea/${original.id}`} className="gotoSubAreaBtn">
              সাব-এরিয়া
              <ArrowRightShort style={{ fontSize: "19px" }} />
            </Link>
          </div>
        ),
      },
      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActionButton
              getSpecificArea={getSpecificArea}
              deleteSingleArea={deleteSingleArea}
              data={original}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Sidebar />
      {/* toast */}
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <ResellerPost />
              {/* area edit modal */}
              <AreaEdit oneArea={EditAarea} />

              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>এরিয়া</div>
                  <div
                    title="এরিয়া এড করুন"
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#areaModal"
                  >
                    <GeoAlt />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div>
                      {isLoading ? (
                        <div className="deletingAction">
                          <Loader /> <b>Deleting...</b>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  {/* table */}

                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={area}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
