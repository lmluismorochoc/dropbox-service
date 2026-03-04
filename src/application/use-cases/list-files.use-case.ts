import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_REPOSITORY } from '../../domain/repositories/file-storage.repository.interface';
import type { IFileStorageRepository } from '../../domain/repositories/file-storage.repository.interface';
import { FileEntity } from '../../domain/entities/file.entity';

@Injectable()
export class ListFilesUseCase {
    constructor(
        @Inject(FILE_STORAGE_REPOSITORY)
        private readonly fileStorageRepository: IFileStorageRepository,
    ) { }

    async execute(folderPath: string): Promise<FileEntity[]> {
        const folder = folderPath.startsWith('/') ? folderPath : `/${folderPath}`;
        // Dropbox requiere string vacío para listar la raíz
        const normalizedPath = folder === '/' ? '' : folder;
        return this.fileStorageRepository.listFiles(normalizedPath);
    }
}
