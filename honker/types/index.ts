export {};

declare global {
  interface Honk {
    content: string;
    created_at: string | Date;
    likes: number;
    replys: number;
    reposts: number;
    user_id: string;
    post_id: number;
    imgURL?: string; //TODO: implement Image upload
  }

  const enum eventType {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    SELECT = "SELECT",
  }
}
