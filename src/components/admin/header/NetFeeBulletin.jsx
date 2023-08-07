import React, { useEffect, useState } from "react";
import "./netfeebulletin.css";
import { getIspOwnerBulletin } from "../../../features/apiCallAdmin";

const NetFeeBulletin = () => {
  // get bulletin in isp & reseller state
  const [ispBulletin, setIspBulletin] = useState([]);
  const [resellerBulletin, setResellerBulletin] = useState([]);
  console.log(ispBulletin);

  useEffect(() => {
    getIspOwnerBulletin(setIspBulletin);
    // getResellerBulletin();
  }, []);

  return (
    <div className="bulletin">
      <marquee>
        <span className="bulletin_title">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
          recusandae provident cum, illo consectetur eius, sunt doloribus
          praesentium, ducimus enim consequuntur. Facilis fugit odio ipsam
          doloribus maiores quam laborum, sapiente nostrum quod excepturi illum
          et nisi sit incidunt architecto adipisci ipsa. Ducimus consequuntur
          molestiae quasi expedita accusamus tenetur facere libero eaque fugit
          quibusdam incidunt officia mollitia, quas in esse provident, et
          officiis? Magnam blanditiis quidem in recusandae voluptates eos dolore
          perspiciatis earum voluptatibus laboriosam quo voluptate, dolores quis
          a, ipsum doloremque aut rem nisi! Soluta libero, esse ea omnis, neque
          aliquid possimus recusandae veritatis delectus tempore, a sed officiis
          in!
        </span>
      </marquee>
    </div>
  );
};

export default NetFeeBulletin;
