import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_REPOSITORY } from '../../domain/repositories/file-storage.repository.interface';
import type { IFileStorageRepository } from '../../domain/repositories/file-storage.repository.interface';

@Injectable()
export class DeleteFileUseCase {
    constructor(
        @Inject(FILE_STORAGE_REPOSITORY)
        private readonly fileStorageRepository: IFileStorageRepository,
    ) { }

    async execute(filePath: string): Promise<void> {
        const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
        return this.fileStorageRepository.deleteFile(normalizedPath);
    }
}
