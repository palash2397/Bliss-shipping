export class CsvImportResponseDto {
  importedCount: number;
  failedRows: {
    rowNumber: number;
    error: string;
  }[];
}
