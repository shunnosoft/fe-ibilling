import { useSelector } from "react-redux";

const useAreaPackage = () => {
  // get all areas form redux store
  const areas = useSelector((state) => state?.area?.area);

  // get all area subareas form redux store
  const subAreas = useSelector((state) => state?.area?.subArea);

  // get all packages form redux store
  const allPackage = useSelector((state) => state?.package?.allPackages);

  // get all hotsPackage form redux store
  const hotsPackage = useSelector((state) => state?.hotspot?.package);

  return {
    areas,
    subAreas,
    allPackage,
    hotsPackage,
  };
};

export default useAreaPackage;
