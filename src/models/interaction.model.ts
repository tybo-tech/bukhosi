export interface Interaction {
  InteractionId: string;
  InteractionType: string;
  InteractionSourceId: string;
  InteractionTargetId: string;
  TraceId: string;
  InteractionBody: string;
  InteractionStatus: string;
  ImageUrl: string;
  SourceType: string;
  SourceName: string;
  SourceDp: string;
  TargetType: string;
  TargetName: string;
  TargetDp: string;
  CreateUserId: string;
  ModifyUserId: string;
  CreateDate?: string;
  ModifyDate?: string;
  StatusId: number;
  Color: string;
  Size: string;
  Price: number;
  Name: string;
  Description: string;

}



export interface InteractionSearchModel {
  InteractionSourceId: string;
  InteractionTargetId: string;
  StatusId: number;
  InteractionType: string;
  TraceId?: string;

}
