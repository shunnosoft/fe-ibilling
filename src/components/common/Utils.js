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

  sent: "success",
  pending: "primary",
  processing: "secondary",
  completed: "success",
  support: "primary",
  feature: "info",
  migration: "warning",

  registration: "danger",
  monthlyServiceCharge: "primary",
  smsPurchase: "info",

  other: "info",
  bill: "success",
  bulk: "primary",
  alert: "warning",
};

export const badge = (item) => {
  return <span className={`badge bg-${addClass[item]}`}>{item}</span>;
};
