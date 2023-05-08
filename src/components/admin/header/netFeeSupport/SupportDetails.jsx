import React from "react";
import { useTranslation } from "react-i18next";
import Contact from "./Contact";

const SupportDetails = () => {
  const { t } = useTranslation();

  return (
    <marquee className="supportDetails">
      {t("netFeeSupportContact")} &nbsp;
      {t("Towkir Hossain")} &nbsp; <Contact />
      01896192222 : 01321141785 , {t("Farabi Farhad")} &nbsp; <Contact />
      01896192223 , {t("Abdur Razzaq")} &nbsp; <Contact />
      01896192224 , {t("Rasel Ali")} &nbsp; <Contact />
      01896192225 : 01321141787 , {t("Marof")} &nbsp; <Contact />
      01896192227 , {t("Ashim Kumar")} &nbsp; <Contact />
      01896192229 &nbsp; {t("thankYou")}
    </marquee>
  );
};

export default SupportDetails;
