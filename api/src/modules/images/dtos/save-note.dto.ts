import {IsString} from "class-validator";

export class SaveNoteDto {
  @IsString()
  note: string;
}
