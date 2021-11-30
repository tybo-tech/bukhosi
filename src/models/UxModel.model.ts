import { Product } from "./product.model";

export interface HomeNavUx {
  LogoUrl: string;
  Name: string;
}


export interface LoaderUx {
  Loading: boolean;
  Message?: string;
}
export interface NavHistoryUX {
  BackTo: string;
  BackToAfterLogin: string;
  ScrollToProduct: Product;
  ScrollToYPositoin?: number;
}

export interface BreadModel {
  Name: string;
  Link:string
}