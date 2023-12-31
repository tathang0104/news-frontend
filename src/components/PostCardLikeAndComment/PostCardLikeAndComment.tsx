import React, { FC } from "react";
import PostCardCommentBtn from "components/PostCardCommentBtn/PostCardCommentBtn";
import PostCardLikeAction from "components/PostCardLikeAction/PostCardLikeAction";

export interface PostCardLikeAndCommentProps {
  className?: string;
  itemClass?: string;
  hiddenCommentOnMobile?: boolean;
  useOnSinglePage?: boolean;
  handleLike?: () => void;
  post?: any
}

const PostCardLikeAndComment: FC<PostCardLikeAndCommentProps> = ({
  className = "",
  itemClass = "px-3 h-8 text-xs",
  hiddenCommentOnMobile = true,
  useOnSinglePage = false,
  handleLike,
  post,
}) => {
  return (
    <div
      className={`nc-PostCardLikeAndComment flex items-center space-x-2 ${className}`}
    >
      <PostCardLikeAction className={itemClass} liked={post?.like?.isLiked} likeCount={post?.like?.count} handleLike={() => {
        handleLike && handleLike()
      }} />
      <PostCardCommentBtn
        className={`${
          hiddenCommentOnMobile ? "hidden sm:flex" : "flex"
        }  ${itemClass}`}
        isATagOnSingle={useOnSinglePage}
      />
    </div>
  );
};

export default PostCardLikeAndComment;
