import { CheckoutCustomer, CheckoutPaymentMethod, CheckoutShippingAddress, CheckoutShippingMethod } from '@/types/checkout';
import { emptyShippingAddress } from '@/utils/checkout-shipping-address';

const STORAGE_KEY = 'wehrli-shop-checkout-draft';
const LEGACY_STORAGE_KEY = 'wehrli-dato-checkout-draft';

const draftListeners = new Set<() => void>();

export const subscribeCheckoutDraft = (onStoreChange: () => void): (() => void) => {
  draftListeners.add(onStoreChange);

  return () => {
    draftListeners.delete(onStoreChange);
  };
};

const emitCheckoutDraftChange = (): void => {
  draftListeners.forEach((listener) => listener());
};

export const getCheckoutDraftSnapshot = (): CheckoutDraft => loadCheckoutDraft() ?? defaultCheckoutDraft();

export const getCheckoutDraftServerSnapshot = (): CheckoutDraft => defaultCheckoutDraft();

export type CheckoutDraft = {
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  paymentMethod: CheckoutPaymentMethod;
  comment: string;
  shippingAddress: CheckoutShippingAddress;
};

export const emptyCheckoutCustomer = (): CheckoutCustomer => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
});

export const defaultCheckoutDraft = (): CheckoutDraft => ({
  customer: emptyCheckoutCustomer(),
  shipping: 'pickup',
  paymentMethod: 'prepayment',
  comment: '',
  shippingAddress: emptyShippingAddress(),
});

export const loadCheckoutDraft = (): CheckoutDraft | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(LEGACY_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CheckoutDraft & { orderNote?: string };

    const draft: CheckoutDraft = {
      customer: parsed.customer ?? emptyCheckoutCustomer(),
      shipping: parsed.shipping ?? 'pickup',
      paymentMethod: parsed.paymentMethod ?? 'prepayment',
      comment: parsed.comment ?? parsed.orderNote ?? '',
      shippingAddress: parsed.shippingAddress ?? emptyShippingAddress(),
    };

    saveCheckoutDraft(draft);

    return draft;
  } catch {
    return null;
  }
};

export const saveCheckoutDraft = (draft: CheckoutDraft): void => {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const clearCheckoutDraft = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(LEGACY_STORAGE_KEY);
  emitCheckoutDraftChange();
};
