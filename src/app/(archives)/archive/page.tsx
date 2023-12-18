import React, { useState, useEffect } from "react";
import ModalCategories from "../ModalCategories";
import { DEMO_POSTS } from "data/posts";
import { PostDataType } from "data/types";
import ButtonPrimary from "components/Button/ButtonPrimary";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import Card11 from "components/Card11/Card11";
import Image from "components/Image";
import api from "../../api";
import { formattedCategory } from "./helper";
import { useParams } from "react-router-dom";

// Tag and category have same data type - we will use one demo data
const posts: PostDataType[] = DEMO_POSTS.filter((_, i) => i < 16);

const PageArchive = () => {
  const [category, setCategory] = useState<{ list: any[]; selected: any }>({
    list: [],
    selected: null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 8,
    total: 0,
  });
  const {slug} = useParams()

  const getCategory = () => {
    api
      .get("categories", {
        populate: {
          news: {
            populate: {
              author: {
                populate: {
                  avatar: {
                    fields: ["name", "url"],
                  },
                },
              },
              featuredImage: {
                fields: ["name", "url"],
              },
              galleryImage: {
                fields: ["name", "url"],
              },
              categories: true,
            },
          },
          thumnail: {
            fields: ["name", "url"],
          },
        },
      })
      .then((res) => {
        const { data, meta } = res;
        const list = formattedCategory(data);
        const idx = list.findIndex((item) => item.slug === slug);
        const selected = list[idx > 0 ? idx : 0];
        setCategory({ ...category, list, selected });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (category.list.length > 0) {
      const idx = category.list.findIndex((item) => item.slug === slug);
      const selected = category.list[idx > 0 ? idx : 0];
      setCategory({...category, selected})
    }
  }, [slug])

  return (
    <div className={`nc-PageArchive`}>
      {/* HEADER */}
      <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
        <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
          <Image
            alt="archive"
            fill
            src={category?.selected?.thumbnail}
            className="object-cover w-full h-full rounded-3xl md:rounded-[40px]"
            sizes="(max-width: 1280px) 100vw, 1536px"
          />
          <div className="absolute inset-0 bg-black text-white bg-opacity-30 flex flex-col items-center justify-center">
            <h2 className="inline-block align-middle text-5xl font-semibold md:text-7xl ">
              {category?.selected?.title}
            </h2>
            <span className="block mt-4 text-neutral-300">
              {category?.selected?.count} Articles
            </span>
          </div>
        </div>
      </div>
      {/* ====================== END HEADER ====================== */}

      <div className="container pt-10 pb-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <div>
          <div className="flex flex-col sm:justify-between sm:flex-row">
            <div className="flex space-x-2.5">
              <ModalCategories
                categories={category.list}
                onChangeCate={(idx) => {
                  setCategory({ ...category, selected: category.list[idx] });
                }}
              />
            </div>
            <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
          </div>

          {/* LOOP ITEMS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
            {category?.selected?.news.map((post: any) => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>

          {/* PAGINATIONS */}
          {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:justify-between sm:items-center">
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div> */}
        </div>

        {/* SUBCRIBES */}
        <SectionSubscribe2 />
      </div>
    </div>
  );
};

export default PageArchive;
