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

  //---> Get ispOwner mikrotik package from redux store
  const packages = useSelector((state) => state?.mikrotik?.pppoePackage);

  //---> Get ispOwner all mikrotik packages from redux store
  const allPackages = useSelector((state) => state.package?.allPackages);

  //---> Get ispOwner without mikrotik packages from redux store
  const withoutMtkPackages = useSelector((state) => state.package?.packages);

  //---> Get ispOwner user from redux store
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  //---> Get current user staff from redux store
  const userStaff = useSelector((state) => state?.ownerUsers?.userStaff);

  //---> Get oneBilling bulletin route permission from redux store
  const bulletinPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //---> Get ISP Owner resellers from redux store
  const resellers = useSelector((state) => state?.reseller?.reseller);

  return {
    areas,
    subAreas,
    polesBox,
    mikrotiks,
    packages,
    allPackages,
    withoutMtkPackages,
    ownerUsers,
    userStaff,
    bulletinPermission,
    resellers,
  };
};

export default useSelectorState;
