import { Company } from "./company.model";
import { Product } from "./product.model";

export interface TyboShopModel {
  Picked?: Product[];
  Products?: Product[];
  Campanies?: Company[];
  CurrentCompany?: Company;
}