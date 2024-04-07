import React, { useContext, useState } from "react";
import Input from "components/Input/Input";
import ButtonPrimary from "components/Button/ButtonPrimary";
import NcLink from "components/NcLink/NcLink";
import Heading2 from "components/Heading/Heading2";
import Layout from "../layout";
import { AdminContext } from "context/adminContext";
import { useNavigate } from "react-router-dom";
import api from "app/api";

const PageLogin = () => {
  const { setUser } = useContext(AdminContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  return (
    <Layout>
      <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20 ">
        <Heading2>Login</Heading2>
        <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
          Welcome to our blog magazine Community
        </span>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {/* FORM */}
        <form
          className="grid grid-cols-1 gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            api
              .post("auth/local", {
                identifier: form.email,
                password: form.password,
              })
              .then((res) => {
                const { user, jwt } = res;
                console.log(user, jwt, res)
                localStorage.setItem("user", user);
                localStorage.setItem("authToken", jwt);
                setUser({ ...user, jwt });
                navigate("/");
              })
              .catch((err) => {
                console.log(err);
              });
          }}>
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Email address
            </span>
            <Input
              type="email"
              placeholder="example@example.com"
              className="mt-1"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
              Password
              <NcLink href="/forgot-pass" className="text-sm underline">
                Forgot password?
              </NcLink>
            </span>
            <Input
              type="password"
              className="mt-1"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <ButtonPrimary type="submit">Continue</ButtonPrimary>
        </form>

        {/* ==== */}
        <span className="block text-center text-neutral-700 dark:text-neutral-300">
          New user? {` `}
          <NcLink href="/signup">Create an account</NcLink>
        </span>
      </div>
    </Layout>
  );
};

export default PageLogin;
