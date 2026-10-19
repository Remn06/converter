export type Language = 'en' | 'uk';

export interface Pack {
  id: string;
  name: string;
  totalThickness: number;
  sheetArea: number;
  sheetLength?: number;
  sheetHeight?: number;
}

export interface Bucket {
  id: string;
  name: string;
  kg: number;
  coverageArea: number;
}

export interface Translations {
  styrofoamTab: string;
  paintTab: string;
  titleStyrofoam: string;
  titlePaint: string;
  selectConverter: string;
  selectBucket: string;
  singleSheetThickness: string;
  totalArea: string;
  orExactSheets: string;
  enterThickness: string;
  sheetsPerPack: string;
  toCoverArea: (area: number | string) => string;
  toCoverAreaTotal: (area: number | string, sheets: number) => string;
  totalSheets: string;
  enterThicknessHint: string;
  youNeedExactly: string;
  resultPacksAndSheets: (packs: number, sheets: number) => string;
  resultPacks: (packs: number) => string;
  resultSheets: (sheets: number) => string;
  addCustomPack: string;
  editCustomPack: string;
  profileNameHolder: string;
  packThicknessHolder: string;
  sheetLengthHolder: string;
  sheetWidthHolder: string;
  savePackBtn: string;
  updatePackBtn: string;
  defaultStyrofoamName: string;

  enterAreaToCalc: string;
  toCoverBuy: (area: number | string) => string;
  bucketsCount: (count: number) => string;
  totalWeight: (kg: number) => string;
  addCustomBucket: string;
  editCustomBucket: string;
  paintNameHolder: string;
  bucketWeightHolder: string;
  coverageHolder: string;
  saveBucketBtn: string;
  updateBucketBtn: string;
  cancelEditBtn: string;
  defaultPaintName: string;
  langToggle: string;
  eg5: string;
  eg100: string;
  eg30: string;
  eg150: string;
}
