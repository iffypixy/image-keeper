import React from "react";
import {useQuery} from "react-query";
import {nanoid} from "nanoid";

import * as api from "@shared/api";
import {Container, Logo, Skeleton, Text, UploadButton} from "@shared/ui";
import {
  Image,
  UploadedImage,
  ImageCard,
  groupImagesByMonth,
} from "entities/images";
import {Nullable} from "@shared/lib/types";
import {ImageEditor} from "features/edit-image";
import {DNDDropzone} from "features/dnd-images";

export const App: React.FC = () => {
  const [images, setImages] = React.useState<UploadedImage[]>([]);
  const [editingImage, setEditingImage] = React.useState<Nullable<Image>>(null);

  const {isLoading} = useQuery(["images"], api.getImages, {
    staleTime: Infinity,
    select: (res) => res.data,
    onSuccess: (res) => {
      setImages(res.images.map((image) => ({...image, progress: 100})));
    },
  });

  const handleImageDelete = (image: UploadedImage) => {
    api.removeImage({id: image.id}).then(() => {
      setImages((images) => images.filter((img) => img.id !== image.id));
    });
  };

  const uploadImages = (list: FileList | File[]) => {
    const files = Array.from(list);

    files.forEach((file) => {
      const image: UploadedImage = {
        id: nanoid(),
        url: URL.createObjectURL(file),
        size: file.size,
        date: Date.now(),
        label: "",
        progress: 0,
      };

      setImages((images) => [image, ...images]);

      api
        .uploadImage(
          {image: file},
          {
            onUploadProgress: (event) => {
              const progress = Math.round((event.loaded * 100) / event.total!);

              setImages((images) =>
                images.map((img) =>
                  img.id === image.id ? {...image, progress} : img,
                ),
              );
            },
          },
        )
        .then((res) => {
          setImages((images) =>
            images.map((img) =>
              img.id === image.id
                ? {...res.data.image, url: img.url, progress: 100}
                : img,
            ),
          );
        });
    });
  };

  const dropzone = (
    <DNDDropzone
      onDrop={(event) => {
        uploadImages(
          Array.from(event.dataTransfer!.files).filter((file) =>
            file.type.startsWith("image"),
          ),
        );
      }}
    />
  );

  const noImages = images.length === 0;

  if (noImages)
    return (
      <>
        {dropzone}

        <NoImagesScreen
          onInputChange={({currentTarget}) =>
            uploadImages(currentTarget.files!)
          }
        />
      </>
    );

  const grouped = groupImagesByMonth(images);

  return (
    <>
      {editingImage && (
        <ImageEditor
          open={!!editingImage}
          onClose={() => setEditingImage(null)}
          image={editingImage!}
          onSave={(label) => {
            api.saveImageLabel({id: editingImage.id, label});

            setImages(
              images.map((img) =>
                img.id === editingImage?.id ? {...img, label} : img,
              ),
            );
          }}
        />
      )}

      {dropzone}

      <div>
        <header className="w-full pt-10 pb-6 border-b border-[#EEEEEE]">
          <Container>
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-3">
                <Logo />

                {isLoading ? (
                  <Skeleton width="100%" height="1rem" />
                ) : (
                  <Text color="secondary">
                    {images?.length} images stored in keeper
                  </Text>
                )}
              </div>

              <UploadButton
                multiple
                disabled={isLoading}
                onChange={({currentTarget}) =>
                  uploadImages(currentTarget.files!)
                }
              >
                Upload image
              </UploadButton>
            </div>
          </Container>
        </header>

        <main className="py-10">
          <Container>
            <div className="py-6">
              <div className="flex flex-col space-y-14">
                {isLoading ? (
                  <>
                    <Skeleton width="15rem" height="2rem" />

                    <div className="flex space-x-2">
                      <Skeleton width="22rem" height="15rem" />
                      <Skeleton width="22rem" height="15rem" />
                      <Skeleton width="10rem" height="15rem" />
                      <Skeleton width="22rem" height="15rem" />
                      <Skeleton width="10rem" height="15rem" />
                    </div>
                  </>
                ) : (
                  grouped.map(([key, images]) => (
                    <div className="-m-3 space-y-6" key={key}>
                      <div className="flex space-x-4 items-center">
                        <h3 className="text-[#EEEEEE] font-bold text-4xl ml-3">
                          {key}
                        </h3>

                        <span className="bg-[#A9E5BB] text-[#FFFFFF] text-xl font-semibold rounded-md px-2 py-1">
                          {images.length}
                        </span>
                      </div>

                      <div className="flex flex-wrap">
                        {images.map((image) => (
                          <ImageCard
                            key={image.id}
                            image={image}
                            onDelete={() => handleImageDelete(image)}
                            onEdit={() => setEditingImage(image)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
};

interface NoImagesScreenProps {
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
}

const NoImagesScreen: React.FC<NoImagesScreenProps> = ({onInputChange}) => (
  <div className="w-screen h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-14">
      <Logo />

      <div className="max-w-[25rem] w-full text-center space-y-4">
        <h1 className="text-[#393E46] font-bold text-3xl">
          No images uploaded yet
        </h1>

        <div>
          <Text color="secondary">
            Upload your first image by drag and dropping the file on the screen
            or click the button below
          </Text>
        </div>

        <UploadButton onChange={onInputChange}>Upload image</UploadButton>
      </div>
    </div>
  </div>
);

