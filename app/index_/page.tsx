'use client';

import { useEffect } from 'react';

export default function IndexPage() {
  useEffect(() => {
    if (window) {
      window.location.href = process.env.NEXT_PUBLIC_INDEX_LINK!;
    }
  }, []);

  return null;
}
