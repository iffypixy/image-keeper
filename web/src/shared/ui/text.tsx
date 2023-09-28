import {cva, cx, VariantProps} from "class-variance-authority";

const styles = cva("text-base", {
  variants: {
    color: {
      primary: "text-[#2D1E2F]",
      secondary: "text-[#929AAB]",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

type TextProps = React.ComponentProps<"span"> & VariantProps<typeof styles>;

export const Text: React.FC<TextProps> = ({
  className,
  children,
  color,
  ...props
}) => (
  <span {...props} className={cx(styles({color}), className)}>
    {children}
  </span>
);
