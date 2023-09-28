import {IsString} from "class-validator";

export class SaveLabelDto {
  @IsString()
  label: string;
}
