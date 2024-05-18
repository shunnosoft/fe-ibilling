//function called by index of array
export const informationEnBn = () => {
  const informationEn = [
    {
      id: 1,
      info: "Active customers will be selected according to payment status.",
    },
    {
      id: 2,
      info: "If you turn off the previous method, it will automatically terminate your subscriber's connection for the next month.",
    },
    {
      id: 3,
      info: "If you want to change customer's mikrotik then select customer bulk and change mikrotik.",
    },
    {
      id: 4,
      info: "The reference number must give the customer ID. Otherwise the message will not be sent and the customer will not be paid.",
    },
  ];

  const informationBn = [
    {
      id: 1,
      info: "পেমেন্ট স্টাটাস অনুযায়ী এক্টিভ গ্রাহকদের নির্বাচন করা হবে।",
    },
    {
      id: 2,
      info: "পূ্র্বের পদ্ধতিটি বন্ধ করলে, এটি আপনার গ্রাহকের সংযোগ আগামী মাসে স্বয়ংক্রিয় ভাবে বন্ধ করে দিবে।",
    },
    {
      id: 3,
      info: "আপনি যদি গ্রাহকের মাইক্রোটিক পরিবর্তন করতে চান তবে গ্রাহক বাল্ক নির্বাচন করুন এবং মাইক্রোটিক পরিবর্তন করুন।",
    },
    {
      id: 4,
      info: "রেফারেন্স নম্বর অবশ্যই গ্রাহক আইডি দিতে হবে। অন্যথায় বার্তা পাঠানো হবে না এবং গ্রাহককে অর্থ প্রদান করা হবে না।",
    },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return informationBn;
  return informationEn;
};
