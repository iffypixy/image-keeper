import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";

import {ImagesModule} from "@modules/images";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImagesModule,
  ],
})
export class AppModule {}

