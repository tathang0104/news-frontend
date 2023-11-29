import React, { useState } from "react";
import SectionLargeSlider from "app/(home)/SectionLargeSlider";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderNewAuthors from "components/SectionSliderNewAthors/SectionSliderNewAuthors";
import {
  DEMO_POSTS,
  DEMO_POSTS_AUDIO,
  DEMO_POSTS_GALLERY,
  DEMO_POSTS_VIDEO,
} from "data/posts";
// import { DEMO_CATEGORIES } from "data/taxonomies";
import { DEMO_AUTHORS } from "data/authors";
import SectionSliderNewCategories from "components/SectionSliderNewCategories/SectionSliderNewCategories";
import SectionSliderPosts from "components/Sections/SectionSliderPosts";
import SectionMagazine1 from "components/Sections/SectionMagazine1";
import SectionAds from "components/Sections/SectionAds";
import SectionMagazine7 from "components/Sections/SectionMagazine7";
import SectionGridPosts from "components/Sections/SectionGridPosts";
import SectionMagazine8 from "components/Sections/SectionMagazine8";
import SectionMagazine9 from "components/Sections/SectionMagazine9";
import SectionGridAuthorBox from "components/SectionGridAuthorBox/SectionGridAuthorBox";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import SectionVideos from "components/Sections/SectionVideos";
import SectionLatestPosts from "components/Sections/SectionLatestPosts";
import SectionMagazine2 from "components/Sections/SectionMagazine2";
import api from "../api";
import { formattedDataHomePage } from "./helper";
import { PostDataType, TaxonomyType } from "data/types";
import LastestArticle from "./LastestArticle";
import Loading from "components/Button/Loading";

//
const MAGAZINE1_POSTS = DEMO_POSTS.filter((_, i) => i >= 8 && i < 16);
const MAGAZINE2_POSTS = DEMO_POSTS.filter((_, i) => i >= 0 && i < 7);
//

export interface HomePageData {
  id: string;
  title: string;
  menuAttached: boolean;
  order: number;
  path: string;
  type: string;
  uiRouterKey: string;
  slug: string;
  external: boolean;
  items: any[];
  desc?: string;
}

const PageHome = () => {
  const [pageData, setPageData] = React.useState<HomePageData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const getDataHome = () => {
    const url = "navigation/render/home";
    api
      .get(url, { type: "TREE" })
      .then((data) => {
        setPageData(formattedDataHomePage(data));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getDataHome();
  }, []);

  return (
    <div className="nc-PageHome relative">
      {pageData.map((item) => {
        let component;
        switch (item.path) {
          case "/editor-pick":
            component = (
              <div className="container">
                <SectionLargeSlider
                  className="pt-10 pb-16 md:py-16 lg:pb-28 lg:pt-20"
                  // posts={DEMO_POSTS?.filter((_, i) => i < 3)}
                  posts={item.items}
                  heading={item.title}
                  desc={item.desc}
                />
              </div>
            );
            break;
          case "/newest-authors":
            component = (
              <div className="container">
                <div className="relative py-16">
                  <BackgroundSection />
                  <SectionSliderNewAuthors
                    heading={item.title}
                    subHeading={item.desc}
                    // authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
                    authors={item.items}
                  />
                </div>
              </div>
            );
            break;
          case "/top-trending-topics":
            component = (
              <div className="container">
                <SectionSliderNewCategories
                  className="py-16 lg:py-28"
                  heading={item.title}
                  subHeading={`Discover ${item.items.length} topics`}
                  // categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
                  categories={item.items}
                  categoryCardType="card4"
                />
              </div>
            );
            break;
          case "/explore-lastest-audio-articles":
            component = (
              <div className="container">
                <div className="relative py-16">
                  <BackgroundSection />
                  <SectionSliderPosts
                    postCardName="card9"
                    heading={item.title}
                    subHeading={item.desc}
                    // posts={DEMO_POSTS_AUDIO.filter((_, i) => i > 3 && i < 10)}
                    posts={item.items}
                  />
                </div>
              </div>
            );
            break;
          case "/latest-articles":
            component = (
              <LastestArticle
                posts={formattedDataHomePage(item.items)}
                desc={item.desc}
                heading={item.title}
              />
            );
            break;
          case "/ads":
            component = (
              <div className="container">
                <SectionAds />
              </div>
            );
            break;
          case "/view-more-gallery-articles":
            component = (
              <div className="container">
                <SectionMagazine7
                  className="py-16 lg:py-28"
                  heading={item.title}
                  subHeading={`Over ${item.items.length} articles has gallery type`}
                  posts={item.items}
                />
              </div>
            );
            break;
          case "/explore-lastest-video-articles":
            component = (
              <div className="dark bg-neutral-900 dark:bg-black dark:bg-opacity-20 text-neutral-100">
                <div className="relative container">
                  <SectionGridPosts
                    className="py-16 lg:py-28"
                    headingIsCenter
                    postCardName="card10V2"
                    heading={item.title}
                    subHeading={item.desc}
                    // posts={DEMO_POSTS_VIDEO.filter((_, i) => i > 5 && i < 12)}
                    posts={item.items}
                    gridClass="md:grid-cols-2 lg:grid-cols-3"
                  />
                </div>
              </div>
            );
            break;
          case "/listen-to-podcasts-live":
            component = (
              <div className="container">
                <SectionMagazine8
                  className="py-16 lg:py-28"
                  heading={item.title}
                  subHeading={item.desc}
                  // posts={DEMO_POSTS_AUDIO.filter((_, i) => i < 6)}
                  posts={item.items}
                />
              </div>
            );
            break;
          case "/listen-to-audio-live":
            component = (
              <div className="container">
                <div className="relative py-16">
                  <BackgroundSection />
                  <SectionMagazine9
                    heading={item.title}
                    subHeading={item.desc}
                    // posts={DEMO_POSTS_AUDIO.filter((_, i) => i >= 6 && i < 15)}
                    posts={item.items}
                  />
                </div>
              </div>
            );
            break;
          case "/top-10-author-of-the-month":
            component = (
              <div className="container">
                <SectionGridAuthorBox
                  heading={item.title}
                  subHeading={item.desc}
                  className="py-16 lg:py-28"
                  // authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
                  authors={item.items}
                />
              </div>
            );
            break;
          case "/become-an-author":
            component = (
              <div className="container">
                <div className="relative py-16">
                  <BackgroundSection />
                  <SectionBecomeAnAuthor />
                </div>
              </div>
            );
            break;
          case "/more-design-articles":
            component = (
              <div className="container">
                {item.items.length > 0 && (
                  <div className="relative py-16">
                    <BackgroundSection />
                    <SectionSliderPosts
                      postCardName="card11"
                      heading={item.title}
                      subHeading={`Over ${item.items.length} articles`}
                      // posts={DEMO_POSTS.filter(
                      //   (p, i) => i > 3 && i < 25 && p.postType === "standard"
                      // )}
                      posts={item.items}
                    />
                  </div>
                )}
              </div>
            );
            break;
          case "/Join-our-newsletter":
            component = (
              <div className="container">
                <SectionSubscribe2 className="pt-16 lg:pt-28" />
              </div>
            );
            break;
          default:
            break;
        }
        return component;
      })}

      <div className="container ">
        {/* <SectionMagazine2
          className="py-16 lg:py-24"
          heading="Life styles 🎨 "
          posts={MAGAZINE2_POSTS}
        /> */}

        {/* <SectionVideos className="py-16 lg:py-28" /> */}

        <SectionLatestPosts className="pb-16 lg:pb-28" />
      </div>
    </div>
  );
};

export default PageHome;
