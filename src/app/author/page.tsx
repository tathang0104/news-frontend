import React, { Fragment, useContext, useEffect, useState } from "react";
import { PostDataType } from "data/types";
import Nav from "components/Nav/Nav";
import NavItem from "components/NavItem/NavItem";
import SocialsList from "components/SocialsList/SocialsList";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import Card11 from "components/Card11/Card11";
import SectionSliderNewAuthors from "components/SectionSliderNewAthors/SectionSliderNewAuthors";
import NcImage from "components/NcImage/NcImage";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import VerifyIcon from "components/VerifyIcon";
import Image from "components/Image";
import { useNavigate, useParams } from "react-router-dom";
import api, { generateSlug } from "app/api";
import { AdminContext } from "context/adminContext";
import FormInputMedia from "components/FormInputMedia";
import Dropdown from "components/Dropdown";
import { formatDataNews } from "app/(archives)/archive/helper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


interface IForm {
  title: string;
  slug: string;
  desc: string;
  videoUrl: string;
  audioUrl: string;
  featuredImage?: {
    id: number;
    url: string;
    name: string;
  };
  galleryImage: any[];
  type: string;
  content: string;
}
const PageAuthor = () => {
  const { user } = useContext(AdminContext);
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const initForm = {
    title: "",
    slug: "",
    desc: "",
    videoUrl: "",
    audioUrl: "",
    featuredImage: undefined,
    galleryImage: [],
    type: "standard",
    content: "",
  }
  const [form, setForm] = useState<IForm>(initForm);
  const TAB1 = [
    {
      name: "Articles",
      handle: () => navigate(`/author/${slug}`),
    },
    {
      name: "Create News",
      handle: () => {
        setForm(initForm)
        navigate(`/author/${slug}/create-news`)
      },
    },
    {
      name: "Edit Profile",
      handle: () => {
        setForm(initForm)
        navigate(`/author/${slug}/edit-profile`)
      },
    },
  ];
  const TAB2 = [
    {
      name: "Articles",
      handle: () => navigate(`/author/${slug}`),
    },
  ];
  const TABS = user?.username === slug ? TAB1 : TAB2;
  const [tabActive, setTabActive] = useState<string>(TABS[0].name);
  const [pageData, setPageData] = useState<any>();
  const [authors, setAuthors] = useState<any[]>([]);

  const handleDeleteImage = (idx: number) => {
    const images = [...form.galleryImage];
    if (idx >= 0 && idx < images.length) {
      const newImages = images.filter((item, i) => i !== idx);
      setForm((preState) => ({ ...preState, galleryImage: newImages }));
    }
  };

  useEffect(() => {
    api
      .get("authors", {
        populate: {
          avatar: {
            fields: ["url", "name"],
          },
          bgImage: {
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
              bgImage:
                process.env.REACT_APP_BE_URL +
                attributes?.bgImage?.data?.attributes?.url,
              href: "/author/" + attributes?.slug,
            };
          }
        );
        const [author] = dataAuthor;
        const news = formatDataNews(author.news.data);
        setPageData({ ...author, news });
      });
  }, [slug, id]);

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
            fields: ["id"],
          },
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
        setAuthors(dataAuthor);
      });
  }, []);

  useEffect(() => {
    if (id) {
      api
        .get(`/news/${id}`, {
          populate: {
            featuredImage: "*",
            galleryImage: "*",
            author: "*",
            categories: "*",
          },
        })
        .then((res) => {
          const { data } = res;
          const { attributes } = data;
          setForm({
            audioUrl: attributes.audioUrl,
            videoUrl: attributes.videoUrl,
            desc: attributes.desc,
            content: attributes.content,
            slug: attributes.slug,
            title: attributes.title,
            type: attributes.type,
            galleryImage:
              attributes.galleryImage.data.map((item: any) => ({
                id: item.id,
                url: item.attributes.url,
                name: item.attributes.name,
              })) || [],
            featuredImage: attributes.featuredImage.data?.attributes,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);
  const handleClickTab = (item: any) => {
    if (item === tabActive) {
      return;
    }
    item.handle && item.handle();
    setTabActive(item.name);
  };

  if (!pageData) return <></>;

  return (
    <div className={`nc-PageAuthor `}>
      {/* HEADER */}
      <div className="w-full">
        <div className="relative w-full h-40 md:h-60 2xl:h-72">
          <NcImage
            alt=""
            containerClassName="absolute inset-0"
            sizes="(max-width: 1280px) 100vw, 1536px"
            // src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            src={pageData?.bgImage}
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
                  isActive={tabActive === item.name}
                  onClick={() => handleClickTab(item)}>
                  {item.name}
                </NavItem>
              ))}
            </Nav>
            <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
          </div>

          {tabActive === "Create News" || id ? (
            <div className="mt-10">
              <h1 className="text-3xl font-extrabold">
                Let Create your own post
              </h1>
              <p className="text-sm text-gray-400 mt-3">
                Have some big idea or brand to develop and need help? Then reach
                out we'd love to hear about your project and provide help.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (id) {
                    api.put(`/news/${id}`, {
                      data: {
                        ...form,
                      },
                    });
                  } else {
                    api
                      .post("news", {
                        data: {
                          ...form,
                          slug: generateSlug(form.title),
                          author: {
                            connect: [pageData.id],
                          },
                        },
                      })
                      .then((res) => {
                        const { data } = res;
                        navigate(`/author/${slug}/news/${data.id}`);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                }}
                className="ml-auo space-y-4 mt-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => {
                    setForm((preState) => ({
                      ...preState,
                      title: e.target.value,
                    }));
                  }}
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]"
                />
                <FormInputMedia
                  required
                  buttonLabel="Upload Feature Images"
                  accept="image/*"
                  onChange={(val) => {
                    setForm((preState) => ({
                      ...preState,
                      featuredImage: val,
                    }));
                  }}
                />
                {form.featuredImage && (
                  <div className="relative h-[144px] w-[130px] rounded-md first:col-span-2 first:row-span-2 first:h-[293px] first:w-[265px]">
                    <img
                      src={
                        process.env.REACT_APP_BE_URL + form.featuredImage?.url
                      }
                      alt=""
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="text"
                  name="videoUrl"
                  placeholder="Video Url"
                  value={form.videoUrl}
                  onChange={(e) => {
                    setForm((preState) => ({
                      ...preState,
                      videoUrl: e.target.value,
                    }));
                  }}
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]"
                />
                <input
                  type="text"
                  name="audioUrl"
                  placeholder="Audio Url"
                  value={form.audioUrl}
                  onChange={(e) => {
                    setForm((preState) => ({
                      ...preState,
                      audioUrl: e.target.value,
                    }));
                  }}
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]"
                />
                <select
                  name="videoUrl"
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]"
                  value={form.type}
                  onChange={(e) => {
                    setForm((preState) => ({
                      ...preState,
                      type: e.target.value,
                    }));
                  }}>
                  <option value="" selected disabled>
                    Type
                  </option>
                  <option value="standard">standard</option>
                  <option value="video">video</option>
                  <option value="audio">audio</option>
                  <option value="gallery">gallery</option>
                </select>
                <textarea
                  placeholder="Description"
                  rows={6}
                  name="desc"
                  value={form.desc}
                  onChange={(e) => {
                    setForm((preState) => ({
                      ...preState,
                      desc: e.target.value,
                    }));
                  }}
                  className="w-full rounded-md px-4 border text-sm pt-2.5 outline-[#007bff]"></textarea>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                    ],
                    heading: {
                      options: [
                        {
                          model: "paragraph",
                          title: "Paragraph",
                          class: "ck-heading_paragraph",
                        },
                        {
                          model: "heading1",
                          view: "h1",
                          title: "Heading 1",
                          class: "ck-heading_heading1",
                        },
                        {
                          model: "heading2",
                          view: "h2",
                          title: "Heading 2",
                          class: "ck-heading_heading2",
                        },
                      ],
                    },
                  }}
                  data={form.content}
                  onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setForm((preState) => ({ ...preState, content: data }));
                  }}
                />
                <FormInputMedia
                  required
                  uploadMultiple
                  showPreview
                  buttonLabel="Upload Gallery Images"
                  accept="image/*"
                  onChange={(val) => {
                    const images: any[] = val;
                    setForm((preState) => ({
                      ...preState,
                      galleryImage: [...preState.galleryImage, ...images],
                    }));
                  }}
                />
                <div className="mt-[31px] grid max-w-[670px] grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-[5px]">
                  {form.galleryImage.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="relative h-[144px] w-[130px] rounded-md first:col-span-2 first:row-span-2 first:h-[293px] first:w-[265px]">
                        <img
                          src={process.env.REACT_APP_BE_URL + item.url}
                          alt=""
                          className="h-full w-full object-cover rounded-md"
                        />
                        <div className="el-dropdown absolute right-[14px] top-[17px] h-1.5 w-6">
                          <Dropdown
                            list={[
                              {
                                id: 1,
                                name: "Delete Image",
                                onClick: () => {
                                  handleDeleteImage(idx);
                                },
                              },
                            ]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="submit"
                  className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 w-full">
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
              {pageData?.news?.map((post: PostDataType) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          )}
          {user?.username === slug && !id && tabActive !== "Create News" && (
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                <div className="py-2 inline-block min-w-full mt-5">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-200 border-b">
                        <tr>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            #
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Title
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Type
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageData.news.map(
                          (item: PostDataType, idx: number) => (
                            <tr
                              key={idx}
                              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {idx + 1}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.title}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.postType}
                              </td>
                              <td className="text-sm flex gap-4 text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    navigate(`/author/${slug}/news/${item.id}`);
                                    setTabActive("");
                                  }}>
                                  <svg
                                    className="w-6 h-6"
                                    width="64px"
                                    height="64px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      stroke-width="0"></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                        stroke="#000000"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                      <path
                                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                        stroke="#000000"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    api
                                      .delete(`/news/${item.id}`)
                                      .then((res) => {
                                        setPageData({
                                          ...pageData,
                                          news: pageData.news.filter((_i: any) => _i.id !== item.id),
                                        });
                                      });
                                  }}>
                                  {" "}
                                  <svg
                                    className="w-6 h-6"
                                    width="64px"
                                    height="64px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      stroke-width="0"></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M10 11V17"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                      <path
                                        d="M14 11V17"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                      <path
                                        d="M4 7H20"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                      <path
                                        d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                      <path
                                        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        {tabActive !== "Create News" && (
          <Fragment>
            <SectionSliderNewAuthors
              heading="Top elite authors"
              subHeading="Discover our elite writers"
              authors={authors}
            />

            <SectionSubscribe2 />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default PageAuthor;
