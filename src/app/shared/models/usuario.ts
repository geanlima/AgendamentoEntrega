export interface Usuario {
    id: number;
    name: string;
    login: string;
    rca_code: string;
    supervisor_id: number;
    user_situation: string;
    profile_id: number;
    profile_name: string;
    profile_tag: string;
    token: string;
    expiration: Date;
    tipo: string;
}


