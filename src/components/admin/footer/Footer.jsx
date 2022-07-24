import React from "react";
import "./footer.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="footer">
        <p>
          {" "}
          &copy; {t("shunnoIT")} - {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
