import React, { useEffect, useState } from "react";
import { DEMO_POSTS } from "data/posts";
import { PostDataType } from "data/types";
import Pagination from "components/Pagination/Pagination";
import ButtonPrimary from "components/Button/ButtonPrimary";
import { DEMO_AUTHORS } from "data/authors";
import { DEMO_CATEGORIES } from "data/taxonomies";
import Nav from "components/Nav/Nav";
import NavItem from "components/NavItem/NavItem";
import SocialsList from "components/SocialsList/SocialsList";
import ArchiveFilterListBox from "components/ArchiveFilterListBox/ArchiveFilterListBox";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import Card11 from "components/Card11/Card11";
import SectionSliderNewAuthors from "components/SectionSliderNewAthors/SectionSliderNewAuthors";
import NcImage from "components/NcImage/NcImage";
import { GlobeAltIcon, ShareIcon } from "@heroicons/react/24/outline";
import { avatarImgs } from "contains/fakeData";
import VerifyIcon from "components/VerifyIcon";
import FollowButton from "components/FollowButton";
import NcDropDown from "components/NcDropDown/NcDropDown";
import { SOCIALS_DATA } from "components/SocialsShare/SocialsShare";
import AccountActionDropdown from "components/AccountActionDropdown/AccountActionDropdown";
import Image from "components/Image";
import { useParams } from "react-router-dom";
import api from "app/api";

const posts: PostDataType[] = DEMO_POSTS.filter((_, i) => i < 12);
const FILTERS = [
  { name: "Most Recent" },
  { name: "Curated by Admin" },
  { name: "Most Appreciated" },
  { name: "Most Discussed" },
  { name: "Most Viewed" },
];
const TABS = ["Articles", "Favorites", "Saved"];

const PageAuthor = () => {
  const { slug } = useParams();
  const [tabActive, setTabActive] = useState<string>(TABS[0]);
  const [pageData, setPageData] = useState<any>();
  const [authors, setAuthors] = useState<any[]>([]);


  useEffect(() => {
    api
      .get("authors", {
        populate: {
          avatar: {
            fields: ["url", "name"],
          },
          news: {
            populate: {
              featuredImage: {
                fields: ["name", "url"],
              },
              galleryImage: {
                fields: ["name", "url"],
              },
              author: {
                populate: {
                  avatar: {
                    fields: ["name", "url"],
                  },
                },
              },
              categories: "*",
            },
          },
          favouriteNews: {
            populate: {
              featuredImage: {
                fields: ["name", "url"],
              },
              galleryImage: {
                fields: ["name", "url"],
              },
              author: {
                populate: {
                  avatar: {
                    fields: ["name", "url"],
                  },
                },
              },
              categories: "*",
            },
          },
          saveNews: {
            populate: {
              featuredImage: {
                fields: ["name", "url"],
              },
              galleryImage: {
                fields: ["name", "url"],
              },
              author: {
                populate: {
                  avatar: {
                    fields: ["name", "url"],
                  },
                },
              },
              categories: "*",
            },
          },
        },
        filters: {
          slug,
        },
      })
      .then((res) => {
        const { data } = res;
        const dataAuthor = data.map(
          ({ id, attributes }: { id: number; attributes: any }) => {
            return {
              id,
              ...attributes,
              avatar:
                process.env.REACT_APP_BE_URL +
                attributes?.avatar?.data?.attributes?.url,
              href: "/author/" + attributes?.slug,
            };
          }
        );
        console.log(dataAuthor[0]);
        setPageData(dataAuthor[0]);
      });
  }, [slug]);

  useEffect(() => {
    api
      .get("authors", {
        populate: {
          avatar: {
            fields: ["name", "url"],
          },
          bgImage: {
            fields: ["name", "url"],
          },
          news: {
            fields: ["id"]
          }
        },
        pagination: {
          page: 1,
          pageSize: 100,
        },
      })
      .then((res) => {
        const { data } = res;
        
        const dataAuthor = data.map(
          ({ id, attributes }: { id: number; attributes: any }) => {
            return {
              id,
              ...attributes,
              avatar:
                process.env.REACT_APP_BE_URL +
                attributes?.avatar?.data?.attributes?.url,
              bgImage:
                process.env.REACT_APP_BE_URL +
                attributes?.bgImage?.data?.attributes?.url,
              count: attributes?.news?.data.length,
              href: "/author/" + attributes?.slug,
            };
          }
        );
        console.log(dataAuthor)
        setAuthors(dataAuthor)
      });
  }, []);

  const handleClickTab = (item: string) => {
    if (item === tabActive) {
      return;
    }
    setTabActive(item);
  };

  return (
    <div className={`nc-PageAuthor `}>
      {/* HEADER */}
      <div className="w-full">
        <div className="relative w-full h-40 md:h-60 2xl:h-72">
          <NcImage
            alt=""
            containerClassName="absolute inset-0"
            sizes="(max-width: 1280px) 100vw, 1536px"
            src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            className="object-cover w-full h-full"
            fill
          />
        </div>
        <div className="container -mt-10 lg:-mt-16">
          <div className="relative bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
            <div className="w-32 lg:w-40 flex-shrink-0 mt-12 sm:mt-0">
              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold rounded-full w-20 h-20 text-xl lg:text-2xl lg:w-36 lg:h-36 ring-4 ring-white dark:ring-0 shadow-2xl z-0">
                <Image
                  alt="Avatar"
                  src={pageData?.avatar}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/*  */}
            <div className="pt-5 md:pt-1 lg:ml-6 xl:ml-12 flex-grow">
              <div className="max-w-screen-sm space-y-3.5 ">
                <h2 className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  <span>{pageData?.displayName}</span>
                  <VerifyIcon
                    className="ml-2"
                    iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                  />
                </h2>
                <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                  {pageData?.desc}
                </span>
                <a
                  href="##"
                  className="flex items-center text-xs font-medium space-x-2.5 cursor-pointer text-neutral-500 dark:text-neutral-400 truncate">
                  <GlobeAltIcon className="flex-shrink-0 w-4 h-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">
                    {pageData?.socialLink}
                  </span>
                </a>
                <SocialsList itemClass="block w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ====================== END HEADER ====================== */}

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          {/* TABS FILTER */}
          <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row">
            <Nav className="sm:space-x-2">
              {TABS.map((item, index) => (
                <NavItem
                  key={index}
                  isActive={tabActive === item}
                  onClick={() => handleClickTab(item)}>
                  {item}
                </NavItem>
              ))}
            </Nav>
            <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
          </div>

          {/* LOOP ITEMS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
            {posts.map((post) => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>

          {/* PAGINATION */}
          {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div> */}
        </main>

        {/* === SECTION 5 === */}
        <SectionSliderNewAuthors
          heading="Top elite authors"
          subHeading="Discover our elite writers"
          // authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
          authors={authors}
        />

        {/* SUBCRIBES */}
        <SectionSubscribe2 />
      </div>
    </div>
  );
};

export default PageAuthor;
