import {
  PersonFill,
  HouseDoorFill,
  Messenger,
  Cash,
} from "react-bootstrap-icons";

// there should add another item is LINK's

export const HeaderData = [
  {
    icon: <PersonFill />,
    name: "Profile",
    link: "/profile",
  },
  {
    icon: <HouseDoorFill />,
    name: "Account",
    link: "/account",
  },
  {
    icon: <Messenger />,
    name: "Message",
    link: "/message",
  },
  {
    icon: <Cash />,
    name: "Payment",
    link: "/payment",
  },
];
