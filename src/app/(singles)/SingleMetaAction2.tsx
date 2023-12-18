import React, { FC, useContext } from "react";
import PostCardLikeAndComment from "components/PostCardLikeAndComment/PostCardLikeAndComment";
import NcBookmark from "components/NcBookmark/NcBookmark";
import { AdminContext } from "context/adminContext";
import api from "app/api";

export interface SingleMetaAction2Props {
  className?: string;
  post?: any;
  onSetState?: React.Dispatch<React.SetStateAction<any>>
}

const SingleMetaAction2: FC<SingleMetaAction2Props> = ({
  className = "",
  post,
  onSetState,
}) => {
  const { user } = useContext(AdminContext);
  return (
    <div className={`nc-SingleMetaAction2 ${className}`}>
      <div className="flex flex-row space-x-2.5 items-center">
        <PostCardLikeAndComment
          itemClass="px-4 h-9 text-sm"
          hiddenCommentOnMobile
          useOnSinglePage
          className="!space-x-2.5"
          handleLike={
            user
              ? () => {
                  if (!post.isLiked) {
                    api
                      .post(
                        "likes/like",
                        {
                          data: {
                            new: {
                              id: post.id
                            },
                          },
                        },
                        user.jwt
                      )
                      .then((res) => {
                        onSetState && onSetState({...post, isLiked: true})
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  } else {
                    api
                      .post(
                        "likes/unlike",
                        {
                          data: {
                            new: {
                              id: post.id,
                            },
                          },
                        },
                        user.jwt
                      )
                      .then((res) => {
                        onSetState && onSetState({...post, isLiked: false })
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  }
                }
              : () => {}
          }
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
