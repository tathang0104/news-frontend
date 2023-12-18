import React, { useContext, useState } from "react";
import Input from "components/Input/Input";
import ButtonPrimary from "components/Button/ButtonPrimary";
import NcLink from "components/NcLink/NcLink";
import Heading2 from "components/Heading/Heading2";
import Layout from "../layout";
import api from "app/api";
import { AdminContext } from "context/adminContext";
import { useNavigate } from "react-router-dom";

const PageSignUp = () => {
  const { setUser } = useContext(AdminContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  return (
    <Layout>
      <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20">
        <Heading2>Sign up</Heading2>
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
              .post("auth/local/register", {
                username: form.email,
                email: form.email,
                password: form.password,
              })
              .then((res) => {
                const { user, jwt } = res;
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
          Already have an account? {` `}
          <NcLink href="/login">Sign in</NcLink>
        </span>
      </div>
    </Layout>
  );
};

export default PageSignUp;
