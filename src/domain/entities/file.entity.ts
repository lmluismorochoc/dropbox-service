export class FileEntity {
  constructor(
    public readonly path: string,
    public readonly name: string,
    public readonly size: number,
    public readonly clientModified: string,
    public readonly serverModified: string,
  ) {}
}
