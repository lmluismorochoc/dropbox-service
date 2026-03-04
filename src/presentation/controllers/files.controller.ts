import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UploadFileDto } from '../../application/dtos/upload-file.dto';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';
import { ListFilesUseCase } from '../../application/use-cases/list-files.use-case';
import { GetFileUseCase } from '../../application/use-cases/get-file.use-case';
import { DeleteFileUseCase } from '../../application/use-cases/delete-file.use-case';
import { FileEntity } from '../../domain/entities/file.entity';

@Controller('files')
export class FilesController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
        private readonly listFilesUseCase: ListFilesUseCase,
        private readonly getFileUseCase: GetFileUseCase,
        private readonly deleteFileUseCase: DeleteFileUseCase,
    ) { }

    /**
     * POST /files/upload
     * Sube un archivo en base64 a la carpeta indicada en Dropbox.
     */
    @Post('upload')
    @HttpCode(HttpStatus.CREATED)
    async upload(@Body() dto: UploadFileDto): Promise<{ message: string; file: FileEntity }> {
        const file = await this.uploadFileUseCase.execute(dto);
        return {
            message: 'Archivo subido exitosamente',
            file,
        };
    }

    /**
     * GET /files/list?folder=/ruta
     * Lista los archivos de una carpeta en Dropbox.
     */
    @Get('list')
    async list(@Query('folder') folder: string): Promise<{ total: number; files: FileEntity[] }> {
        const files = await this.listFilesUseCase.execute(folder ?? '');
        return {
            total: files.length,
            files,
        };
    }

    /**
     * GET /files/download?path=/ruta/archivo.ext
     * Descarga un archivo de Dropbox y lo retorna en base64.
     */
    @Get('download')
    async download(
        @Query('path') path: string,
    ): Promise<{ path: string; base64Content: string }> {
        const base64Content = await this.getFileUseCase.execute(path);
        return {
            path,
            base64Content,
        };
    }

    /**
     * DELETE /files?path=/ruta/archivo.ext
     * Elimina un archivo de Dropbox.
     */
    @Delete()
    @HttpCode(HttpStatus.OK)
    async delete(@Query('path') path: string): Promise<{ message: string }> {
        await this.deleteFileUseCase.execute(path);
        return {
            message: `Archivo '${path}' eliminado exitosamente`,
        };
    }
}
