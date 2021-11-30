export interface CompanyCategory {
  Id: number;
  CompanyId: string;
  CategoryId: string;
  Name: string;
  Description: string;
  CategoryType: string;
  ParentId: number;
  ImageUrl: string;
  IsDeleted: boolean;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  IsSelected?: boolean;
}