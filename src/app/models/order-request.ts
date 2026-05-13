import { OrderItemRequest } from "./cart-item-request";

export interface OrderRequest {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItemRequest[];
}