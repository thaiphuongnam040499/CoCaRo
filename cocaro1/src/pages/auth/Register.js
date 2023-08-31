import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../redux/reducer/userSlice";
import { useTranslation } from "react-i18next";

export default function Register() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const dispatch = useDispatch();
  const handleCreateUser = () => {
    if (RePassword === password) {
      let user = {
        username: username,
        password: password,
      };
      dispatch(createUser(user));
    }
  };
  const { t } = useTranslation();
  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <h2 className="text-center">{t("register")}</h2>
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form>
              {/* Email input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form1Example13">
                  {t("username")}
                </label>
                <input
                  type="text"
                  id="form1Example13"
                  className="form-control form-control-lg"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>
              {/* Password input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form1Example23">
                  {t("pass")}
                </label>
                <input
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="form-control form-control-lg"
                />
              </div>
              {/* Password input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form1Example23">
                  {t("rePass")}
                </label>
                <input
                  type="password"
                  onChange={(e) => {
                    setRePassword(e.target.value);
                  }}
                  className="form-control form-control-lg"
                />
              </div>

              <button
                type="submit"
                onClick={handleCreateUser}
                className="btn btn-primary btn-lg btn-block"
              >
                {t("register")}
              </button>
              <a className="ms-2" href="/">
                {t("login")}
              </a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
