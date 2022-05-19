const addClass = {
  paid: "success",
  unpaid: "warning text-dark",
  expired: "danger",

  active: "light text-dark",
  inactive: "secondary",

  new: "secondary",
  prepaid: "info",
  complainManagement: "danger",
  smsBalance: "success",
};

export const badge = (item) => {
  return (
    <span className={`badge rounded-pill bg-${addClass[item]}`}>{item}</span>
  );
};
