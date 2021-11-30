
export interface OrderOptions {
  Id?: string;
  OrderId: string;
  ProductId: string;
  OrderProductId: string;
  OptionId: string;
  ValueId: number;
  OptionValue: string;
  OptionName: string;
  ValuePrice: number;
  ValueIdQty: number;
  CompanyId: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
}
