import React, { FC } from "react";
import Card2 from "components/Card2/Card2";
import { PostDataType } from "data/types";
import Card6 from "components/Card6/Card6";
import HeaderFilter from "./HeaderFilter";

export interface SectionMagazine1Props {
  posts: PostDataType[];
  heading?: string;
  desc?: string;
  className?: string;
  tabs?: string[];
  onChangeTab?: (item: string) => void;
}

const SectionMagazine1: FC<SectionMagazine1Props> = ({
  posts,
  heading = "Latest Articles 🎈 ",
  className = "",
  tabs,
  desc,
  onChangeTab
}) => {
  return (
    <div className={`nc-SectionMagazine1 ${className}`}>
      <HeaderFilter desc={desc} heading={heading} tabs={tabs} onChangeTab={onChangeTab}/>
      {!posts.length && <span>Nothing we found!</span>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {posts[0] && <Card2 size="large" post={posts[0]} />}
        <div className="grid gap-6 md:gap-8">
          {posts
            .filter((_, i) => i < 4 && i > 0)
            .map((item, index) => (
              <Card6 key={index} post={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SectionMagazine1;
