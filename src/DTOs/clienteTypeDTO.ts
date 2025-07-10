export interface ClienteTipoDTO {
    id: number;
    name: string;
    description: string;
    store_id: number;
    deleted: number;
    points_1: number;
    points_2: number;
    points_3: number;
    points_4: number;
    points_5: number;
    points_6: number;
    points_7: number;
    discount_1: number;
    discount_2: number;
    discount_3: number;
    discount_4: number;
    discount_5: number;
    discount_6: number;
    discount_7: number;
    min_allowed_points: number;
    is_default: number;
    branch_id: number;         
    client_type_id?: number; 
    
    [key: string]: number | string | undefined;
  }