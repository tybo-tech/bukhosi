import { Company } from "./company.model";

export interface User {
  UserId?: string;
  Email: string;
  Name: string;
  UserType?: string;
  Surname: string;
  Address?: string;
  Password: string;
  CompanyId?: string;
  CompanyName?: string;
  CompanyDp?: string;
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
  Roles?: UserRole[];
  Viewing?: boolean;
  PhoneNumber: any;
  Company?: Company;
  BirthdayDate?: string;
  BirthdayMonth?: string;
  BirthdayYear?: string;
}


export interface UserModel {
  CompanyId?: string;
  Dp?: any;
  AddressUrlHome?: any;
  AddressLineWork?: any;
  AddressUrlWork?: any;
  Name: string;
  Surname?: string;
  Email: string;
  PhoneNumber: string;
  Password?: any;
  UserType?: any;
  ImageUrl: string;
  AccessType: string;
  AccessStatus: string;
  AccessStartDate: string;
  AccessEndDate: string;
  CreateUserId: string;
  ModifyUserId: string;
  AddressLineHome?: string;
  BirthdayDate?: string;
  BirthdayMonth?: string;
  BirthdayYear?: string;
  StatusId: number;
  UserToken?: any;
  Roles: Role[];

}
export interface Role {
  Name: string;
}
export interface UserRole {
  RoleId: string;
  UserId: string;
  RoleName: string;
}
