import React from "react";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import { tutorialLink } from "./tutorialLink";

const PlayTutorial = ({ show, setShow, video }) => {
  return (
    <ComponentCustomModal
      {...{
        show,
        setShow,
        centered: true,
        size: "lg",
      }}
    >
      <div>
        {tutorialLink?.map((item) => {
          if (item.key === video)
            return (
              <div className="embed-responsive">
                <iframe
                  width="100%"
                  height="400"
                  src={item.link}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen=""
                  title="Embedded youtube"
                  className="embed-responsive-item"
                />
                <h5 className="form-label" htmlFor="">
                  {item.title}
                </h5>
              </div>
            );
        })}
      </div>
    </ComponentCustomModal>
  );
};

export default PlayTutorial;
