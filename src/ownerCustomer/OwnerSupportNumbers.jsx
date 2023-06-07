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
      {support && support.length > 0 ? (
        <>
          <h3
            style={{ color: "#13ad23", fontFamily: "italic" }}
            className="text-center"
          >
            Support Contact Number
            <hr />
          </h3>
          {isLoading ? (
            <div className="text-center mt-5">
              <Loader />
            </div>
          ) : (
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Supporter Name</th>
                  <th scope="col">Supporter Mobile</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                </tr>
              </thead>
              <tbody>
                {support?.map((val) => (
                  <tr key={val.id} className="forum-item">
                    <td scope="row">{val?.name}</td>
                    <td>{val?.mobile}</td>
                    <td>
                      <span className="badge bg-secondary fs-6">
                        <small>{val?.start}</small>
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info fs-6">
                        <small className="text-danger">{val?.end}</small>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default OwnerSupportNumbers;
