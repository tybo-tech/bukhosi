export class ChangePasswordModel {
    Email: string;
    Password?: string;
    ConfirmPassword?: string;
  }
  
  
  export interface TokenModel {
    Token: string;
  }
  
  export interface EmailGetRequestModel {
    Email: string;
  }
  