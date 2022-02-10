import {
  HouseDoorFill,
  CurrencyEuro,
  PeopleFill,
  PersonPlus,
  PersonLinesFill,
  GeoAlt,
  LayersFill,
  Wifi,
  // Cash,
} from "react-bootstrap-icons";
export const AllRoutes = [
  {
    title: "হোম",
    icon: <HouseDoorFill />,
    link: "/home",
  },
  {
    title: "এরিয়া ",
    icon: <GeoAlt />,
    link: "/area",
  },
  {
    title: "ম্যানেজার",
    icon: <PersonPlus />,
    link: "/manager",
  },
  {
    title: "রি-সেলার",
    icon: <LayersFill />,
    link: "/reseller",
  },
  {
    title: "গ্রাহক",
    icon: <PeopleFill />,
    link: "/customer",
  },
   

  {
    title: "কালেক্টর",
    icon: <CurrencyEuro />,
    link: "/collector",
  },
  // {
  //   title: "কাস্টমার বিল",
  //   icon: <Cash />,
  //   link: "/customer-bill",
  // },
  {
    title: "মাইক্রোটিক",
    icon: <Wifi />,
    link: "/mikrotik",
  },
];
