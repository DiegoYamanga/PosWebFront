export interface LotsDTO{

    id: number;
    title: string;
    logo_url?: string;
    lines: string[];
    max_winners: number;
    max_user_participations: number;
    active: number;
    date_from: string;
    date_to: string;
    min_amount: number;
    max_amount: number;

}