import "./area.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GeoAlt, ArrowRightShort } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ResellerPost from "./areaModals/AreaPost";
// import { fetchArea } from "../../features/areaSlice";
import AreaEdit from "./areaModals/AreaEdit";
// import TdLoader from "../../components/common/TdLoader";
import { deleteArea, getArea } from "../../features/apiCalls";
import ActionButton from "./ActionButton";
import Table from "../../components/table/Table";

export default function Area() {
  const area = useSelector((state) => state.persistedReducer.area.area);
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [EditAarea, setEditAarea] = useState("");
  // let serial = 0;
  // const dispatchArea = () => {
  //   if (user.ispOwner) {
  //     dispatch(FetchAreaSuccess(user.ispOwner.id));
  //   }
  // };

  const dispatch = useDispatch();
  // const user = useSelector(state => state.auth.currentUser);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  useEffect(() => {
    getArea(dispatch, ispOwnerId);
  }, [dispatch, ispOwnerId]);

  const deleteSingleArea = async (id, ispOwner) => {
    setIsLoading(true);
    const IDs = {
      ispOwner: ispOwner,
      id: id,
    };
    deleteArea(dispatch, IDs, setIsLoading);
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
                <h2 className="collectorTitle">এরিয়া</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>অ্যাড এরিয়া</p>
                      <div className="addAndSettingIcon">
                        <GeoAlt
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#areaModal"
                        />
                      </div>
                    </div>

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
