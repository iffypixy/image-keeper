import React from "react";
import {cx} from "class-variance-authority";

interface SkeletonProps extends React.ComponentProps<"div"> {
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  children,
  className,
  width,
  height,
  ...props
}) => (
  <div
    {...props}
    style={{width, height}}
    className={cx("bg-[#F7F7F7] rounded-lg", className)}
  >
    {children}
  </div>
);
