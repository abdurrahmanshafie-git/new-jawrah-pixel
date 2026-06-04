import React from 'react';
import { Turnstile, type TurnstileProps } from '@marsidev/react-turnstile';
import { appEnv } from '@/lib/env';

type TurnstileOptions = NonNullable<TurnstileProps['options']>;

interface TurnstileCaptchaProps extends Omit<TurnstileProps, 'siteKey' | 'className' | 'onSuccess' | 'options'> {
  className?: string;
  onSuccess?: TurnstileProps['onSuccess'];
  onVerify?: TurnstileProps['onSuccess'];
  options?: TurnstileOptions;
  theme?: TurnstileOptions['theme'];
  size?: TurnstileOptions['size'];
}

export function TurnstileCaptcha({
  className,
  onSuccess,
  onVerify,
  options,
  theme,
  size,
  ...props
}: TurnstileCaptchaProps) {
  const siteKey = appEnv.turnstileSiteKey;

  if (!siteKey) {
    console.warn('Cloudflare Turnstile site key is missing. Captcha will not load.');
    return null;
  }

  const handleSuccess: TurnstileProps['onSuccess'] = (token) => {
    onSuccess?.(token);
    if (onVerify && onVerify !== onSuccess) onVerify(token);
  };

  return (
    <div className={`flex justify-center my-4 ${className || ''}`}>
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: 'dark',
          appearance: 'always',
          size: 'normal',
          ...options,
          ...(theme ? { theme } : {}),
          ...(size ? { size } : {}),
        }}
        onSuccess={handleSuccess}
        {...props}
      />
    </div>
  );
}
