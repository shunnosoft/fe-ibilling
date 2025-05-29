const addClass = {
  paid: "success",
  unpaid: "warning text-dark",
  expired: "danger",

  active: "primary",
  inactive: "secondary",

  new: "info",
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
  sms: "info",

  other: "info",
  bill: "success",
  bulk: "primary",
  alert: "warning",
  processed: "warning",
  failed: "danger",

  feature: "secondary",
  complain: "warning",

  drop: "primary",
  delete: "danger",
  trial: "dark",
  high: "danger",
  medium: "info",
  low: "secondary",

  Paid: "success",
  Unpaid: "warning",
  Expired: "danger",

  message: "info",
  SENT: "success",
  UNSENT: "primary",
  REJECTED: "danger",
  TRASH: "warning",

  ispOwner: "primary",
  manager: "primary",
  collector: "primary",
  reseller: "primary",
  customer: "primary",

  CREATE: "info",
  UPDATE: "success",
  DELETE: "danger",

  RECHARGE: "success",
  accept: "success",
  drop: "danger",

  online: "success",
  offline: "secondary",

  report: "success",
};

export const badge = (item) => {
  return <span className={`badge bg-${addClass[item]}`}>{item}</span>;
};
