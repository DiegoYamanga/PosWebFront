export interface CuponCheckDTO {
  id: number;
  active: number;
  title: string;
  logo_url?: string | null;
  messages: string[];
  date_from: string;
  date_to: string;
  information_encoded: string;
  type_code: string;
  precio_from: number;
  precio_to: number;
}
