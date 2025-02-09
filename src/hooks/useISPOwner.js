import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useISPowner = () => {
  //---> @Get user from redux store
  const user = useSelector((state) => state.persistedReducer.auth);

  //---> @Get reseller information from redux store
  const resellerData = useSelector((state) => state.resellerProfile.reseller);

  //====================||Local State||====================//

  //---> User role
  const [role, setRole] = useState(user?.role);

  //---> IspOwner id && IspOwner data
  const [ispOwnerData, setIspOwnerData] = useState(user?.ispOwnerData);
  const [ispOwnerId, setIspOwnerId] = useState(user?.ispOwnerId);
  const [companyName, setCompanyName] = useState(user?.ispOwnerData?.company);

  //---> IspOwner bpSettings data
  const [bpSettings, setBpSettings] = useState(user?.ispOwnerData?.bpSettings);
  const [userType, setUserType] = useState(
    user?.ispOwnerData?.bpSettings?.queueType
  );
  const [hasMikrotik, setHasMikrotik] = useState(
    user?.ispOwnerData?.bpSettings?.hasMikrotik
  );
  const [hasReseller, setHasReseller] = useState(
    user?.ispOwnerData?.bpSettings?.hasReseller
  );

  //---> Manager,Reseller & Collector user data
  const [userData, setUserData] = useState(user?.userData);
  const [permissions, setPermissions] = useState(user?.userData?.permissions);
  const [permission, setPermission] = useState(user?.userData?.permission);
  const [settings, setSettings] = useState(user?.userData?.settings);

  //---> Current user data
  const [currentUser, setCurrentUser] = useState(user?.currentUser);

  //---> IspOwner data set
  useEffect(() => {
    //---> Current user role
    if (user?.role) setRole(user?.role);

    //---> IspOwner information
    if (user?.ispOwnerData) {
      setIspOwnerData(user?.ispOwnerData);
      setIspOwnerId(user?.ispOwnerId);
      setCompanyName(user?.ispOwnerData?.company);
    }

    //---> IspOwner bpSettings data set
    if (user?.ispOwnerData?.bpSettings) {
      setBpSettings(user?.ispOwnerData?.bpSettings);
      setUserType(user?.ispOwnerData?.bpSettings?.queueType);
      setHasMikrotik(user?.ispOwnerData?.bpSettings?.hasMikrotik);
      setHasReseller(user?.ispOwnerData?.bpSettings?.hasReseller);
    }

    //---> IspOwner staff permission
    if (user?.userData) {
      setUserData(user?.userData);
      setPermissions(user?.userData?.permissions);
      setPermission(user?.userData?.permission);
      setSettings(user?.userData?.settings);
    }

    //---> Current user data
    if (user?.currentUser) {
      setCurrentUser(user?.currentUser);
    }
  }, [user]);

  return {
    role,
    ispOwnerData,
    ispOwnerId,
    bpSettings,
    userType,
    hasMikrotik,
    hasReseller,
    companyName,
    resellerData,
    userData,
    permissions,
    permission,
    currentUser,
    settings,
  };
};

export default useISPowner;
