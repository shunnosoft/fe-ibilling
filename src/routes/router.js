import {
  HouseDoorFill,
  CurrencyEuro,
  PeopleFill,
  PersonPlus,
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
