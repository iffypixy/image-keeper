import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  Req,
  Session,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {FilesInterceptor} from "@nestjs/platform-express";
import {SessionWithData} from "express-session";
import {extname} from "node:path";
import fs from "node:fs";
import url from "node:url";
import {Request} from "express";
import {diskStorage} from "multer";
import {nanoid} from "nanoid";

import {config} from "@lib/config";

import * as dtos from "./dtos";

@Controller("images")
export class ImagesController {
  @Get("/")
  async getImages(@Session() session: SessionWithData) {
    return {
      images: session.images,
    };
  }

  @Post("upload")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      fileFilter(_, file, cb) {
        if (!file.mimetype.startsWith("image"))
          return cb(new Error("Only images are allowed"), false);

        cb(null, true);
      },
      storage: diskStorage({
        destination: "./uploads",
        filename(req, file, cb) {
          const dir = `./uploads/${req.session.id}`;

          const exists = fs.existsSync(dir);

          if (!exists) fs.mkdirSync(dir, {recursive: true});

          return cb(
            null,
            `${req.session.id}/${nanoid()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Session() session: SessionWithData,
    @Req() req: Request,
  ) {
    const uploaded = files.map((file) => ({
      id: nanoid(),
      url: url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: `${config.STATIC_PATH}/${file.filename}`,
      }),
      size: file.size,
      note: "",
    }));

    session.images = [...(session.images || []), ...uploaded];

    return {
      uploaded,
    };
  }

  @Delete(":id/remove")
  removeImage(@Query("id") id: string, @Session() session: SessionWithData) {
    const image = session.images?.find((image) => image.id === id);

    if (!image) throw new NotFoundException("No image found");

    session.images = session.images?.filter((image) => image.id !== id);

    return {
      image,
    };
  }

  @Put(":id/note")
  saveNote(
    @Query("id") id: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.SaveNoteDto,
  ) {
    const image = session.images?.find((image) => image.id === id);

    if (!image) throw new NotFoundException("No image found");

    session.images = session.images?.filter((image) =>
      image.id === id ? {...image, note: dto.note} : image,
    );

    const updated = session.images.find((image) => image.id === id);

    return {
      image: updated,
    };
  }
}
