import { JobWork } from './job.work.model';
import { Order } from './order.model';
import { User } from './user.model';

export interface Job {
  ShippingPrice: number;
  Shipping: string;
  JobId: string;
  CompanyId: string;
  CustomerId: string;
  CustomerName: string;
  JobNo: string;
  Tittle: string;
  JobType: string;
  Description: string;
  TotalCost: number;
  TotalDays: 0;
  StartDate?: any;
  DueDate?: any;
  Status: string;
  Class: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  Customer: User;
  Tasks?: JobWork[];
  Orders?: Order[];
}
