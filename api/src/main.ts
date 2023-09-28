import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import express, {RequestHandler} from "express";
import path from "path";

import {session} from "@lib/session";
import {config} from "@lib/config";

import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // @todo: origin to .env
    cors: {credentials: true, origin: "http://localhost:5173"},
  });

  app.use(session());

  app.use(
    config.STATIC_PATH,
    ((req, res, next) => {
      const sessionId = req.url.slice(1, req.url.indexOf("/", 1));

      if (sessionId !== req.session.id) return res.status(403).json();

      next();
    }) as RequestHandler,
    express.static(path.join(__dirname, "../uploads")),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8000);
}

bootstrap();

