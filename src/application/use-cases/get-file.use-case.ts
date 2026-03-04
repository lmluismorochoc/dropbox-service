import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_REPOSITORY } from '../../domain/repositories/file-storage.repository.interface';
import type { IFileStorageRepository } from '../../domain/repositories/file-storage.repository.interface';

@Injectable()
export class GetFileUseCase {
    constructor(
        @Inject(FILE_STORAGE_REPOSITORY)
        private readonly fileStorageRepository: IFileStorageRepository,
    ) { }

    async execute(filePath: string): Promise<string> {
        const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
        return this.fileStorageRepository.getFile(normalizedPath);
    }
}
