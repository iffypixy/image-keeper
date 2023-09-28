import React from "react";
import {cx} from "class-variance-authority";

import {Image} from "entities/images";
import {Button, Icon} from "@shared/ui";
import {Modal} from "@shared/lib/modal";

interface ImageEditorProps extends React.ComponentProps<typeof Modal> {
  image: Image;
  onSave: (label: Image["label"]) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  onSave,
  ...props
}) => {
  const [label, setLabel] = React.useState(image?.label || "");

  const isError = label.length > 100;

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    onSave(label);
    props.onClose && props.onClose();
  };

  return (
    <Modal {...props}>
      <div className="fixed top-10 right-10">
        <Button onClick={props.onClose} icon={<Icon.Cross />}>
          Close editor
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-8 items-center text-center">
          <h2 className="text-4xl font-bold text-[#393E46]">
            Set custom label
          </h2>

          <div className="flex flex-col space-y-4">
            <img
              className="max-w-[20rem] max-h-[20rem] rounded-lg"
              src={image.url}
              alt={`#${image.id}`}
            />

            <input
              onChange={({currentTarget}) => setLabel(currentTarget.value)}
              value={label}
              className="outline-none bg-transparent text-center text-[#3D293F] font-medium text-xl placeholder:text-[#929AAB]"
              placeholder="Enter custom label"
            />

            <span
              className={cx("text-[#929AAB]", {
                "text-[#ff3333]": isError,
              })}
            >
              {"100 chars max"}
            </span>
          </div>

          <Button icon={<Icon.Check />} disabled={isError} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
