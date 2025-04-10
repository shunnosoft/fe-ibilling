import { useSelector } from "react-redux";

const useSelectorState = () => {
  //---> Get ispOwner all area from redux store
  const areas = useSelector((state) => state.area?.area);

  //---> Get ispOwner all area sub-area from redux store
  const subAreas = useSelector((state) => state.area?.subArea);

  //---> Get ispOwner all sub-areas pol-box from redux store
  const polesBox = useSelector((state) => state.area?.poleBox);

  //---> Get ispOwner all mikrotik from redux store
  const mikrotiks = useSelector((state) => state.mikrotik?.mikrotik);

  //---> Get ispOwner all mikrotik packages from redux store
  const allPackages = useSelector((state) => state.package?.allPackages);

  //---> Get ispOwner without mikrotik packages from redux store
  const withoutMtkPackages = useSelector((state) => state.package?.packages);

  //---> Get current user staff from redux store
  const userStaff = useSelector((state) => state?.ownerUsers?.userStaff);

  //---> Get netFee bulletin route permission from redux store
  const bulletinPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  return {
    areas,
    subAreas,
    polesBox,
    mikrotiks,
    allPackages,
    withoutMtkPackages,
    userStaff,
    bulletinPermission,
  };
};

export default useSelectorState;
