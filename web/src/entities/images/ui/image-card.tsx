import pbytes from "pretty-bytes";

import {Button, Icon} from "@shared/ui";

import {UploadedImage} from "../types";

interface ImageCardProps {
  image: UploadedImage;
  onEdit: () => void;
  onDelete: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onDelete,
  onEdit,
}) => {
  const date = new Date(image.date);

  const day = date.getDay() + 1;
  const month = date.toLocaleString("default", {
    month: "long",
  });

  const bytesUploaded = (image.size * image.progress) / 100;

  const isUploading = image.progress !== 100;

  return (
    <div key={image.id} className="relative group m-3">
      <div className="bg-[#EFEFEF] min-w-[12rem] rounded-md">
        <img
          className="h-[12rem] rounded-xl m-auto"
          src={image.url}
          alt={`#${image.id}`}
        />
      </div>

      <div className="max-w-[7rem] absolute -top-3 right-4 bg-[#FCF6B1] rounded-md z-10 break-words p-1">
        <span className="text-sm">{image.label || `${day} ${month}`}</span>
      </div>

      {isUploading ? (
        <>
          <div className="flex flex-col text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-[1em] text-[#393E46] font-bold">
              Uploading
            </span>

            <span className="text-[0.75em text-[#929AAB]">
              {pbytes(bytesUploaded)} of {pbytes(image.size)}
            </span>
          </div>

          <div
            style={{
              width: `${image.progress}%`,
            }}
            className="absolute left-0 top-0 bg-[#FFFFFF] h-full opacity-60"
          />
        </>
      ) : (
        <>
          <div className="absolute left-5 bottom-5 flex flex-col space-y-1 z-10 group-hover:opacity-100 opacity-0">
            <a href={image.url} target="_blank" rel="noreferrer">
              <Button
                icon={<Icon.Download />}
                className="text-[#FFFFFF] text-[0.75em] bg-transparent p-0"
              >
                Download
              </Button>
            </a>

            <Button
              icon={<Icon.Edit />}
              onClick={onEdit}
              className="text-[#FFFFFF] text-[0.75em] bg-transparent p-0"
            >
              Edit label
            </Button>

            <Button
              icon={<Icon.Delete />}
              onClick={onDelete}
              className="text-[#FFFFFF] text-[0.75em] bg-transparent p-0"
            >
              Delete
            </Button>
          </div>

          <div className="absolute left-0 top-0 w-full h-full bg-[#000000] opacity-0 rounded-xl group-hover:opacity-50" />
        </>
      )}
    </div>
  );
};
