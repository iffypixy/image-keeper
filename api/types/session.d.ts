import "express-session";

import {Maybe} from "@lib/types";

declare module "express-session" {
  interface SessionData {
    images: Maybe<
      {
        id: string;
        url: string;
        note: string;
        size: number;
      }[]
    >;
  }

  export type SessionWithData = Session & SessionData;
}
