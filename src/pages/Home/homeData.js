import { People, CashStack, CartCheck, ChatDots } from "react-bootstrap-icons";

export const cardData = [
  {
    icon: <People />,
    title: "Total Clients",
    balance: "5289",
    classnam: "card1",
  },
  {
    icon: <CashStack />,
    title: "Account Balance",
    balance: "$ 2300",
    classnam: "card2",
  },
  {
    icon: <CartCheck />,
    title: "New sales",
    balance: "231",
    classnam: "card3",
  },
  {
    icon: <ChatDots />,
    title: "Pending Contacts",
    balance: "23",
    classnam: "card4",
  },
];

export const chartsData = {
  labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "Users",
      data: [45, 221, 100, 83, 20, 150],
      backgroundColor: ["purple", "yellow", "green", "blue"],
      borderColor: "#0cc30c",
      borderWidth: 2,
    },
    {
      label: "Quantity",
      data: [100, 104, 23, 123, 200, 43],
      backgroundColor: "rgb(110 110 110 / 24%)",
      borderJoinStyle: "round",
      borderColor: "#00a4e3",
      // borderCapStyle: "bevel" || "round" || "miter",
      fill: "origin",
      borderWidth: 2,
    },
  ],
};
