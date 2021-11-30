export interface LocaleProduct {
  ProductId?: string;
  Name?: string;
  UnitPrice?: number;
  ImagUrl?: string;
  CategoryName?: string;
  SubCategoryName?: string;
  Description?: string;
  ProductType?: string;
  UnitCost?: string;
  Code?: string;
  SKU?: string;
  Quantity?: number;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  StatusId?: string;
  ProductSlug?: string;
}

export interface LocaleSubCategory {
  CategoryId?: string;
  CategoryName?: string;
  products?: LocaleProduct[];
}

export interface LocaleProductsModel {
  ParentCategoryId?: string;
  ParentCategoryName?: string;
  SubCategories?: LocaleSubCategory[];
}

