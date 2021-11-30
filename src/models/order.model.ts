import { Company } from './company.model';
import { Customer } from './customer.model';
import { Orderproduct } from './order.product.model';
import { Promotion } from './promotion.model';


export interface Order {
  OrdersId: string;
  OrderNo: string;
  CompanyId: string;
  CustomerId: string;
  AddressId: string;
  Notes: string;
  OrderType: string;
  Total: number;
  Shipping?: string;
  ShippingPrice?: number;
  Paid: number;
  Due: number;
  InvoiceDate: Date;
  DueDate: string;
  EstimatedDeliveryDate?: string;
  OrderSource?: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  Status: string;
  StatusId: number;
  Orderproducts?: Orderproduct[];
  Customer?: Customer;
  Company?: Company;
  GoBackToCreateOrder?: boolean;
  Discount?: Promotion;

}