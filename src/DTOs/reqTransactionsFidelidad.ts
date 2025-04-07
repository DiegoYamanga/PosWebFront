export interface reqTransactionsFidelidad {
    serial_number: string;
    card_number?: string;
    identification?: string;
    amount: number;
    ticket_id?: string;
    payment_method?: string;
    local_datetime: string;
    branch_id: string;
  }