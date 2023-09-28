import {createPortal} from "react-dom";

interface ModalProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({children, open, onClose}) =>
  open &&
  createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        role="presentation"
        className="fixed inset-0 -z-10 bg-[rgba(255, 255, 255, 0.4)] backdrop-blur-lg"
      />

      {children}
    </div>,
    document.body,
  );
