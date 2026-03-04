import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from '../controllers/files.controller';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';
import { ListFilesUseCase } from '../../application/use-cases/list-files.use-case';
import { GetFileUseCase } from '../../application/use-cases/get-file.use-case';
import { DeleteFileUseCase } from '../../application/use-cases/delete-file.use-case';
import { DropboxFileStorageRepository } from '../../infrastructure/dropbox/dropbox-file-storage.repository';
import { FILE_STORAGE_REPOSITORY } from '../../domain/repositories/file-storage.repository.interface';

@Module({
    imports: [ConfigModule],
    controllers: [FilesController],
    providers: [
        // Adaptador — registrado con el token de la interfaz (inversión de dependencias)
        {
            provide: FILE_STORAGE_REPOSITORY,
            useClass: DropboxFileStorageRepository,
        },
        // Use Cases
        UploadFileUseCase,
        ListFilesUseCase,
        GetFileUseCase,
        DeleteFileUseCase,
    ],
})
export class FilesModule { }
