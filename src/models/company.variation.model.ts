import { CompanyVariationOption } from './company.variation.option.model';

export interface CompanyVariation {
  CompanyVariationId: number;
  CompanyId: string;
  VariationId: number;
  Name: string;
  Description: string;
  IsDeleted: boolean;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  VariationsOptions?: CompanyVariationOption[];
}


