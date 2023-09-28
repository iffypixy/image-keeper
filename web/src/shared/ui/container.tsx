interface ContainerProps {
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({children}) => (
  <div className="container mx-auto">{children}</div>
);
