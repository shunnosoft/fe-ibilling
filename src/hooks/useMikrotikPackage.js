import { useEffect, useState } from "react";
import { getAllPackages } from "../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";

const useMikrotikPackage = (packId) => {
  const dispatch = useDispatch();

  //get IspOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //states
  const [isLoading, setIsLoading] = useState(false);
  const [singlePack, setSinglePack] = useState("");

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  //all package api call
  useEffect(() => {
    getAllPackages(dispatch, ispOwnerId, setIsLoading);
  }, [ispOwnerId]);

  //finding specific package
  useEffect(() => {
    if (packId) {
      const singlePack = allPackages.find((item) => item.id.includes(packId));
      setSinglePack(singlePack);
    }
  }, [packId]);

  return singlePack;
};

export default useMikrotikPackage;
