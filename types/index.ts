export interface Honk {
  content: string;
  created_at: string | Date;
  likes: number;
  replys: number;
  reposts: number;
  user_id: string;
  post_id: number;
  imgURL?: string; //TODO: implement Image upload
  is_reply: boolean;
  is_repost: boolean;
  reference?: number | null;
}

export enum postActions {
  POST = "Honk!",
  REPOST = "Rehonk!",
  REPLY = "Reply Honk!",
}

export enum eventType {
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  SELECT = "SELECT",
}

export interface locationQueryResult {
  records: {
    record: locationRecord;
  }[];
}

export interface locationRecord {
  id: string;
  timestamp: string;
  size: number;
  fields: {
    name: string;
    cou_name_en: string;
  };
}

export enum feedType {
  MAIN = "main",
  PROFILE = "profile",
  POST = "post",
}
