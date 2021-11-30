export interface JobWork {
  JobWorkId: string;
  JobId: string;
  Tittle: string;
  Category: string;
  Description: string;
  TotalCost: number;
  Quantity: number;
  Units: string;
  TotalHours: string;
  StartDate: string;
  DueDate: string;
  Status: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  ShowOption?: boolean;
  Class?: string;
  IsSelected?: boolean;
}