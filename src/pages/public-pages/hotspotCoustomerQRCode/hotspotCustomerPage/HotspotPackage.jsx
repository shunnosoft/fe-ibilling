import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";

const HotspotPackage = ({ setModalStatus }) => {
  // get customer package form store
  const packags = useSelector((state) => state.publicSlice?.publicPackage);

  return (
    <>
      <div className="overflow-auto clintProfile">
        <Card.Title className="clintTitle">
          <h5 className="profileInfo">Monthly Package</h5>
        </Card.Title>
        <Card.Body className="displayGrid packagePage">
          {packags?.map((pack) => (
            <div
              className="package shadow-sm rounded"
              onClick={() => {
                setModalStatus("createUser");
              }}
            >
              <h5>{pack?.name}</h5>
              <p>{pack?.rate} tk/</p>
            </div>
          ))}
        </Card.Body>
      </div>
    </>
  );
};

export default HotspotPackage;
