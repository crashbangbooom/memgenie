import { createContext } from 'react';

export interface IUser {
  id: string;
  name: string;
  isAdmin?: boolean;
  email: string;
  isSubscribed: boolean;
  subscriptionEndDate: string;
  address: string;
  country: string;
  state: string;
}
export interface IAppContext {
  context: {
    user?: IUser;
    fetching?: boolean;
  };
  setUser?: (user: IUser) => void;
  setFetching?: (fetching: boolean) => void;
}

export const AppContext = createContext<IAppContext>({ context: {} });
