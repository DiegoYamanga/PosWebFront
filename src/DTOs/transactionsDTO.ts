export interface TransactionDTO {
    id: number;
    card_number?: string;
    identification?: string;
    points: number;
    amount: number;
    total_points: number;
    total_amount: number;
    discount: number;
    discount_amount: number;
    final_amount: number;
  }