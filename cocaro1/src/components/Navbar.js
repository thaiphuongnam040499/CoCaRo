import React from "react";
import { useTranslation } from "react-i18next";
export default function Navbar() {
  const { i18n } = useTranslation();
  const changeLaguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="language ms-2 pt-2">
      <div className="language-btn">
        <button
          onClick={() => changeLaguage("vi")}
          className="btn btn-light me-2 border rounded"
        >
          Tiếng Việt
        </button>
        <button
          onClick={() => changeLaguage("en")}
          className="btn btn-light me-2 border rounded"
        >
          English
        </button>
      </div>
    </div>
  );
}
