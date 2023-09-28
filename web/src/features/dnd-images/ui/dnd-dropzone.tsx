import React from "react";

import {Modal} from "@shared/lib/modal";
import {Nullable} from "@shared/lib/types";
import {Text, Icon} from "@shared/ui";

interface ImageUploaderModalProps {
  onDrop: (event: DragEvent) => void;
}

export const DNDDropzone: React.FC<ImageUploaderModalProps> = (props) => {
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    let targeted: Nullable<EventTarget> = null;

    const onDragEnter = (event: DragEvent) => {
      targeted = event.target;

      setIsDragging(true);
    };

    const onDragLeave = (event: DragEvent) => {
      if (targeted === event.target) setIsDragging(false);
    };

    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();

      setIsDragging(false);

      props.onDrop(event);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  return (
    <Modal open={isDragging}>
      <div className="flex flex-col space-y-4 items-center text-center">
        <Icon.Upload className="fill-[#A9E5BB] w-24 h-24" />

        <h2 className="text-3xl font-bold text-[#393E46]">Upload file</h2>

        <Text color="secondary">Drag your file here to start uploading</Text>
      </div>
    </Modal>
  );
};
