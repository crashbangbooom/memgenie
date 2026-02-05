'use client';

import { useEffect } from 'react';

export default function InstructionsPage() {
  useEffect(() => {
    if (window) {
      window.location.href = process.env.NEXT_PUBLIC_INSTRUCTIONS_LINK!;
    }
  }, []);

  return null;
}
