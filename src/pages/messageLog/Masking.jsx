import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import {
  getMaskingMessageLog,
  getMessageLog,
} from "../../features/messageLogApi";

const Masking = ({ maskingLoading, setMaskingLoading }) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all masking from redux
  const masking = useSelector((state) => state?.messageLog?.masking);

  // main masking state
  const [maskingMessage, setMaskingMessage] = useState([]);

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

  // filter function
  const onClickFilter = () => {
    let filterData = [...masking];

    // type filter
    if (type) {
      filterData = filterData.filter((item) => item.type === type);
    }

    // status filter
    if (status) {
      filterData = filterData.filter((item) => item.status === status);
    }

    // date filter
    filterData = filterData.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    setMaskingMessage(filterData);
  };

  // get customer api call
  useEffect(() => {
    if (maskingMessage.length === 0)
      getMaskingMessageLog(dispatch, setMaskingLoading, ispOwner);
  }, []);

  // set main masking at state
  useEffect(() => {
    setMaskingMessage(masking);
  }, [masking]);

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
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "45%",
        Header: t("message"),
        accessor: "message",
      },
    ],
    [t]
  );
  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className="selectFilteringg">
            <div className="typeFilter">
              <select
                className="form-select w-200"
                onChange={(event) => setType(event.target.value)}
              >
                <option value="" selected>
                  {t("type")}
                </option>

                <option value="bill">{t("bill")}</option>
                <option value="bulk">{t("bulk")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>
            <div className="mx-2">
              <select
                className="form-select w-200"
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
                className="form-control w-200 mt-2"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMM dd yyyy"
                placeholderText={t("selectBillDate")}
              />
            </div>
            <div className="mx-2">
              <ReactDatePicker
                className="form-control w-200 mt-2"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MMM dd yyyy"
                placeholderText={t("selectBillDate")}
              />
            </div>
            <div className="">
              <button
                className="btn btn-outline-primary w-140 mt-2"
                type="button"
                onClick={onClickFilter}
              >
                {t("filter")}
              </button>
            </div>
          </div>
        </div>

        <Table
          isLoading={maskingLoading}
          columns={columns}
          data={masking}
        ></Table>
      </div>
    </>
  );
};

export default Masking;
