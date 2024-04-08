import api from "app/api";
import FormInputMedia from "components/FormInputMedia";
import { AdminContext } from "context/adminContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface IAuthor {
  id: number;
  attributes: {
    slug: string;
    desc: string;
    socialLink: string;
    avatarUrl: string;
    displayName: string;
    jobName: string;
    avatar: {
      id: number;
      name: string;
      url: string;
    };
    bgImage: {
      id: number;
      name: string;
      url: string;
    };
  };
}
const PageAuthorEdit = () => {
  const { user } = useContext(AdminContext);
  const { slug } = useParams();
  const navigate = useNavigate();
  const initAuthorState = {
    id: 0,
    attributes: {
      publishedAt: "",
      slug: "",
      desc: "",
      socialLink: "",
      avatarUrl: "",
      displayName: "",
      jobName: "",
      avatar: {
        id: 0,
        name: "",
        url: "",
      },
      bgImage: {
        id: 0,
        name: "",
        url: "",
      },
    },
  };
  const [author, setAuthor] = useState<IAuthor>(initAuthorState);
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
        },
        filters: {
          slug,
        },
      })
      .then((res) => {
        const { data } = res;
        const [author] = data;
        const {id, attributes } = author;
        const { avatar: {data: avatar}, bgImage: {data: bgImage} } = attributes;
        setAuthor({
          id,
          attributes: {
            ...attributes,
            avatar: {
              id: avatar.id,
              url: avatar.attributes.url,
              name: avatar.attributes.name,
            },
            bgImage: {
              id: bgImage.id,
              url: bgImage.attributes.url,
              name: bgImage.attributes.name,
            },
          }
        })
      });
  }, [slug]);

  if (!author) return <></>;

  return (
    <div className="container">
      <h1 className="text-3xl font-extrabold mt-8">Edit your profile here</h1>
      <p className="text-sm text-gray-400 mt-3">
        Have some big idea or brand to develop and need help? Then reach out
        we'd love to hear about your project and provide help.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          api
            .put(`/authors/${author.id}`, {
              data: {
                ...author.attributes,
                avatarUrl:
                  process.env.REACT_APP_BE_URL + author.attributes.avatar.url,
                user: [user.id]
              },
            })
            .then((res) => {
              navigate(`/author/${slug}`);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        className="ml-auo space-y-4 mt-4 flex flex-col">
        <div className="flex gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            disabled
            value={author.attributes.displayName}
            className="w-1/2 rounded-md py-2.5 px-4 border text-sm outline-[#007bff] cursor-not-allowed bg-slate-200"
          />
          <input
            type="text"
            name="email"
            placeholder="email"
            disabled
            value={user.email}
            className="w-1/2 rounded-md py-2.5 px-4 border text-sm outline-[#007bff] cursor-not-allowed bg-slate-200"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <FormInputMedia
              required
              buttonLabel="Upload Avatar"
              accept="image/*"
              onChange={(val) => {
                setAuthor((preState) => ({
                  ...preState,
                  attributes: {
                    ...preState.attributes,
                    avatar: val,
                  },
                }));
              }}
            />
            {author.attributes.avatar && (
              <div className="mt-4 relative h-[144px] w-[130px] rounded-md first:col-span-2 first:row-span-2 first:h-[293px] first:w-[265px]">
                <img
                  src={
                    process.env.REACT_APP_BE_URL + author.attributes.avatar.url
                  }
                  alt=""
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <div className="w-1/2">
            <FormInputMedia
              required
              buttonLabel="Upload Background Image"
              accept="image/*"
              onChange={(val) => {
                setAuthor((preState) => ({
                  ...preState,
                  attributes: {
                    ...preState.attributes,
                    bgImage: val,
                  },
                }));
              }}
            />
            {author.attributes.bgImage && (
              <div className="mt-4 relative h-[144px] w-[130px] rounded-md first:col-span-2 first:row-span-2 first:h-[293px] first:w-[265px]">
                <img
                  src={
                    process.env.REACT_APP_BE_URL + author.attributes.bgImage.url
                  }
                  alt=""
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            name="socialLink"
            placeholder="Social Link"
            value={author.attributes.socialLink}
            onChange={(e) => {
              setAuthor((preState) => ({
                ...preState,
                attributes: {
                  ...preState.attributes,
                  socialLink: e.target.value,
                },
              }));
            }}
            className="w-1/2 rounded-md py-2.5 px-4 border text-sm outline-[#007bff]"
          />
          <input
            type="text"
            name="jobName"
            placeholder="Job name"
            value={author.attributes.jobName}
            onChange={(e) => {
              setAuthor((preState) => ({
                ...preState,
                attributes: {
                  ...preState.attributes,
                  jobName: e.target.value,
                },
              }));
            }}
            className="w-1/2 rounded-md py-2.5 px-4 border text-sm outline-[#007bff]"
          />
        </div>
        <textarea
          placeholder="Description"
          rows={6}
          name="desc"
          value={author.attributes.desc}
          onChange={(e) => {
            setAuthor((preState) => ({
              ...preState,
              attributes: {
                ...preState.attributes,
                desc: e.target.value,
              },
            }));
          }}
          className="w-full rounded-md px-4 border text-sm pt-2.5 outline-[#007bff]"></textarea>
        <button
          type="submit"
          className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 w-full">
          Send
        </button>
      </form>
    </div>
  );
};

export default PageAuthorEdit;
