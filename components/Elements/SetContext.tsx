import { AppContext } from '../../utils/context';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { gql, useQuery } from 'urql';

export const GET_USER = gql`
  query User {
    user {
      address
      country
      email
      id
      isAdmin
      isSubscribed
      name
      state
      subscriptionEndDate
      referrals
      pendingReferralCount
    }
  }
`;

function SetContext() {
  const [{ fetching: fetchingCurrentUser, data: userData }] = useQuery({
    query: GET_USER,
    pause: !Cookies.get('token'),
  });
  const { setUser, setFetching } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    setFetching?.(fetchingCurrentUser);
  }, [fetchingCurrentUser]);

  useEffect(() => {
    if (!fetchingCurrentUser && userData?.user) {
      setUser?.(userData.user);
    }
  }, [fetchingCurrentUser, userData]);
  // console.log(userData, "userData")

  return null;
}

export default SetContext;
