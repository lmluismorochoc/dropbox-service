import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UploadFileDto {
    @IsString()
    @IsNotEmpty()
    folder: string;

    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Za-z0-9+/=]+$/, {
        message: 'base64Content debe ser una cadena base64 válida',
    })
    base64Content: string;
}
