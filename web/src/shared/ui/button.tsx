import {twMerge} from "tailwind-merge";
import {cva, cx, VariantProps} from "class-variance-authority";

import {Icon} from "./icons";

const styles = cva(
  "inline-flex items-center text-base bg-[#EEEEEE] rounded-lg py-3 px-4 [&_svg]:w-[1.5em] [&_svg]:h-[1.5em]",
  {
    variants: {
      disabled: {
        true: "text-[#929AAB] cursor-not-allowed [&_svg]:fill-[#929AAB]",
        false: "text-[#3D293F] [&_svg]:fill-[#3D293F]",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "disabled">,
    VariantProps<typeof styles> {
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  disabled,
  icon,
  ...props
}) => (
  <button
    {...props}
    disabled={!!disabled}
    className={twMerge(cx(styles({disabled}), className))}
  >
    {icon && <span className="mr-[0.75em]">{icon}</span>}

    {children}
  </button>
);

type UploadButtonProps = React.ComponentProps<"input"> &
  VariantProps<typeof styles>;

export const UploadButton: React.FC<UploadButtonProps> = ({
  className,
  children,
  disabled,
  ...props
}) => (
  <div className={cx("inline-block relative overflow-hidden", className)}>
    <Button
      icon={<Icon.Upload />}
      disabled={disabled}
      onClick={({currentTarget}) => (currentTarget.value = "")}
    >
      {children}
    </Button>

    <input
      {...props}
      type="file"
      accept="image/*"
      disabled={!!disabled}
      className={cx("absolute right-0 top-0 min-w-full min-h-full opacity-0", {
        "cursor-pointer": !disabled,
        "cursor-not-allowed": disabled,
      })}
    />
  </div>
);
