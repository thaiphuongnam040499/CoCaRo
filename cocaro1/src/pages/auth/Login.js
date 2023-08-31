import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findAllUser } from "../../redux/reducer/userSlice";
import { json, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user.listUser);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(findAllUser());
  }, []);

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  useEffect(() => {
    localStorage.setItem("userLogin", JSON.stringify(user));
  }, [user]);
  const handleLogin = () => {
    if (user) {
      navigate("/home");
    }
  };
  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <h2 className="text-center">{t("login")}</h2>
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
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  id="form1Example13"
                  className="form-control form-control-lg"
                />
              </div>
              {/* Password input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form1Example23">
                  {t("pass")}
                </label>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  id="form1Example23"
                  className="form-control form-control-lg"
                />
              </div>
              <button
                onClick={handleLogin}
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                {t("signIn")}
              </button>
              <a className="ms-2" href="/register">
                {t("register")}
              </a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
