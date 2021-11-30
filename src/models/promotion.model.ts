import { Company } from "./company.model";

export interface Promotion {
  PromotionId: string;
  Name: string;
  CompanyId: string;
  PromoGroup: string;
  PromoCode: string;
  PromoType: string;
  DiscountValue: string;
  DiscountUnits: string;
  AppliesTo: string;
  AppliesValue: string;
  CustomerGetsValue: string;
  MinimumRequirements: string;
  MinimumRequirementValue: string;
  StartDate: string;
  FinishDate: string;
  StartTime: string;
  FinishTime: string;
  ImageUrl: string;
  Bg: string;
  Color: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Class?: string[];
  Company?: Company;
  Style?: any;
}