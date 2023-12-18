import React, { FC, useState } from "react";
import convertNumbThousand from "utils/convertNumbThousand";
import twFocusClass from "utils/twFocusClass";

export interface CommentCardLikeReplyProps {
  className?: string;
  onClickReply: () => void;
  likeCount: number;
  isLiked: boolean;
}

const CommentCardLikeReply: FC<CommentCardLikeReplyProps> = ({
  className = "",
  likeCount,
  isLiked: likedProps,
  onClickReply = () => {},
}) => {
  const [isLiked, setIsLiked] = useState(likedProps);

  const renderActionBtns = () => {
    return (
      <>
        <button
          className={`flex items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800 px-3 h-8 hover:bg-teal-50 hover:text-teal-600 dark:hover:text-teal-500 ${twFocusClass()} `}
          title="Reply"
          onClick={onClickReply}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[18px] w-[18px] mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span className="text-xs leading-none text-neutral-900 dark:text-neutral-200">
            Reply
          </span>
        </button>
      </>
    );
  };

  return (
    <div
      className={`nc-CommentCardLikeReply flex items-center space-x-2 ${className}`}
      data-nc-id="CommentCardLikeReply"
    >
      {renderActionBtns()}
    </div>
  );
};

export default CommentCardLikeReply;
