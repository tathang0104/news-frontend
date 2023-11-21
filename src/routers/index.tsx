import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Page } from "./types";
import Footer from "components/Footer/Footer";
import MusicPlayer from "components/MusicPlayer/MusicPlayer";
import PageHome from "app/(home)/page";
import PageArchive from "app/(archives)/archive/page";
import PageAuthor from "app/author/page";
import PageSingle from "app/(singles)/(default)/single/page";
import PageSingleTemplate2 from "app/(singles)/(default)/single-2/page";
import PageSingleTemplate3 from "app/(singles)/(has-sidebar)/single-3/page";
import PageSingleGallery from "app/(singles)/(default)/single-gallery/page";
import PageSingleAudio from "app/(singles)/(default)/single-audio/page";
import PageSingleVideo from "app/(singles)/(default)/single-video/page";
import PageSearch from "app/(search)/search/page";
import Page404 from "app/not-found";
import PageLogin from "app/(others)/login/page";
import PageSignUp from "app/(others)/signup/page";
import SiteHeader from "app/SiteHeader";
import PageSingleTemplate4 from "app/(singles)/(has-sidebar)/single-4/page";

export const pages: Page[] = [
  { path: "/", component: PageHome },

  // archives page -------------------------------------------------------
  { path: "/archive/*", component: PageArchive },
  { path: "/author/*", component: PageAuthor },

  // single page -------------------------------------------------------
  { path: "/single/*", component: PageSingle },
  { path: "/single-2/*", component: PageSingleTemplate2 },
  { path: "/single-audio/*", component: PageSingleAudio },
  { path: "/single-video/*", component: PageSingleVideo },
  { path: "/single-gallery/*", component: PageSingleGallery },
  { path: "/single-3/*", component: PageSingleTemplate3 },
  { path: "/single-4/*", component: PageSingleTemplate4 },
  { path: "/single-5/*", component: PageSingleTemplate2 },

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
