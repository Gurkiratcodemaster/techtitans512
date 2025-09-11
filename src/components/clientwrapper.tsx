'use client'; // This directive is crucial

import { useState } from 'react';

import { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [isStateful, setIsStateful] = useState(false);

  // ... rest of your client-side logic
  return (
    <div>
      {children}
    </div>
  );
}