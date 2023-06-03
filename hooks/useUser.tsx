import React from 'react';

import { User } from '@supabase/auth-helpers-nextjs';
import {
  useSessionContext,
  useUser as useSupaUser,
} from '@supabase/auth-helpers-react';

import type { Subscription, UserDetails } from '@/@types/types';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export interface Props {
  [propName: string]: any;
}

export const UserContext = React.createContext<UserContextType | undefined>(
  undefined
);

export const MyUserContextProvider = (props: Props) => {
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(
    null
  );
  const [subscription, setSubscription] = React.useState<Subscription | null>(
    null
  );

  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();

  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;

  const getUserDetails = React.useCallback(() => {
    return supabase.from('users').select('*').single();
  }, [supabase]);

  const getSubscription = React.useCallback(() => {
    return supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();
  }, [supabase]);

  React.useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);

      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (result) => {
          const [userDetailsPromise, subscriptionPromise] = result;

          if (userDetailsPromise.status === 'fulfilled') {
            setUserDetails(userDetailsPromise.value.data as UserDetails);
          }

          if (subscriptionPromise.status === 'fulfilled') {
            setSubscription(subscriptionPromise.value.data as Subscription);
          }

          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingData && !isLoadingUser) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [
    user,
    isLoadingData,
    isLoadingUser,
    userDetails,
    subscription,
    getUserDetails,
    getSubscription,
  ]);

  const values = React.useMemo(
    () => ({
      accessToken,
      user,
      userDetails,
      isLoading: isLoadingUser || isLoadingData,
      subscription,
    }),
    [accessToken, user, userDetails, isLoadingUser, isLoadingData, subscription]
  );

  return <UserContext.Provider value={values} {...props} />;
};

export const useUser = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider');
  }

  return context;
};
