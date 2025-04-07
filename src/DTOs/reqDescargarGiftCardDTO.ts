export interface ReqDescargarGiftCardDTO {
    serial_number: string;
    card_number?: string;         
    identification?: string;     
    amount: number;
    local_datetime: string;
    branch_id: string;
  }