import React, { ReactNode } from "react";
import SingleContent from "../SingleContent";
import SingleRelatedPosts from "../SingleRelatedPosts";
import { formatDataNews } from "app/(archives)/archive/helper";

const Layout = ({ children, post }: { children: ReactNode, post?: any, }) => {
  return (
    <div>
      {children}

      {/* SINGLE MAIN CONTENT */}
      <div className="container mt-10">
        <SingleContent post={post}/>
      </div>

      {/* RELATED POSTS */}
      {post?.author?.news?.data && post?.relatedNews?.data &&
      <SingleRelatedPosts moreFromAuthorPosts={formatDataNews(post?.author?.news?.data)} relatedPosts={formatDataNews(post?.relatedNews?.data)}/>}
    </div>
  );
};

export default Layout;
