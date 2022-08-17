const addClass = {
  paid: "success",
  unpaid: "warning text-dark",
  expired: "danger",

  active: "primary",
  inactive: "secondary",

  new: "secondary",
  prepaid: "info",
  complainManagement: "danger",
  smsBalance: "success",

  pending: "primary",
  processing: "secondary",
  completed: "success",
  support: "primary",
  feature: "info",
  migration: "warning",

  registration: "danger",
  monthlyServiceCharge: "primary",
  smsPurchase: "info",
};

export const badge = (item) => {
  return <span className={`badge bg-${addClass[item]}`}>{item}</span>;
};
