import { Company } from "./company.model";

export interface Customer {
  CustomerId?: string;
  Email: string;
  Name: string;
  CustomerType?: string;
  Surname: string;
  Address?: string;
  Password: string;
  CompanyId?: string;
  CompanyName?: string;
  Slug?: string;
  RoleId?: number;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  NewPassword?: string;
  ConfirmPassword?: string;
  StatusId: any;
  UserToken?: any;
  Dp?: any;
  AddressLineHome: string;
  AddressUrlHome: string;
  AddressLineWork: string;
  AddressUrlWork: string;
  SystemRole?: string;
  SecurityToken?: string;
  Viewing?: boolean;
  PhoneNumber: any;
  Company?: Company;
}

