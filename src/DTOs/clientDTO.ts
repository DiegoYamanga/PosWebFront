export interface ClienteDTO{
    branch_id: any;
    card_number: string;
    user_id: number;
    user_subscription_id: number;
    client_type_id: number;
    client_type_name: string;
    points: number;
    cash: number;
    name: string;
    last_name: string;
    identification: string;
    email: string;
    phone: string;
    born_date: string; // o Date si se parsea a fecha
    sex: string;

}