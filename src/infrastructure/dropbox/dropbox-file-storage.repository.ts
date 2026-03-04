import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox, DropboxResponse, files } from 'dropbox';
import { FileEntity } from '../../domain/entities/file.entity';
import { IFileStorageRepository } from '../../domain/repositories/file-storage.repository.interface';
// node-fetch v2 (CommonJS) — compatible con el SDK de Dropbox para filesDownload
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeFetch = require('node-fetch');

@Injectable()
export class DropboxFileStorageRepository implements IFileStorageRepository {
    private readonly dbx: Dropbox;

    constructor(private readonly configService: ConfigService) {
        const accessToken = this.configService.get<string>('DROPBOX_ACCESS_TOKEN');
        if (!accessToken) {
            throw new Error('DROPBOX_ACCESS_TOKEN no está definido en las variables de entorno');
        }
        // Se usa node-fetch v2 porque el SDK de Dropbox usa .buffer() internamente
        // que solo existe en node-fetch, no en el fetch nativo de Node 20
        this.dbx = new Dropbox({
            accessToken,
            fetch: nodeFetch,
        });
    }

    async upload(folder: string, fileName: string, base64Content: string): Promise<FileEntity> {
        try {
            const buffer = Buffer.from(base64Content, 'base64');
            const filePath = `${folder}/${fileName}`;

            const response: DropboxResponse<files.FileMetadata> = await this.dbx.filesUpload({
                path: filePath,
                contents: buffer,
                mode: { '.tag': 'overwrite' },
                autorename: false,
                mute: false,
            });

            const meta = response.result;
            return new FileEntity(
                meta.path_lower ?? filePath,
                meta.name,
                meta.size,
                meta.client_modified,
                meta.server_modified,
            );
        } catch (error) {
            const summary: string = error?.error?.error_summary ?? error?.message ?? String(error);
            throw new InternalServerErrorException(`Error al subir el archivo a Dropbox: ${summary}`);
        }
    }

    async listFiles(folderPath: string): Promise<FileEntity[]> {
        try {
            const response: DropboxResponse<files.ListFolderResult> = await this.dbx.filesListFolder({
                path: folderPath,
                recursive: false,
                include_media_info: false,
                include_deleted: false,
            });

            const entries = response.result.entries.filter(
                (entry): entry is files.FileMetadataReference => entry['.tag'] === 'file',
            );

            return entries.map(
                (entry) =>
                    new FileEntity(
                        entry.path_lower ?? entry.path_display ?? '',
                        entry.name,
                        entry.size,
                        entry.client_modified,
                        entry.server_modified,
                    ),
            );
        } catch (error) {
            const summary: string = error?.error?.error_summary ?? error?.message ?? String(error);
            if (summary.includes('not_found')) {
                throw new NotFoundException(`La carpeta '${folderPath}' no existe en Dropbox`);
            }
            throw new InternalServerErrorException(`Error al listar archivos: ${summary}`);
        }
    }

    async getFile(filePath: string): Promise<string> {
        try {
            const response = await this.dbx.filesDownload({ path: filePath });
            // node-fetch v2 retorna fileBinary como Buffer
            const meta = response.result as files.FileMetadata & { fileBinary: Buffer };
            const fileBuffer = meta.fileBinary as unknown as Buffer;
            return fileBuffer.toString('base64');
        } catch (error) {
            const summary: string = error?.error?.error_summary ?? error?.message ?? String(error);
            if (summary.includes('not_found')) {
                throw new NotFoundException(`El archivo '${filePath}' no existe en Dropbox`);
            }
            throw new InternalServerErrorException(`Error al descargar el archivo: ${summary}`);
        }
    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            await this.dbx.filesDeleteV2({ path: filePath });
        } catch (error) {
            const summary: string = error?.error?.error_summary ?? error?.message ?? String(error);
            if (summary.includes('not_found')) {
                throw new NotFoundException(`El archivo '${filePath}' no existe en Dropbox`);
            }
            throw new InternalServerErrorException(`Error al eliminar el archivo: ${summary}`);
        }
    }
}
