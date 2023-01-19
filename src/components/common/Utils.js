const addClass = {
  paid: "success",
  unpaid: "warning text-dark",
  expired: "danger",

  active: "primary",
  inactive: "secondary",

  new: "secondary",
  prepaid: "info",
  banned: "warning",
  deleted: "danger",
  complainManagement: "danger",
  smsBalance: "success",

  sent: "success",
  pending: "primary",
  rejected: "warning",
  accepted: "success",
  processing: "secondary",
  completed: "success",
  support: "primary",
  feature: "info",
  migration: "warning",
  auth: "info",

  registration: "danger",
  monthlyServiceCharge: "primary",
  smsPurchase: "info",

  other: "info",
  bill: "success",
  bulk: "primary",
  alert: "warning",
  processed: "warning",
};

export const badge = (item) => {
  return <span className={`badge bg-${addClass[item]}`}>{item}</span>;
};
