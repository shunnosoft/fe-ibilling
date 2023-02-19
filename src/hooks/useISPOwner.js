import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useISPowner = () => {
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  // get bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData?.bpSettings
  );

  const [ispOwnerId, setIspOwnerId] = useState(ispOwner.id);
  const [hasMikrotik, setHasMikrotik] = useState(bpSettings?.hasMikrotik);

  useEffect(() => {
    setIspOwnerId(ispOwner.id);
    setHasMikrotik(bpSettings.hasMikrotik);
  }, [ispOwner]);

  return { ispOwnerId, hasMikrotik };
};

export default useISPowner;
