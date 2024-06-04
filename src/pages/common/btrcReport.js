import moment from "moment";

export const btrcHeader = [
  { label: "client_type", key: "home" },
  { label: "connection_type", key: "connectionType" },
  { label: "client_name", key: "name" },
  { label: "bandwidth_distribution_point", key: "companyAddress" },
  { label: "connectivity_type", key: "connectivity" },
  { label: "activation_date", key: "createdAt" },
  { label: "bandwidth_allocation", key: "package" },
  { label: "allocated_ip", key: "ip" },
  { label: "division", key: "division" },
  { label: "district", key: "district" },
  { label: "thana", key: "thana" },
  { label: "address", key: "customerAddress" },
  { label: "client_mobile", key: "mobile" },
  { label: "client_email", key: "email" },
  { label: "selling_price_bdt_excluding_vat", key: "monthlyFee" },
];

export const newBTRCReport = (customerData, ispOwnerData) => {
  const data = customerData?.map((customer) => {
    return {
      home: "Home",
      connectionType: "Wired",
      name: customer.name,
      companyAddress: ispOwnerData.address,
      connectivity: "Share It",
      createdAt: moment(customer.createdAt).format("YYYY-MM-DD"),
      package: customer.pppoe?.profile,
      ip: customer.ip,
      division: customer.division || "",
      district: customer.district || "",
      thana: customer.thana || "",
      customerAddress: customer.address,
      mobile: customer.mobile || "",
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
    };
  });
  return data;
};
