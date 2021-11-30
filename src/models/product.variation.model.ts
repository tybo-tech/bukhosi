import { ProductVariationOption } from './product.variation.option.model';

export interface ProductVariation {
  Id?: number;
  ProductId: string;
  CompanyVariationId: number;
  VariationName: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  ProductVariationOptions?: ProductVariationOption[];
}
