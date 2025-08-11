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
    {
      id: 5,
      info: "You must provide a complete IP format, such as 192.168.0.1/32. Entering only 192.168.0.1 is not acceptable. If you want to specify a particular IP address, you must include the /CIDR notation (e.g., /29, /30, /32) or an IP block number after it.",
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
    {
      id: 5,
      info: "অবশ্যই একটি সম্পূর্ণ IP ফরম্যাট দিতে হবে, যেমন: 192.168.0.1/32। শুধুমাত্র 192.168.0.1 গ্রহণযোগ্য হবে না। যদি নির্দিষ্ট কোনো IP অ্যাড্রেস দিতে চান, তবে অবশ্যই তার পরে /CIDR (যেমন: /29, /30, /32) অথবা IP ব্লক সংখ্যা ব্যবহার করুন।",
    },
  ];

  if (localStorage.getItem("oneBilling:lang") === "bn") return informationBn;
  return informationEn;
};
