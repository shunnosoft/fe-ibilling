import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../qrCodeHotspot.css";

const HotspotPackage = ({ selectedPackage, setHotspotPackage }) => {
  // get customer package form store
  const packags = useSelector((state) => state.publicSlice?.publicPackage);

  return (
    <>
      <div className="overflow-auto clintProfile">
        <Card.Title className="clintTitle">
          <h5 className="profileInfo">Monthly Package</h5>
        </Card.Title>
        <Card.Body className="displayGrid packagePage">
          {packags?.map((pack, index) => (
            <div
              key={index}
              className={`package-card d-flex gap-3 align-items-center p-3 mb-3 rounded shadow-sm ${
                selectedPackage?.name === pack.name ? "selected" : ""
              }`}
              onClick={() => setHotspotPackage(pack)}
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                name="package"
                checked={selectedPackage?.name === pack.name}
                onChange={() => setHotspotPackage(pack)}
                className="form-check-input"
              />
              <div>
                <h6 className="mb-1">{pack?.name}</h6>
                <p className="mb-0 text-muted">{pack?.rate} tk</p>
              </div>
            </div>
          ))}
        </Card.Body>
      </div>
    </>
  );
};

export default HotspotPackage;
