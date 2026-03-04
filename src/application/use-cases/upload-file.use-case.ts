import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_REPOSITORY } from '../../domain/repositories/file-storage.repository.interface';
import type { IFileStorageRepository } from '../../domain/repositories/file-storage.repository.interface';
import { FileEntity } from '../../domain/entities/file.entity';
import { UploadFileDto } from '../dtos/upload-file.dto';

@Injectable()
export class UploadFileUseCase {
    constructor(
        @Inject(FILE_STORAGE_REPOSITORY)
        private readonly fileStorageRepository: IFileStorageRepository,
    ) { }

    async execute(dto: UploadFileDto): Promise<FileEntity> {
        const folder = dto.folder.startsWith('/') ? dto.folder : `/${dto.folder}`;
        return this.fileStorageRepository.upload(folder, dto.fileName, dto.base64Content);
    }
}
