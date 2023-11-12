import React, { useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { FtextField } from "../../../../components/common/FtextField";
import { Form, Formik } from "formik";

import Loader from "../../../../components/common/Loader";
import { hotspotUserFind } from "../../../../features/publicHotspotApi/publicHotspot";
import { useDispatch } from "react-redux";

const SearchHotspotUser = ({ ispInfo }) => {
  const dispatch = useDispatch();

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  return <></>;
};

export default SearchHotspotUser;
