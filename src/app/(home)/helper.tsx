import { HomePageData } from "./page";
import moment from "moment";

export const formattedCategory = (categories: any[]) => {
  return categories.map((cate: any) => {
    return {
      ...cate,
      name: cate.title,
      href: "/archive/" + cate.slug,
      color: cate.bgColor,
      thumbnail: cate?.thumnail?.data?.attributes?.url,
      taxonomy: "category",
      count: cate?.news?.length
    };
  });
};

export const formattedDataHomePage = (data: any[]): HomePageData[] => {
  return data.map((item, idx) => {
    const { items, ...args } = item;
    const formattedItems = items.map((item: any) => {
      if (item.type === "INTERNAL") {
        const { __contentType } = item.related;
        switch (__contentType) {
          case "api::new.new":
            const { author, categories = [], slug: newSlug, type,  galleryImage = []} = item.related;
            const galleryImgs = galleryImage?.map((image: any) => process.env.REACT_APP_BE_URL + image?.url)
            return {
              ...item.related,
              featuredImage:
                process.env.REACT_APP_BE_URL + item.related.featuredImage?.url,
              author: {
                ...author,
                avatar: author?.avatarUrl,
              },
              date: moment(item.related.createdAt).format("MMMM DD, YYYY"),
              categories: formattedCategory(categories),
              galleryImgs: galleryImgs,
              postType: type,
              href: `/single${type !== "standard" ? `-${type}` : "" }/${newSlug}`,
            };
          case "api::author.author":
            const { avatar, bgImage, news: authorNews = [], slug: authorSlug } = item.related;
            return {
              ...item.related,
              avatar: process.env.REACT_APP_BE_URL + avatar?.url,
              bgImage: process.env.REACT_APP_BE_URL + bgImage?.url,
              date: moment(item.related.createdAt).format("MMMM DD, YYYY"),
              href: "/author/" + authorSlug,
              count: authorNews.length,
            };
          case "api::category.category":
            const { thumnail, news: categoryNews = [], slug: categorySlug, title, bgColor } = item.related;
            return {
              ...item.related,
              name: title,
              thumbnail: process.env.REACT_APP_BE_URL + thumnail?.url,
              color: bgColor,
              href: "/archive/ " + categorySlug,
              count: categoryNews.length,
            };

        }
      // } else if (item.type ==="WRAPPER") {
      //   return formattedDataHomePage(item.items)
      } else {
        return item;
      }
    });
    let filterUnpublishedItems = formattedItems
    if (item.type === "INTERNAL") {
      filterUnpublishedItems = formattedItems.filter((item: any) => item?.related?.publishedAt)

    }
    return {
      ...args,
      items: filterUnpublishedItems,
    };
  });
};
