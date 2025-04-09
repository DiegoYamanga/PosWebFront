export interface ReqCancelarTransaccionByID {
  serial_number: string;
  card_number?: string | null;
  identification?: string | null;
  local_datetime: string;
  branch_id: string;

}
