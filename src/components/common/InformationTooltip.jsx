import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

const InformationTooltip = ({ data }) => {
  return (
    <OverlayTrigger
      key={data?.key}
      placement="right"
      overlay={
        <Popover
          style={{
            background: "#2E87DF",
            border: "none",
          }}
          id="popover-basic"
        >
          <Popover.Body className="text-white p-2">{data?.info}</Popover.Body>
        </Popover>
      }
    >
      {({ ref, ...triggerHandler }) => (
        <i
          ref={ref}
          {...triggerHandler}
          class="fas fa-info-circle"
          style={{
            color: "#2E87DF",
            fontSize: "18px",
          }}
        ></i>
      )}
    </OverlayTrigger>
  );
};

export default InformationTooltip;
