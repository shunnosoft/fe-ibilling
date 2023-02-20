import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useISPowner = () => {
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  const [ispOwnerId, setIspOwnerId] = useState(ispOwner.id);
  const [hasMikrotik, setHasMikrotik] = useState(
    ispOwner.bpSettings?.hasMikrotik
  );
  const [hasReseller, setHasReseller] = useState(
    ispOwner.bpSettings?.hasReseller
  );
  const [companyName, setCompanyName] = useState(ispOwner?.company);

  useEffect(() => {
    if (ispOwner) {
      setIspOwnerId(ispOwner.id);
      setHasMikrotik(ispOwner.bpSettings?.hasMikrotik);
      setHasReseller(ispOwner.bpSettings?.hasReseller);
      setCompanyName(ispOwner.company);
    }
  }, [ispOwner]);

  return { ispOwnerId, hasMikrotik, hasReseller, companyName };
};

export default useISPowner;
