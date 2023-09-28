import {UploadedImage} from "../types";

export const groupImagesByMonth = (images: UploadedImage[]) =>
  Object.entries(
    Object.fromEntries(
      [...images]
        .sort((a, b) => b.date - a.date)
        .reduce((grouped: Map<string, UploadedImage[]>, image) => {
          const date = new Date(image.date);

          const year = date.getFullYear().toString().slice(-2);
          const month = date.toLocaleString("default", {
            month: "long",
          });

          const key = `${month} '${year}`;

          if (!grouped.has(key)) grouped.set(key, []);

          grouped.set(key, [...grouped.get(key)!, image]);

          return grouped;
        }, new Map()),
    ),
  );
