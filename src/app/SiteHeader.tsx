import React, { useEffect, useMemo } from "react";
import HeaderLogged from "components/Header/HeaderLogged";
import { useLocation } from "react-router-dom";

const SiteHeader = () => {
  let pathname = useLocation().pathname;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return <HeaderLogged />;
};
export default SiteHeader;
