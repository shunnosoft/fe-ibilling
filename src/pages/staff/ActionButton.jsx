import {
  PersonPlusFill,
  GearFill,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonFill,
  Wallet,
} from "react-bootstrap-icons";

const ActionButton = ({ data, deleteStaff, editHandler }) => {
  return (
    <>
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
          data-bs-target="#resellerDetailsModal"
          onClick={() => {
            // getSpecificReseller(val.id);
          }}
        >
          <div className="dropdown-item">
            <div className="customerAction">
              <PersonFill />
              <p className="actionP">প্রোফাইল</p>
            </div>
          </div>
        </li>
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
      </ul>
    </>
  );
};

export default ActionButton;
