import React, { FC, useContext } from "react";
import ButtonPrimary from "components/Button/ButtonPrimary";
import Textarea from "components/Textarea/Textarea";
import Button from "components/Button/Button";
import { CommentContent } from "./SingleContent";
import Input from "components/Input/Input";
import { AdminContext } from "context/adminContext";

export interface SingleCommentFormProps {
  threadOf?: number | null;
  className?: string;
  onClickSubmit: (e: React.FormEvent<HTMLFormElement>, threadOf: number | null | undefined) => void;
  onClickCancel: () => void;
  textareaRef?: React.MutableRefObject<null>;
  defaultValue?: string;
  rows?: number;
  onChange?: (key: string, value: string) => void;
  value?: CommentContent;
}

const SingleCommentForm: FC<SingleCommentFormProps> = ({
  threadOf,
  className = "mt-5",
  onClickSubmit,
  onClickCancel,
  textareaRef,
  rows = 4,
  onChange,
  value,
}) => {
  const {user} = useContext(AdminContext)

  return (
    <form 
      onSubmit={(e) => onClickSubmit(e, threadOf)} 
      className={`nc-SingleCommentForm ${className}`}
    >
      {!user?.jwt && (
        <div className="flex">
            <div className="w-1/2">
              <Input
                required
                type="username"
                placeholder="Username"
                className="mt-2 w-1/2"
                name="username"
                rounded="rounded-xl"
                value={value?.username}
                onChange={(e) => onChange?.('username', e.target.value)}
                />
            </div>
          <div className="w-1/2 ml-2">
            <Input
              required
              type="email"
              placeholder="Example@example.com"
              className="mt-2 w-1/2"
              name="email"
              rounded="rounded-xl"
              value={value?.email}
              onChange={(e) => onChange?.('email', e.target.value)}
            />
          </div>
        </div>
      )}
      <Textarea
        placeholder="Add to discussion"
        className="mt-2"
        ref={textareaRef}
        required={true}
        rows={rows}
        value={value?.content}
        onChange={(e) => onChange?.('content', e.target.value)}
      />
      <div className="mt-2 space-x-3">
        <ButtonPrimary
          type="submit"
        >
          Submit
        </ButtonPrimary>
        <Button
          type="button"
          pattern="white" 
          onClick={onClickCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SingleCommentForm;
