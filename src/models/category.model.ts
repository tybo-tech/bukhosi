import { Product } from './product.model';

export interface Category {
  ProductsImages?: string[];
  CategoryId: string;
  Name: string;
  ParentId: string;
  Description: string;
  DisplayOrder: number;
  CategoryType: string;
  CompanyType: string;
  ImageUrl: string;
  PhoneBanner: string;
  IsDeleted: boolean;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  IsSelected?: boolean;
  Class?: string[];
  Children?: Category[];
  Tertiary?: Category[];
  Products?: Product[];
  Picks?: Product[];
  ShowChildren?: boolean;
  IsShop?: boolean;
}
