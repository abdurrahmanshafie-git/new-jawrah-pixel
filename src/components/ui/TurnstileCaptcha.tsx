import React from 'react';
import { Turnstile, type TurnstileProps } from '@marsidev/react-turnstile';
import { appEnv } from '@/lib/env';

interface TurnstileCaptchaProps extends Omit<TurnstileProps, 'siteKey'> {
  className?: string;
}

export function TurnstileCaptcha({ className, ...props }: TurnstileCaptchaProps) {
  const siteKey = appEnv.turnstileSiteKey;

  if (!siteKey) {
    console.warn('Cloudflare Turnstile site key is missing. Captcha will not load.');
    return null;
  }

  return (
    <div className={`flex justify-center my-4 ${className || ''}`}>
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: 'dark',
          appearance: 'always',
          size: 'normal',
        }}
        {...props}
      />
    </div>
  );
}
