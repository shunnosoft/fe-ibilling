import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useISPowner = () => {
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );
  const [ispOwnerId, setIspOwnerId] = useState(ispOwner.id);
  const [hasMikrotik, setHasMikrotik] = useState(bpSettings?.hasMikrotik);
  const [hasReseller, setHasReseller] = useState(bpSettings?.hasReseller);
  const [companyName, setCompanyName] = useState(ispOwner?.company);

  useEffect(() => {
    if (ispOwner) {
      setIspOwnerId(ispOwner.id);
      setCompanyName(ispOwner.company);
    }
  }, [ispOwner]);

  useEffect(() => {
    if (bpSettings) {
      setHasMikrotik(bpSettings?.hasMikrotik);
      setHasReseller(bpSettings?.hasReseller);
    }
  }, [bpSettings]);

  return { ispOwnerId, hasMikrotik, hasReseller, companyName };
};

export default useISPowner;
