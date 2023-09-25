import s from "express-session";

const month = 2629800000;

// @todo: connect the store to redis
export const session = () =>
  s({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: month,
      httpOnly: true,
    },
  });
