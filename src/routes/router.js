import {
  HouseDoorFill,
  CurrencyEuro,
  PeopleFill,
  PersonPlus,
  PersonLinesFill,
  Cash,
} from "react-bootstrap-icons";
export const AllRoutes = [
  {
    title: "হোম",
    icon: <HouseDoorFill />,
    link: "/home",
  },
  {
    title: "ম্যানেজার",
    icon: <PersonPlus />,
    link: "/manager",
  },
  {
    title: "কাস্টমার",
    icon: <PeopleFill />,
    link: "/customer",
  },
  {
    title: "লাইন-ম্যান",
    icon: <PersonLinesFill />,
    link: "/lineman",
  },
  {
    title: "কালেক্টর",
    icon: <CurrencyEuro />,
    link: "/collector",
  },
  {
    title: "কাস্টমার বিল",
    icon: <Cash />,
    link: "/customer-bill",
  },
];
