'use client';

import { useAuth } from '@/auth/auth-config/useAuth';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    Cookies.remove('token');
    window.location.href = '/';
  }, [logout]);

  return (
    <div>
      <h1>You have been logged out.</h1>
    </div>
  );
}

export default LogoutPage;
