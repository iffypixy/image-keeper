import {request} from "@shared/lib/request";
import {AxiosRequestConfig} from "axios";

import {Image} from "entities/images";

interface GetImagesResponse {
  images: Image[];
}

export const getImages = () => request.get<GetImagesResponse>("/images");

interface UploadImageParams {
  image: File;
}

interface UploadImageResponse {
  image: Image;
}

export const uploadImage = (
  params: UploadImageParams,
  config: AxiosRequestConfig<UploadImageResponse> = {},
) => {
  const formData = new FormData();

  formData.append("image", params.image);

  return request.post<UploadImageResponse>("/images/upload", formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

interface RemoveImageParams {
  id: string;
}

interface RemoveImageResponse {
  image: Image;
}

export const removeImage = (params: RemoveImageParams) =>
  request.delete<RemoveImageResponse>(`/images/${params.id}`);

interface SaveImageLabelParams {
  id: string;
  label: string;
}

interface SaveImageLabelResponse {
  image: Image;
}

export const saveImageLabel = (params: SaveImageLabelParams) =>
  request.put<SaveImageLabelResponse>(`/images/${params.id}/note`, {
    label: params.label,
  });
