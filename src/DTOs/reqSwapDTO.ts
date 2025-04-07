export interface ReqSwapDTO {
    serial_number: string;
    card_number?: string;
    identification?: string;
    amount: number;
    type: string;
    local_datetime: string;
    branch_id: string;
  }