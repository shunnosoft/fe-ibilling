import {
  HouseDoorFill,
  CurrencyEuro,
  PeopleFill,
  PersonPlus,
  Cash,
  GraphUp,
  PaintBucket,
  Apple,
} from "react-bootstrap-icons";
export const AllRoutes = [
  {
    title: "Home",
    icon: <HouseDoorFill />,
    link: "/home",
  },
  {
    title: "Manager",
    icon: <PersonPlus />,
    link: "/manager",
  },
  {
    title: "Collector",
    icon: <CurrencyEuro />,
    link: "/collector",
  },
  {
    title: "Customer",
    icon: <PeopleFill />,
    link: "/customer",
  },
  {
    title: "Customer Bill",
    icon: <Cash />,
    link: "/customer-bill",
  },
  {
    title: "Graph",
    icon: <GraphUp />,
    link: "#",
  },
  {
    title: "Apple",
    icon: <Apple />,
    link: "#",
  },
  {
    title: "PaintBucket",
    icon: <PaintBucket />,
    link: "#",
  },
];
