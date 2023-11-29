import moment from "moment";

export const formattedCategory = (categories: any[]) => {
  return categories.map(({ id, attributes: cate }: any) => {
    let news = cate?.news?.data;
    news = formatDataNews(news);
    return {
      ...cate,
      name: cate.title,
      href: "/archive/" + cate.slug,
      color: cate.bgColor,
      thumbnail:
        process.env.REACT_APP_BE_URL + cate?.thumnail?.data?.attributes?.url,
      taxonomy: "category",
      count: cate?.news?.data?.length,
      news,
    };
  });
};

export const formatDataNews = (data: any[]) => {
  const formattedItems = data.map(({ id, attributes }: any) => {
    const {
      author: {data: author},
      categories: {data: categories = []},
      slug: newSlug,
      featuredImage: {data: featuredImage},
      type,
      galleryImage: {data: galleryImage = []},
    } = attributes;
    const galleryImgs = galleryImage?.map(
      (image: any) => process.env.REACT_APP_BE_URL + image?.attributes?.url
    );
    const formatCate = (cates: any[]) => {
        return cates.map(({id, attributes}: any) => {
            return {
                id,
                ...attributes,
                name: attributes.title,
                href: attributes.slug,
                color: attributes.bgColor,
            }
        })
    }
    return {
      ...attributes,
      featuredImage:
        process.env.REACT_APP_BE_URL + featuredImage.attributes?.url,
      author: {
        id: author.id,
        ...author.attributes,
        avatar: author.attributes?.avatarUrl,
        href: "/author/" + author.attributes?.slug
      },
      date: moment(attributes.createdAt).format("MMMM DD, YYYY"),
      categories: formatCate(categories),
      galleryImgs: galleryImgs,
      postType: type,
      href: `/single${type !== "standard" ? `-${type}` : "" }/${newSlug}`,
    };
  });
  return formattedItems
};
