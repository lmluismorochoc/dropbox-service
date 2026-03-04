import { IsNotEmpty, IsString } from 'class-validator';

export class ListFilesDto {
    @IsString()
    @IsNotEmpty()
    folder: string;
}
