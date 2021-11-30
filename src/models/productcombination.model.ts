import { ProductStock } from "./productstock.model";

export interface ProductCombination {
  ProductCombinationId?: number;
  CombinationString: string;
  CombinationStringId: string;
  ProductId: string;
  SKU: string;
  Price: number;
  AvailabelStock: number;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  FeaturedImage: string;
  ProductStock?: ProductStock[];
}
