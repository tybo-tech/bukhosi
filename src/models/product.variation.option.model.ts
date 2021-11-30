import { Images } from "./images.model";

export interface ProductVariationOption {
  Id?: number;
  ProductVariationId: number;
  ProductId: string;
  VariationId: number;
  VariationOptionId: number;
  VariationName: string;
  ImageUrl: string;
  ShowOnline: string;
  Description: string;
  OptionName: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  IsSelected?: boolean;
  Class?: string[];
  Images?: Images[];

}
