import React, { useEffect, useState } from "react";
import { ispOwnerSupportNumbers } from "../features/getIspOwnerUsersApi";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/common/Loader";

const OwnerSupportNumbers = () => {
  const dispatch = useDispatch();

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.customer?.ispOwner
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  // get support numbers state
  const [support, setSupport] = useState(null);

  // get api ispOwner customer support
  useEffect(() => {
    ispOwnerSupportNumbers(dispatch, ispOwner.id, setIsLoading, setSupport);
  }, [ispOwner]);

  return (
    <div>
      <h3 style={{ color: "#3e6e07" }} className="text-center">
        Support Number's
      </h3>
      {isLoading ? (
        <div className="text-center mt-5">
          <Loader />
        </div>
      ) : (
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Mobile</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
            </tr>
          </thead>
          <tbody>
            {support?.map((val) => (
              <tr key={val.id}>
                <td scope="row">{val?.name}</td>
                <td>{val?.mobile}</td>
                <td>{val?.start}</td>
                <td>{val?.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OwnerSupportNumbers;
