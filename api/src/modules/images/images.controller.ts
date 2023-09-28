import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Session,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
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
      images: session.images || [],
    };
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("image", {
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
    @UploadedFile() file: Express.Multer.File,
    @Session() session: SessionWithData,
    @Req() req: Request,
  ) {
    const image = {
      id: nanoid(),
      url: url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: `${config.STATIC_PATH}/${file.filename}`,
      }),
      size: file.size,
      label: "",
      date: Date.now(),
    };

    session.images = [...(session.images || []), image];

    return {
      image,
    };
  }

  @Delete(":id")
  removeImage(@Param("id") id: string, @Session() session: SessionWithData) {
    const image = session.images?.find((image) => image.id === id);

    if (!image) throw new NotFoundException("No image found");

    session.images = session.images?.filter((image) => image.id !== id);

    fs.unlink(
      `./uploads/${session.id}/${image.url.slice(image.url.lastIndexOf("/"))}`,
      (exception) => {
        if (exception) throw exception;
      },
    );

    return {
      image,
    };
  }

  @Put(":id/note")
  saveNote(
    @Param("id") id: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.SaveLabelDto,
  ) {
    const image = session.images?.find((image) => image.id === id);

    if (!image) throw new NotFoundException("No image found");

    session.images = session.images?.map((image) =>
      image.id === id ? {...image, label: dto.label} : image,
    );

    const updated = session.images.find((image) => image.id === id);

    return {
      image: updated,
    };
  }
}
