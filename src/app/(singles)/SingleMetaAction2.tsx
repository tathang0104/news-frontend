import React, { FC } from "react";
import PostActionDropdown from "components/PostActionDropdown/PostActionDropdown";
import PostCardLikeAndComment from "components/PostCardLikeAndComment/PostCardLikeAndComment";
import { SOCIALS_DATA } from "components/SocialsShare/SocialsShare";
import NcDropDown from "components/NcDropDown/NcDropDown";
import NcBookmark from "components/NcBookmark/NcBookmark";

export interface SingleMetaAction2Props {
  className?: string;
}

const SingleMetaAction2: FC<SingleMetaAction2Props> = ({ className = "" }) => {
  return (
    <div className={`nc-SingleMetaAction2 ${className}`}>
      <div className="flex flex-row space-x-2.5 items-center">
        <PostCardLikeAndComment
          itemClass="px-4 h-9 text-sm"
          hiddenCommentOnMobile
          useOnSinglePage
          className="!space-x-2.5"
        />
        <div className="px-1">
          <div className="border-l border-neutral-200 dark:border-neutral-700 h-6" />
        </div>

        <NcBookmark containerClassName="h-9 w-9 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200" />
        
      </div>
    </div>
  );
};

export default SingleMetaAction2;
