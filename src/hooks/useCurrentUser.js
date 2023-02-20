import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useCurrentUser = () => {
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  const [userId, setUserId] = useState(currentUser?.user?.id);
  const [userRole, setUserRole] = useState(currentUser?.user?.role);
  const [activeUserId, setActiveUserId] = useState("");
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.user.id);
      setUserRole(currentUser.user.role);
      const getActualUserByRole = currentUser[currentUser.user.role];
      setActiveUserId(getActualUserByRole?.id);
      if (getActualUserByRole.permissions) {
        setPermissions(getActualUserByRole.permissions);
      }
    }
  }, [currentUser]);

  return { userId, userRole, activeUserId, permissions };
};

export default useCurrentUser;
