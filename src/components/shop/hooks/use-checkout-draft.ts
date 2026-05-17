import { CheckoutCustomer, CheckoutPaymentMethod, CheckoutShippingAddress, CheckoutShippingMethod } from '@/types/checkout';
import {
  CheckoutDraft,
  getCheckoutDraftServerSnapshot,
  getCheckoutDraftSnapshot,
  saveCheckoutDraft,
  subscribeCheckoutDraft,
} from '@/utils/checkout-storage';
import { useCallback, useSyncExternalStore } from 'react';

type CheckoutDraftState = CheckoutDraft & {
  draftLoaded: boolean;
  setCustomer: (customer: CheckoutCustomer) => void;
  setShipping: (shipping: CheckoutShippingMethod) => void;
  setPaymentMethod: (payment: CheckoutPaymentMethod) => void;
  setComment: (comment: string) => void;
  setShippingAddress: (address: CheckoutShippingAddress) => void;
};

const patchDraft = (patch: Partial<CheckoutDraft>): void => {
  saveCheckoutDraft({ ...getCheckoutDraftSnapshot(), ...patch });
};

export const useCheckoutDraft = (): CheckoutDraftState => {
  const draft = useSyncExternalStore(subscribeCheckoutDraft, getCheckoutDraftSnapshot, getCheckoutDraftServerSnapshot);

  const draftLoaded = useSyncExternalStore(
    subscribeCheckoutDraft,
    () => typeof window !== 'undefined',
    () => false,
  );

  const setCustomer = useCallback((customer: CheckoutCustomer): void => {
    patchDraft({ customer });
  }, []);

  const setShipping = useCallback((shipping: CheckoutShippingMethod): void => {
    patchDraft({ shipping });
  }, []);

  const setPaymentMethod = useCallback((paymentMethod: CheckoutPaymentMethod): void => {
    patchDraft({ paymentMethod });
  }, []);

  const setComment = useCallback((comment: string): void => {
    patchDraft({ comment });
  }, []);

  const setShippingAddress = useCallback((shippingAddress: CheckoutShippingAddress): void => {
    patchDraft({ shippingAddress });
  }, []);

  return {
    customer: draft.customer,
    shipping: draft.shipping,
    paymentMethod: draft.paymentMethod,
    comment: draft.comment,
    shippingAddress: draft.shippingAddress,
    draftLoaded,
    setCustomer,
    setShipping,
    setPaymentMethod,
    setComment,
    setShippingAddress,
  };
};
