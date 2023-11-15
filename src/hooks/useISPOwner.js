import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useISPowner = () => {
  // get user from redux
  const user = useSelector((state) => state.persistedReducer.auth);

  // user role
  const [role, setRole] = useState(user?.role);

  // ispOwner id && ispOwner data
  const [ispOwnerId, setIspOwnerId] = useState(user?.ispOwnerId);
  const [companyName, setCompanyName] = useState(user?.ispOwnerData?.company);

  // ispOwner bpSettings data
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

  // manager,reseller & collector user data
  const [userData, setUserData] = useState(user?.userData);
  const [permissions, setPermissions] = useState(user?.userData.permissions);

  // current user data
  const [currentUser, setCurrentUser] = useState(user?.currentUser);

  // ispOwner data set
  useEffect(() => {
    if (user?.role) setRole(user?.role);

    if (user?.ispOwnerData) {
      setIspOwnerId(user?.ispOwnerId);
      setCompanyName(user?.ispOwnerData.company);
    }

    // ispOwner bpSettings data set
    if (user?.ispOwnerData?.bpSettings) {
      setBpSettings(user?.ispOwnerData?.bpSettings);
      setUserType(user?.ispOwnerData?.bpSettings?.queueType);
      setHasMikrotik(user?.ispOwnerData?.bpSettings?.hasMikrotik);
      setHasReseller(user?.ispOwnerData?.bpSettings?.hasReseller);
    }

    // ipsOwner staff permission
    if (user?.userData) {
      setUserData(user?.userData);
      setPermissions(user?.userData.permissions);
    }

    //current user data
    if (user?.currentUser) {
      setCurrentUser(user?.currentUser);
    }
  }, [user]);

  return {
    role,
    ispOwnerId,
    bpSettings,
    userType,
    hasMikrotik,
    hasReseller,
    companyName,
    userData,
    permissions,
    currentUser,
  };
};

export default useISPowner;
