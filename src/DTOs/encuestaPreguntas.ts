export interface EncuestaPreguntas {
  id: number;
  poll_id: number;
  title: string;
  type: string;
  min_value: number;
  max_value: number;
  values?: string[] | null;
}
