import SectionMagazine1 from "components/Sections/SectionMagazine1";
import React, { FC, useState } from "react";

export interface LastestArticleProps {
  posts: any[];
  heading?: string;
  desc?: string;
}

const LastestArticle: FC<LastestArticleProps> = ({ posts, desc, heading }) => {
  const [post, setPost] = useState(posts[0]);
  const tabs = posts.map((_i) => _i.title);
  const handleSetPost = (val: string) => {
    const idx = posts.findIndex((item) => item.title === val);
    setPost(posts[idx]);
  };
  return (
    <div className="container">
      <SectionMagazine1
        className="py-16 lg:py-28"
        posts={post.items}
        heading={heading}
        desc={desc}
        tabs={tabs}
        onChangeTab={(val) => {
          handleSetPost(val);
        }}
      />
    </div>
  );
};

export default LastestArticle;
