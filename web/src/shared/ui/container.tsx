interface ContainerProps {
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({children}) => (
  <div className="w-full max-w-[1440px] mx-auto px-[2rem] 2xl:px-0">
    {children}
  </div>
);
