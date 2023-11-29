import React, { useEffect, useState } from "react";
import NcImage from "components/NcImage/NcImage";
import SingleHeader from "app/(singles)/SingleHeader";
import Layout from "../layout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "app/api";
import { formatDataNews } from "app/(archives)/archive/helper";
import Badge from "components/Badge/Badge";
import SingleTitle from "app/(singles)/SingleTitle";
import SingleMetaAction2 from "app/(singles)/SingleMetaAction2";
import ButtonPlayMusicPlayer from "components/ButtonPlayMusicPlayer";
import Image from "components/Image";
import iconPlaying from "images/icon-playing.gif";
import isSafariBrowser from "utils/isSafariBrowser";
import NcPlayIcon from "components/NcPlayIcon/NcPlayIcon";
import ReactPlayer from "react-player";
import CategoryBadgeList from "components/CategoryBadgeList/CategoryBadgeList";
import PostMeta2 from "components/PostMeta2/PostMeta2";
import usePathname from "hooks/usePathname";
import ListingImageGallery from "components/listing-image-gallery/ListingImageGallery";

const PageSingle = () => {
  const { slug } = useParams();
  const [isPlay, setIsPlay] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [pageData, setPageData] = useState<any>();
  
  const router = useNavigate();
  const thisPathname = usePathname();
  const [searchParams] = useSearchParams();
  const modal = searchParams?.get("modal");

  const renderIcon = (playing: boolean) => {
    if (playing) {
      return <Image className="w-7" src={iconPlaying} alt="" />;
    }

    return (
      <svg className="w-11 h-11" fill="currentColor" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M18.25 12L5.75 5.75V18.25L18.25 12Z"></path>
      </svg>
    );
  };

  const renderButtonPlay = (playing: boolean) => {
    return (
      <div
        className={`aspect-w-1 aspect-h-1 rounded-full overflow-hidden z-10 shadow-2xl group cursor-pointer`}>
        <Image
          className={`w-full h-full object-cover transition-transform z-0 nc-animation-spin rounded-full ${
            playing ? "playing" : ""
          }`}
          src={pageData?.featuredImage}
          alt="audio"
        />

        <div className="bg-neutral-900 bg-blend-multiply bg-opacity-75 rounded-full"></div>
        <div className="flex items-center justify-center">
          <div className="text-white bg-black bg-blend-multiply bg-opacity-50 w-20 h-20 border-2 border-neutral-300 rounded-full flex items-center justify-center ">
            {renderIcon(playing)}
          </div>
        </div>
      </div>
    );
  };

  const renderMainVideo = () => {
    return (
      <div className="">
        {isSafariBrowser() && !isPlay && (
          <div
            className="absolute inset-0 z-10 cursor-pointer "
            onClick={() => setIsPlay(true)}>
            <Image
              src={pageData?.featuredImage}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              alt="single"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <NcPlayIcon />
            </div>
          </div>
        )}
        {isRendered && (
          <ReactPlayer
            url={pageData?.videoUrl}
            className="absolute inset-0"
            playing={isSafariBrowser() ? isPlay : true}
            width="100%"
            height="100%"
            controls
            light={
              isSafariBrowser()
                ? false
                : pageData?.featuredImage
            }
            playIcon={<NcPlayIcon />}
          />
        )}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className={`nc-SingleHeader `}>
        <div className="space-y-5 dark text-neutral-100">
          <CategoryBadgeList
            itemClass="!px-3"
            categories={pageData?.categories}
          />
          <SingleTitle
            mainClass="text-neutral-900 font-semibold text-3xl md:!leading-[120%] dark:text-neutral-100"
            title={pageData?.title}
          />

          <div className="w-full border-b border-neutral-100 dark:border-neutral-800"></div>
          <div className="flex flex-col space-y-5">
            <PostMeta2
              meta={pageData}
              size="large"
              className="leading-none flex-shrink-0"
              hiddenCategories
              avatarRounded="rounded-full shadow-inner"
            />
            <SingleMetaAction2 />
          </div>
        </div>
      </div>
    );
  };

  
  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");

    router(`${thisPathname}/?${params.toString()}`);
  };
  const handleOpenModalImageGallery = () => {
    router(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE`);
  };

  useEffect(() => {
    api
      .get("news", {
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
            },
          },
          categories: "*",
          relatedNews: {
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
        const news = formatDataNews(data);
        console.log(news[0]);
        setPageData(news[0]);
      });
  }, [slug]);

  useEffect(() => {
    if (pageData?.type === "video") {
      setIsRendered(true);
    }
  }, [pageData]);

  if (pageData) {
    let component;
    switch (pageData?.type) {
      case "standard":
        component = (
          <div className={`nc-PageSingle pt-8 lg:pt-16`}>
            <header className="container rounded-xl">
              <div className="max-w-screen-md mx-auto">
                <SingleHeader
                  title={pageData?.title}
                  desc={pageData?.desc}
                  post={pageData}
                />
              </div>
            </header>
            {/* FEATURED IMAGE */}
            <NcImage
              alt="single"
              containerClassName="container my-10 sm:my-12"
              className="w-full rounded-xl"
              src={pageData?.featuredImage}
              width={1260}
              height={750}
              sizes="(max-width: 1024px) 100vw, 1280px"
            />
          </div>
        );
        break;
      case "audio":
        component = (
          <div className={`relative pt-8 lg:pt-16`}>
            {/* Overlay */}
            <div className="bg-primary-50 dark:bg-neutral-800 absolute top-0 inset-x-0 h-60 w-full"></div>

            {/* SINGLE_AUDIO HEADER */}
            <header className="relative container ">
              <div className="bg-white dark:bg-neutral-900 shadow-2xl px-5 py-7 md:p-11 rounded-2xl md:rounded-[40px] flex flex-col sm:flex-row items-center justify-center space-y-10 sm:space-y-0 sm:space-x-11">
                <div className="w-1/2 sm:w-1/4 flex-shrink-0">
                  <ButtonPlayMusicPlayer
                    renderChildren={renderButtonPlay}
                    post={pageData}
                  />
                </div>
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div>
                      <Badge name="S1 EP. 128" />
                    </div>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Adventures in DevOps
                      <span className="mx-2">·</span>
                      {pageData?.date}
                    </span>
                  </div>
                  <SingleTitle title={pageData?.title} />
                  <span className="hidden lg:block text-lg text-neutral-500 dark:text-neutral-400">
                    {pageData?.desc}
                  </span>
                  <SingleMetaAction2 />
                </div>
              </div>
            </header>
          </div>
        );
        break;
      case "video":
        component = (
          <header className="container relative py-14 lg:py-20 flex flex-col lg:flex-row lg:items-center">
            <div className="nc-PageSingleVideo__headerWrap absolute inset-y-0 transform translate-x-1/2 right-1/2 w-screen lg:translate-x-0 lg:w-[calc(100vw/2)] bg-neutral-900 dark:bg-black dark:bg-opacity-50 lg:rounded-r-[40px]"></div>
            <div className="pb-10 lg:pb-0 lg:pr-10 relative">
              {renderHeader()}
            </div>
            <div className="relative lg:w-8/12 flex-shrink-0">
              <div className="aspect-w-16 aspect-h-16 sm:aspect-h-9 border-4 border-neutral-300 dark:border-neutral-800 shadow-2xl bg-neutral-800 rounded-3xl overflow-hidden z-0">
                {renderMainVideo()}
              </div>
            </div>
          </header>
        );
        break;
      case "gallery":
        component = (
          <div className={`pt-8 lg:pt-16`}>
          {/* SINGLE HEADER */}
          <header className="container rounded-xl">
            <SingleHeader hiddenDesc title={pageData?.title} desc={pageData?.desc} post={pageData}/>
            <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-2 my-10">
              <div
                className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer z-0"
                onClick={handleOpenModalImageGallery}
              >
                <NcImage
                  alt="single"
                  containerClassName="absolute inset-0"
                  className="object-cover w-full h-full rounded-xl"
                  fill
                  src={pageData?.galleryImgs[0]}
                />
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
              {pageData?.galleryImgs.filter((_: any, i: number) => i >= 1 && i < 5).map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden z-0 ${
                      index >= 2 ? "hidden sm:block" : ""
                    }`}
                  >
                    <NcImage
                      alt="single"
                      fill
                      containerClassName="aspect-w-6 aspect-h-5"
                      className="object-cover w-full h-full rounded-xl"
                      src={item || ""}
                    />
  
                    {/* OVERLAY */}
                    <div
                      className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleOpenModalImageGallery}
                    />
                  </div>
                )
              )}
  
              <div
                className="absolute hidden md:flex md:items-center md:justify-center right-3 bottom-3 px-4 py-2 rounded-full bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
                onClick={handleOpenModalImageGallery}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span className="ml-2 text-neutral-800 text-sm font-medium">
                  Show all photos
                </span>
              </div>
            </div>
          </header>
  
          <ListingImageGallery
            isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
            onClose={handleCloseModalImageGallery}
            images={pageData?.galleryImgs.map((item: any, index: number) => {
              return {
                id: index,
                url: item,
              };
            })}
          />
        </div>
        );
        break;
      default:
        component = <div>Not found!</div>;
    }
    return <Layout post={pageData}>{component}</Layout>;
  } else {
    return <></>;
  }
};

export default PageSingle;
