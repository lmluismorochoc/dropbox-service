import { FileEntity } from '../entities/file.entity';

export const FILE_STORAGE_REPOSITORY = 'FILE_STORAGE_REPOSITORY';

export interface IFileStorageRepository {
    upload(folder: string, fileName: string, base64Content: string): Promise<FileEntity>;
    listFiles(folderPath: string): Promise<FileEntity[]>;
    getFile(filePath: string): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
}
