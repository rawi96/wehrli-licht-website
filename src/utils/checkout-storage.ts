import { CheckoutCustomer, CheckoutPaymentMethod, CheckoutShippingAddress, CheckoutShippingMethod } from '@/types/checkout';
import { emptyShippingAddress } from '@/utils/checkout-shipping-address';

const STORAGE_KEY = 'wehrli-shop-checkout-draft';

const draftListeners = new Set<() => void>();

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

const serverSnapshot = defaultCheckoutDraft();
let cachedSnapshot: CheckoutDraft = defaultCheckoutDraft();
let hydratedFromStorage = false;

export const subscribeCheckoutDraft = (onStoreChange: () => void): (() => void) => {
  draftListeners.add(onStoreChange);

  return () => {
    draftListeners.delete(onStoreChange);
  };
};

const emitCheckoutDraftChange = (): void => {
  draftListeners.forEach((listener) => listener());
};

const persistCheckoutDraftToStorage = (draft: CheckoutDraft): void => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

const readCheckoutDraftFromStorage = (): CheckoutDraft | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CheckoutDraft;

    return {
      customer: parsed.customer ?? emptyCheckoutCustomer(),
      shipping: parsed.shipping ?? 'pickup',
      paymentMethod: parsed.paymentMethod ?? 'prepayment',
      comment: parsed.comment ?? '',
      shippingAddress: parsed.shippingAddress ?? emptyShippingAddress(),
    };
  } catch {
    return null;
  }
};

const hydrateCheckoutDraftFromStorage = (): void => {
  if (hydratedFromStorage || typeof window === 'undefined') {
    return;
  }

  hydratedFromStorage = true;

  const loaded = readCheckoutDraftFromStorage();

  if (!loaded) {
    return;
  }

  cachedSnapshot = loaded;
};

export const getCheckoutDraftSnapshot = (): CheckoutDraft => {
  hydrateCheckoutDraftFromStorage();

  return cachedSnapshot;
};

export const getCheckoutDraftServerSnapshot = (): CheckoutDraft => serverSnapshot;

export const loadCheckoutDraft = (): CheckoutDraft | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const draft = readCheckoutDraftFromStorage();

  if (!draft) {
    return null;
  }

  saveCheckoutDraft(draft);

  return draft;
};

export const saveCheckoutDraft = (draft: CheckoutDraft): void => {
  if (typeof window === 'undefined') {
    return;
  }

  persistCheckoutDraftToStorage(draft);
  cachedSnapshot = draft;
  emitCheckoutDraftChange();
};

export const clearCheckoutDraft = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);
  cachedSnapshot = defaultCheckoutDraft();
  emitCheckoutDraftChange();
};
