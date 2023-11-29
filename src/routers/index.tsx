import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Page } from "./types";
import Footer from "components/Footer/Footer";
import MusicPlayer from "components/MusicPlayer/MusicPlayer";
import PageHome from "app/(home)/page";
import PageArchive from "app/(archives)/archive/page";
import PageAuthor from "app/author/page";
import PageSingle from "app/(singles)/(default)/single/page";
import PageSingleGallery from "app/(singles)/(default)/single-gallery/page";
import PageSingleAudio from "app/(singles)/(default)/single-audio/page";
import PageSingleVideo from "app/(singles)/(default)/single-video/page";
import PageSearch from "app/(search)/search/page";
import Page404 from "app/not-found";
import PageLogin from "app/(others)/login/page";
import PageSignUp from "app/(others)/signup/page";
import SiteHeader from "app/SiteHeader";

export const pages: Page[] = [
  { path: "/", component: PageHome },

  // archives page -------------------------------------------------------
  { path: "/archive/:slug", component: PageArchive },
  { path: "/author/:slug", component: PageAuthor },

  // single page -------------------------------------------------------
  { path: "/single/:slug", component: PageSingle },
  { path: "/single-audio/:slug", component: PageSingle },
  { path: "/single-video/:slug", component: PageSingle },
  { path: "/single-gallery/:slug", component: PageSingle },

  // search -------------------------------------------------------
  { path: "/search", component: PageSearch },

  // other pages -------------------------------------------------------
  { path: "/page404", component: Page404 },
  { path: "/login", component: PageLogin },
  { path: "/signup", component: PageSignUp },
];

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <SiteHeader />
      <Routes>
        {pages.map(({ component: Component, path }, index) => {
          return <Route key={index} element={<Component />} path={path} />;
        })}
        <Route element={<Page404 />} />
      </Routes>

      <Footer />
      <MusicPlayer />
    </BrowserRouter>
  );
};

export default MyRoutes;
