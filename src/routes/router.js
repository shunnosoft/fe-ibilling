import {
  HouseDoorFill,
  Wallet2,
  PeopleFill,
  PersonPlus,
  
  GeoAlt,
  LayersFill,
  Wifi,
  // Coin,
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
    title: "কালেক্টর",
    icon: <Wallet2 />,
    link: "/collector",
  },
  {
    title: "গ্রাহক",
    icon: <PeopleFill />,
    link: "/customer",
  },
   
  {
    title: "মাইক্রোটিক",
    icon: <Wifi />,
    link: "/mikrotik",
  },
];
