import { t } from "i18next";

export const collectorData = [
  {
    id: 1,
    name: "name",
    label: t("name"),
    type: "text",
  },
  {
    id: 2,
    name: "mobile",
    label: t("mobile"),
    type: "text",
    disabled: true,
  },
  {
    id: 3,
    name: "email",
    label: t("email"),
    type: "email",
  },
  {
    id: 4,
    name: "address",
    label: t("address"),
    type: "text",
  },
  {
    id: 5,
    name: "nid",
    label: t("NIDno"),
    type: "text",
  },
  //   {
  //     id: 6,
  //     name: "refName",
  //     label: "রেফারেন্স নাম",
  //     type: "text",
  //   },
  //   {
  //     id: 7,
  //     name: "refMobile",
  //     label: "রেফারেন্স মোবাইল",
  //     type: "text",
  //   },
];
