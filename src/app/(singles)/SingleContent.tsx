import React, { FC, useContext, useEffect, useRef, useState } from "react";
import Tag from "components/Tag/Tag";
import SingleAuthor from "./SingleAuthor";
import SingleCommentForm from "./SingleCommentForm";
import SingleCommentLists from "./SingleCommentLists";
import SingleContentDemo from "./SingleContentDemo";
import { DEMO_TAGS } from "data/taxonomies";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import PostCardLikeAction from "components/PostCardLikeAction/PostCardLikeAction";
import PostCardCommentBtn from "components/PostCardCommentBtn/PostCardCommentBtn";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import api from "app/api";
import { CommentType } from "components/CommentCard/CommentCard";
import moment from "moment";
import { AdminContext } from "context/adminContext";

const demoTags = DEMO_TAGS.filter((_, i) => i < 9);

export interface SingleContentProps {
  post?: any
}
export interface CommentContent {
  username?: string;
  email?: string;
  content?: string;
  threadOf?: number | null;
}

const formattedCommentsData = (data: any) => (
  data?.map((item: any) => ({
    id: item.id,
    date: moment(item.createdAt).format('MMM DD, YYYY'),
    content: item.content,
    like: {
      count: item.likeCount,
      isLiked: false,
    },
    author: {
      href: item?.author?.href,
      displayName: item?.author?.name,
      avatar: item?.author?.avatar?.url 
        ? (process.env.REACT_APP_BE_URL + item?.author?.avatar?.url)
        : item?.author?.avatar
    },
    children: formattedCommentsData(item.children)
  }))
)

const SingleContent: FC<SingleContentProps> = ({post}) => {
  const endedAnchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLButtonElement>(null);
  //
  const [isShowScrollToTop, setIsShowScrollToTop] = useState<boolean>(false);
  //

  const endedAnchorEntry = useIntersectionObserver(endedAnchorRef, {
    threshold: 0,
    root: null,
    rootMargin: "0%",
    freezeOnceVisible: false,
  });
  const [commentData, setCommentData] = useState<CommentType[]>([])
  const [commentContent, setCommentContent] = useState<CommentContent>({
    content: '',
    email: '',
    username: '',
  })
  const [commentReplyContent, setCommentReplyContent] = useState<CommentContent>({
    threadOf: null,
    content: '',
    email: '',
    username: '',
  })
  const [flagReply, setFlagReply] = useState<number>(0)
  const [flag, setFlag] = useState<number>(0)
  const {user} = useContext(AdminContext)

  useEffect(() => {
    const handleProgressIndicator = () => {
      const entryContent = contentRef.current;
      const progressBarContent = progressRef.current;

      if (!entryContent || !progressBarContent) {
        return;
      }

      const totalEntryH = entryContent.offsetTop + entryContent.offsetHeight;
      let winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      let scrolled = (winScroll / totalEntryH) * 100;

      progressBarContent.innerText = scrolled.toFixed(0) + "%";

      if (scrolled >= 100) {
        setIsShowScrollToTop(true);
      } else {
        setIsShowScrollToTop(false);
      }
    };

    const handleProgressIndicatorHeadeEvent = () => {
      window?.requestAnimationFrame(handleProgressIndicator);
    };
    handleProgressIndicator();
    window?.addEventListener("scroll", handleProgressIndicatorHeadeEvent);
    return () => {
      window?.removeEventListener("scroll", handleProgressIndicatorHeadeEvent);
    };
  }, []);

  useEffect(() => {
    api.get
    (
        `/comments/api::new.new:${post.id}?sort[0]=updatedAt%3Adesc&populate[author]=*`
    ).then((res) => {
      console.log(res)
        setCommentData(formattedCommentsData(res))
    })
}, [post.id, flag, flagReply])

  useEffect(() => {
    if (contentRef.current && post) {
      contentRef.current.innerHTML = post.content
    }
  }, [post]);

  const showLikeAndCommentSticky =
    !endedAnchorEntry?.intersectionRatio &&
    (endedAnchorEntry?.boundingClientRect.top || 0) > 0;

console.log(commentData)
  return (
    <div className="relative">
      <div className="nc-SingleContent space-y-10">
        {/* ENTRY CONTENT */}
        <div
          id="single-entry-content"
          className="prose lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert"
          ref={contentRef}
        >
        </div>

        {/* AUTHOR */}
        <div className="max-w-screen-md mx-auto border-b border-t border-neutral-100 dark:border-neutral-700"></div>
        <div className="max-w-screen-md mx-auto ">
          <SingleAuthor author={post?.author}/>
        </div>

        {/* COMMENT FORM */}
        <div
          id="comments"
          className="scroll-mt-20 max-w-screen-md mx-auto pt-5"
        >
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Responses ({commentData.length})
          </h3>
          <SingleCommentForm
            threadOf={null}
            onClickSubmit={(e, threadOf) => {
              e.preventDefault();
              api.postComment('api::new.new', post.id, {
                  authorId: 123,
                  content: commentContent.content,
                  email: commentContent.email,
                  threadOf: threadOf,
                  username: commentContent.username,
              }, user?.jwt).then(() => {
                setCommentContent({...commentContent, content: ''});
                setFlag(flag + 1)
              })
            }}
            value={commentContent}
            onChange={(key, value) => setCommentContent({...commentContent, [key]: value})}
            onClickCancel={() => setCommentContent({...commentContent, content: ''})}
          />
        </div>

        {/* COMMENTS LIST */}
        <div className="max-w-screen-md mx-auto">
        <SingleCommentLists
            comments={commentData}
            onSendReplyComment={(e, threadOf) => {
              e.preventDefault();
              api.postComment('api::new.new', post.id, {
                authorId: 123,
                content: commentReplyContent.content,
                email: commentReplyContent.email,
                threadOf: threadOf,
                username: commentReplyContent.username,
              }).then(() => {
                setCommentReplyContent({...commentReplyContent, content: ''});
                setFlagReply(flagReply + 1)
              })
            }}
            replyCommentContent={commentReplyContent}
            onChangeReply={(key, value) => setCommentReplyContent({...commentReplyContent, [key]: value})}
          />
          <div ref={endedAnchorRef}></div>
        </div>
      </div>
      <div
        className={`sticky mt-8 bottom-8 z-40 justify-center ${
          showLikeAndCommentSticky ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-full ring-1 ring-offset-1 ring-neutral-900/5 p-1.5 flex items-center justify-center space-x-2 text-xs">
          <PostCardLikeAction className="px-3 h-9 text-xs" />
          <div className="border-l h-4 border-neutral-200 dark:border-neutral-700"></div>
          <PostCardCommentBtn
            isATagOnSingle
            className={` flex px-3 h-9 text-xs`}
          />
          <div className="border-l h-4 border-neutral-200 dark:border-neutral-700"></div>

          <button
            className={`w-9 h-9 items-center justify-center bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 rounded-full ${
              isShowScrollToTop ? "flex" : "hidden"
            }`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>

          <button
            ref={progressRef}
            className={`w-9 h-9 items-center justify-center ${
              isShowScrollToTop ? "hidden" : "flex"
            }`}
            title="Go to top"
          >
            %
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleContent;
