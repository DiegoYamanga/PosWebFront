export interface ReqSwapDTO {
    serial_number: string;
    card_number?: string;
    identification?: string;
    amount: number;
    type: 'P' | 'I';
    local_datetime: string;
    branch_id: string;
  }