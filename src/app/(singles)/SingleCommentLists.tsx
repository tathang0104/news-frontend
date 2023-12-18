import React, { FC } from "react";
import CommentCard, { CommentType,  } from "../../components/CommentCard/CommentCard";
import { CommentContent } from "./SingleContent";

export interface SingleCommentListsProps {
  comments?: CommentType[];
  onSendReplyComment?: (e: React.FormEvent<HTMLFormElement>, threadOf: number | null | undefined) => void;
  replyCommentContent?: CommentContent;
  onChangeReply?: (key: string, value: string) => void;
}

const SingleCommentLists: FC<SingleCommentListsProps> = ({
  comments, 
  onSendReplyComment,
  replyCommentContent,
  onChangeReply,
}) => {

  const renderCommentCard = () => {
    return comments && comments.length > 0 ? (
      comments.map((comment) => (
        <CommentCard
          commentReplyId={comment.id}
          key={comment.id}
          comment={comment}
          onSendReplyComment={onSendReplyComment}
          replyCommentContent={replyCommentContent}
          onChangeReply={onChangeReply}
        />
        ))
    ) : (
      <div className="">
        No comments
      </div>
    )
  }
  return (
    <ul className="nc-SingleCommentLists space-y-5">
      {renderCommentCard()}
    </ul>
  );
};

export default SingleCommentLists;
