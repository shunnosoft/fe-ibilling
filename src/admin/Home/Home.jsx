// external imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import moment from "moment";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { cardData, monthsName } from "./homeData";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getIspOwners } from "../../features/apiCallAdmin";
import ActionButton from "./ActionButton";
import Table from "../../components/table/Table";
import EditModal from "./modal/EditModal";

export default function Home() {
  const [ownerId, setOwnerId] = useState("");
  const ispOwners = useSelector((state) => state.admin.ispOwners);
  const dispatch = useDispatch();

  useEffect(() => {
    getIspOwners(dispatch);
  }, [dispatch]);

  const editModal = (ispOwnerId) => {
    setOwnerId(ispOwnerId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        accessor: "name",
        Header: "নাম",
      },
      {
        accessor: "mobile",
        Header: "মোবাইল",
      },
      {
        accessor: "company",
        Header: "কোম্পানি",
      },
      {
        accessor: "address",
        Header: "ঠিকানা",
      },
      {
        Header: "পেমেন্ট স্টেটাস",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className={
                "badge " +
                (original.bpSettings.paymentStatus === "paid"
                  ? "bg-success"
                  : "bg-warning")
              }
            >
              {original.bpSettings.paymentStatus}
            </span>
          </div>
        ),
      },
      // accessor: "bpSetting.paymentStatus",

      // {
      //   accessor: "email",
      //   Header: "ইমেইল",
      // },
      // ,

      // {
      //   accessor: "nid",
      //   Header: "প্যাকেজ",
      // },

      // {
      //   Header: "রিসেলার",
      //   Cell: ({ row: { original } }) =>
      //     original?.bpSettings?.hasReseller ? "YES" : "NO",
      // },
      // {
      //   Header: "মাইক্রোটিক",
      //   Cell: ({ row: { original } }) =>
      //     original?.bpSettings?.hasMikrotik ? "YES" : "NO",
      // },
      // {
      //   accessor: "createdAt",
      //   Header: "তারিখ",
      // },
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
            <>
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#clientEditModal"
                  onClick={() => {
                    editModal(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">এডিট</p>
                    </div>
                  </div>
                </li>

                {/* <li
                  onClick={() => {
                    deleteSingleArea(data.id, data.ispOwner);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">ডিলিট</p>
                    </div>
                  </div>
                </li> */}
              </ul>
            </>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="container homeWrapper">
      <ToastContainer position="top-right" theme="colored" />
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            <h2 className="dashboardTitle">AdMIN ড্যাশবোর্ড</h2>
          </div>
          <br />
          <Table columns={columns} data={ispOwners}></Table>

          <EditModal ownerId={ownerId} />
        </div>
      </FontColor>
    </div>
  );
}
