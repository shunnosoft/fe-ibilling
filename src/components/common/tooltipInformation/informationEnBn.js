//function called by index of array
export const informationEnBn = () => {
  const informationEn = [
    {
      id: 1,
      info: "Active customers will be selected according to payment status.",
    },
  ];

  const informationBn = [
    {
      id: 1,
      info: "পেমেন্ট স্টাটাস অনুযায়ী এক্টিভ গ্রাহকদের নির্বাচন করা হবে।",
    },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return informationBn;
  return informationEn;
};
