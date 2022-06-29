import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  CurrencyDollar,
  ChatText,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const ActionButton = ({
  data,
  deleteStaff,
  editHandler,
  handleSingleMessage,
}) => {
  return (
    <>
      <div className="dropdown">
        <ThreeDots
          className="dropdown-toggle ActionDots"
          id="resellerDropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        />

        <ul className="dropdown-menu" aria-labelledby="resellerDropdown">
          <li
            data-bs-toggle="modal"
            data-bs-target="#staffEditModal"
            onClick={() => {
              editHandler(data.id);
            }}
          >
            <div className="dropdown-item">
              <div className="customerAction">
                <PenFill />
                <p className="actionP">এডিট</p>
              </div>
            </div>
          </li>
          <Link to={"/staff/" + data.id}>
            <li>
              <div className="dropdown-item actionManager">
                <div className="customerAction">
                  <CurrencyDollar />
                  <p className="actionP">স্যালারি</p>
                </div>
              </div>
            </li>
          </Link>
          <li
            onClick={() => {
              deleteStaff(data.id);
            }}
          >
            <div className="dropdown-item actionManager">
              <div className="customerAction">
                <ArchiveFill />
                <p className="actionP">ডিলিট</p>
              </div>
            </div>
          </li>
          {data.mobile && (
            <li
              data-bs-toggle="modal"
              data-bs-target="#customerMessageModal"
              onClick={() => {
                handleSingleMessage(data.id);
              }}
            >
              <div className="dropdown-item">
                <div className="customerAction">
                  <ChatText />
                  <p className="actionP">মেসেজ</p>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default ActionButton;
