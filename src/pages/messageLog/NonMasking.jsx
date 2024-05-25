import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import { getMessageLog } from "../../features/messageLogApi";
import MessageDetails from "./messageModal/MessageDetails";
import { Accordion } from "react-bootstrap";
import FormatNumber from "../../components/common/NumberFormat";

const NonMasking = ({
  nonMaskingLoading,
  setNonMaskingLoading,
  activeKeys,
}) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all data from redux
  const data = useSelector((state) => state?.messageLog?.messageLog);

  // main data state
  const [mainData, setMainData] = useState([]);

  // message id state
  const [nonMaskingId, setNonMaskingId] = useState("");

  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // start date state
  const [startDate, setStartDate] = useState(firstDay);

  // end date state
  const [endDate, setEndDate] = useState(today);

  // type state
  const [type, setType] = useState("");

  // status state
  const [status, setStatus] = useState("");

  //details modal show state
  const [modalShow, setModalShow] = useState(false);

  // get customer api call
  useEffect(() => {
    if (mainData.length === 0)
      getMessageLog(dispatch, setNonMaskingLoading, ispOwner);
  }, []);

  // set main data at state
  useEffect(() => {
    setMainData(data);
  }, [data]);

  // filter function
  const onClickFilter = () => {
    let filterData = [...data];

    // message type filter
    filterData = filterData.filter((item) => item.type === type);

    // message status filter
    filterData = filterData.filter((item) => item.status === status);

    // date filter
    filterData = filterData.filter(
      (value) =>
        new Date(value.createdAt) >= new Date(startDate).setHours(0, 0, 0, 0) &&
        new Date(value.createdAt) <= new Date(endDate).setHours(23, 59, 59, 999)
    );

    setMainData(filterData);
  };

  const calculatedValue = useMemo(() => {
    let totalCount = 0;
    mainData?.map((item) => {
      totalCount = totalCount + item?.count;
    });
    return {
      totalCount,
    };
  });

  const customComponet = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      <div>
        {t("count")}: {FormatNumber(calculatedValue?.totalCount)}
      </div>
    </div>
  );

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "13%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "9%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: t("type"),
        accessor: "type",
        Cell: ({ cell: { value } }) => {
          return <div className="text-center">{badge(value)}</div>;
        },
      },
      {
        width: "8%",
        Header: t("count"),
        accessor: "count",
        Cell: ({ cell: { value } }) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        width: "12%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
      {
        width: "45%",
        Header: t("message"),
        accessor: "message",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original.message && original.message.slice(0, 80)}
              <span
                className="text-primary see-more"
                onClick={() => {
                  setNonMaskingId(original._id);
                  setModalShow({ ...modalShow, [false]: true });
                }}
              >
                {original.message.length > 80 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },
    ],
    [t]
  );
  return (
    <>
      <Accordion alwaysOpen activeKey={activeKeys}>
        <Accordion.Item eventKey="filter" className="accordionBorder">
          <Accordion.Body className="accordionPadding pt-2">
            <div className="selectFilteringg">
              <div className="typeFilter">
                <select
                  className="form-select w-200 mt-0"
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="" selected>
                    {t("type")}
                  </option>

                  <option value="bill">{t("bill")}</option>
                  <option value="bulk">{t("bulk")}</option>
                  <option value="auth">Auth</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>
              <div className="mx-2">
                <select
                  className="form-select w-200 mt-0"
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="" selected>
                    {t("selectStatus")}
                  </option>

                  <option value="sent">{t("send")}</option>
                  <option value="Pending">{t("selectPending")}</option>
                </select>
              </div>
              <div>
                <ReactDatePicker
                  className="form-control w-200"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MMM dd yyyy"
                  placeholderText={t("selectBillDate")}
                />
              </div>
              <div className="mx-2">
                <ReactDatePicker
                  className="form-control w-200"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="MMM dd yyyy"
                  placeholderText={t("selectBillDate")}
                />
              </div>
              <div className="">
                <button
                  className="btn btn-outline-primary w-140"
                  type="button"
                  onClick={onClickFilter}
                >
                  {t("filter")}
                </button>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="collectorWrapper pb-2">
        <div className="addCollector">
          <Table
            isLoading={nonMaskingLoading}
            columns={columns}
            data={mainData}
            customComponent={customComponet}
          ></Table>
        </div>
      </div>

      <MessageDetails
        messageId={nonMaskingId}
        status="nonMaskingMessage"
        modalShow={modalShow}
      />
    </>
  );
};

export default NonMasking;
