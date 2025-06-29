import { IUser } from '@/types/IUser';

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}
