'use client';

import React, { useState } from 'react';
import { MessageCircle, Check, Copy } from 'lucide-react';
import type { CheckoutFormData } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { generateWhatsAppURL, copyToClipboard } from '@/lib/utils';
import { SELLER_WHATSAPP } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM: CheckoutFormData = {
  fullName: '',
  phone: '',
  address: '',
  notes: '',
};

type Stage = 'form' | 'success';

export default function CheckoutForm({ isOpen, onClose }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [stage, setStage] = useState<Stage>('form');
  const [copied, setCopied] = useState(false);

  const { items, clearCart } = useCartStore();

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+\d\s\-()]{7,20}$/.test(formData.phone.trim()))
      newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const url = generateWhatsAppURL(items, formData);

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      clearCart();
      setStage('success');
    } catch {
      // WhatsApp failed to open — show fallback copy button
      setStage('success');
    }
  };

  const handleCopyOrder = async () => {
    const url = generateWhatsAppURL(items, formData);
    const orderText = decodeURIComponent(url.split('?text=')[1] ?? '');
    const success = await copyToClipboard(orderText);
    if (success) setCopied(true);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setStage('form');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={stage === 'form' ? 'Complete Your Order' : undefined}
      maxWidth="max-w-lg"
    >
      {stage === 'success' ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-green-600" aria-hidden="true" />
          </div>
          <h3 className="font-display text-2xl text-obsidian mb-3">
            Order Sent!
          </h3>
          <p className="font-accent text-base italic text-obsidian/60 leading-relaxed mb-6">
            Your order has been sent via WhatsApp. Our artisan will confirm
            your pieces and arrange delivery personally.
          </p>

          {/* Fallback if WhatsApp didn't open */}
          <div className="bg-champagne/30 border border-gold/20 rounded-sm p-4 mb-6">
            <p className="font-body text-xs text-obsidian/60 mb-3">
              If WhatsApp didn&apos;t open, you can copy your order or contact us
              directly:
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyOrder}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-gold/30 text-gold font-body text-sm hover:bg-gold/5 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy order details'}
              </button>
              <a
                href={`tel:+${SELLER_WHATSAPP}`}
                className="font-accent text-xs italic text-center text-obsidian/50 hover:text-obsidian transition-colors"
              >
                Or call: +{SELLER_WHATSAPP}
              </a>
            </div>
          </div>

          <Button variant="outline" onClick={handleClose} fullWidth>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="checkout-name"
              className="block font-body text-xs font-semibold tracking-wider uppercase text-obsidian/60 mb-2"
            >
              Full Name <span className="text-rose-gold">*</span>
            </label>
            <input
              id="checkout-name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Your full name"
              autoComplete="name"
              className={[
                'w-full px-4 py-3 border font-body text-sm text-obsidian bg-ivory',
                'outline-none transition-colors rounded-sm',
                errors.fullName
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-platinum-dark focus:border-gold',
              ].join(' ')}
              aria-required="true"
              aria-describedby={errors.fullName ? 'name-error' : undefined}
            />
            {errors.fullName && (
              <p id="name-error" role="alert" className="mt-1 font-body text-xs text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="checkout-phone"
              className="block font-body text-xs font-semibold tracking-wider uppercase text-obsidian/60 mb-2"
            >
              Phone Number <span className="text-rose-gold">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              className={[
                'w-full px-4 py-3 border font-body text-sm text-obsidian bg-ivory',
                'outline-none transition-colors rounded-sm',
                errors.phone
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-platinum-dark focus:border-gold',
              ].join(' ')}
              aria-required="true"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" role="alert" className="mt-1 font-body text-xs text-red-500">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="checkout-address"
              className="block font-body text-xs font-semibold tracking-wider uppercase text-obsidian/60 mb-2"
            >
              Delivery Address{' '}
              <span className="text-obsidian/30 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              id="checkout-address"
              value={formData.address}
              onChange={(e) => setFormData((f) => ({ ...f, address: e.target.value }))}
              placeholder="Your delivery address"
              rows={3}
              autoComplete="street-address"
              className="w-full px-4 py-3 border border-platinum-dark font-body text-sm text-obsidian bg-ivory outline-none focus:border-gold transition-colors rounded-sm resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="checkout-notes"
              className="block font-body text-xs font-semibold tracking-wider uppercase text-obsidian/60 mb-2"
            >
              Notes{' '}
              <span className="text-obsidian/30 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              id="checkout-notes"
              value={formData.notes}
              onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Gift wrapping, custom engraving, special requests…"
              rows={2}
              className="w-full px-4 py-3 border border-platinum-dark font-body text-sm text-obsidian bg-ivory outline-none focus:border-gold transition-colors rounded-sm resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-2 gap-2"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Send Order via WhatsApp
          </Button>

          <p className="font-accent text-xs italic text-center text-obsidian/40">
            Your cart and order details will be forwarded to our WhatsApp. No payment collected here.
          </p>
        </form>
      )}
    </Modal>
  );
}
