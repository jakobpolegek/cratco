import {User} from "@/types/Auth";

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}