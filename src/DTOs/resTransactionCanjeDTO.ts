export interface ResTransactionCanheDTO{
   
  id: number;
  reason: string;
  amount: number;
  serial_number: string;
  branch_id: number;
  branch_name?: string | null;
  user_subscription_id?: number;
  user_name?: string | null;
  user_last_name?: string | null;
  user_card_number?: string | null;
  user_identification?: string | null;
  date: string;
  ticket_id?: string;
  payment_method?: string;
  status: string;
  type: string;
  total_amount: number;
  total_points: number;
  discount: number;
  discount_amount: number;
  points: number;
  final_amount: number;
  card_number: string;
  points_factor: number;
  discount_factor: number;
  client_type: string;


}