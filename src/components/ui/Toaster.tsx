'use client';

import { Toaster as ReactHotToaster, ToastBar } from 'react-hot-toast';

export const Toaster = () => (
  <ReactHotToaster
    position="bottom-center"
    toastOptions={{
      className: 'toast',
      success: { icon: null },
      error: { icon: null },
    }}>
    {t => (
      <ToastBar
        style={{
          ...t.style,
          animation: t.visible
            ? 'toast-enter 0.2s ease-out'
            : 'toast-exit 0.4s ease-in forwards',
        }}
        toast={t}
      />
    )}
  </ReactHotToaster>
);
