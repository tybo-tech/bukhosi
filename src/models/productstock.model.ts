export interface ProductStock {
  ProductStockId: string;
  ProductId: string;
  ProductCombinationId: number;
  CombinationStringId: string;
  StockChangeReason: string;
  OtherReason?: string;
  StockChangeType: string;
  TotalStock: number;
  UnitPrice: number;
  TotalPrice: number;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;

}
