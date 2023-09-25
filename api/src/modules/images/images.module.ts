import {Module} from "@nestjs/common";

import {ImagesController} from "./images.controller";

@Module({
  imports: [],
  controllers: [ImagesController],
})
export class ImagesModule {}
