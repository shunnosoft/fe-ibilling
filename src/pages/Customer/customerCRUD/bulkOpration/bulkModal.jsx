import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

export default function RootBulkModal(props) {
  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);
  // const packages= useSelector(state=>state.package.packages)
  // console.log( packages)
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const area = useSelector((state) => state?.persistedReducer?.area?.area);
  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.persistedReducer?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();

  return (
    <div>
      <div
        className="modal fade "
        id="customerBulkModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {props.header}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
