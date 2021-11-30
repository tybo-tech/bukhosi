import { OrderOptions } from './order.options.model';

export interface CartModel {
  items: Item[];
  total: number;
  charges?: Charges[];
  customerId?: string;
  shipping?: any;
}

export interface Item {
  productId: string;
  companyId: string;
  name: string;
  image?: string;
  price: number;
  subTotal?: number;
  quantity: number;
  options?: OrderOptions[];
}

export interface Charges {
  name?: string;
  line?: string;
  amount: any;
  key: string;
}
