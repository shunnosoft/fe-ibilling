import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useISPowner = () => {
  // get user from redux
  const user = useSelector((state) => state.persistedReducer.auth);
  console.log(user);

  // user role
  const [role, setRole] = useState(user?.role);

  // ispOwner id && ispOwner data
  const [ispOwnerId, setIspOwnerId] = useState(user?.ispOwnerId);
  const [companyName, setCompanyName] = useState(user?.ispOwnerData?.company);

  // ispOwner bpSettings data
  const [bpSetting, setBpSetting] = useState(user?.ispOwnerData?.bpSettings);
  const [userType, setUserType] = useState(
    user?.ispOwnerData?.bpSettings?.queueType
  );
  const [hasMikrotik, setHasMikrotik] = useState(
    user?.ispOwnerData?.bpSettings?.hasMikrotik
  );
  const [hasReseller, setHasReseller] = useState(
    user?.ispOwnerData?.bpSettings?.hasReseller
  );

  // manager,reseller & collector permissions
  const [permissions, setPermissions] = useState(user?.userData.permissions);

  // ispOwner data set
  useEffect(() => {
    if (user?.role) setRole(user?.role);

    if (user?.ispOwnerData) {
      setIspOwnerId(user?.ispOwnerId);
      setCompanyName(user?.ispOwnerData.company);
    }

    // ispOwner bpSettings data set
    if (user?.ispOwnerData?.bpSettings) {
      setBpSetting(user?.ispOwnerData?.bpSettings);
      setUserType(user?.ispOwnerData?.bpSettings?.queueType);
      setHasMikrotik(user?.ispOwnerData?.bpSettings?.hasMikrotik);
      setHasReseller(user?.ispOwnerData?.bpSettings?.hasReseller);
    }

    // ipsOwner staff permission
    if (user?.userData.permissions) setPermissions(user?.userData.permissions);
  }, [user]);

  return {
    role,
    ispOwnerId,
    bpSetting,
    userType,
    hasMikrotik,
    hasReseller,
    companyName,
    permissions,
  };
};

export default useISPowner;
