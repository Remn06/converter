export type Language = 'en' | 'uk';

export type UserRole = 'none' | 'client' | 'employee';

export type OrderStatus = 'pending' | 'in_progress' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  itemsEn: string;
  itemsUk: string;
  status: OrderStatus;
  createdAt: string;
}

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

  // Auth & Role Selection
  welcomeTitle: string;
  welcomeSubtitle: string;
  iAmClient: string;
  iAmClientDesc: string;
  iAmEmployee: string;
  iAmEmployeeDesc: string;
  employeeLoginTitle: string;
  employeeLoginSubtitle: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginBtn: string;
  backBtn: string;
  loginError: string;
  loginHint: string;
  switchRoleBtn: string;
  logoutBtn: string;

  // Employee & Active Orders
  activeOrdersTab: string;
  converterTab: string;
  activeOrdersTitle: string;
  filterActive: string;
  filterCompleted: string;
  filterAll: string;
  statusPending: string;
  statusInProgress: string;
  statusCompleted: string;
  startOrderBtn: string;
  completeOrderBtn: string;
  reopenOrderBtn: string;
  noActiveOrders: string;
  orderItemsLabel: string;
  orderClientLabel: string;
  resetOrdersBtn: string;

  // Client Make an Order
  makeOrderTab: string;
  makeOrderTitle: string;
  clientNameLabel: string;
  clientNamePlaceholder: string;
  clientPhoneLabel: string;
  clientPhonePlaceholder: string;
  orderDetailsLabel: string;
  orderDetailsPlaceholder: string;
  submitOrderBtn: string;
  orderSuccessMsg: string;
  orderFormError: string;
  addToOrderBtn: string;
  addedToOrderFeedback: string;
}
