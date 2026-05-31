export async function redirectToPayHere(payload: {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
}): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch('/api/payhere-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.ok || !data.checkoutUrl) {
    return { ok: false, message: data.message || 'PayHere checkout unavailable.' };
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = data.checkoutUrl;
  Object.entries(data.fields as Record<string, string>).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  return { ok: true };
}
