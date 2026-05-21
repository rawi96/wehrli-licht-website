import { BuildingStorefrontIcon, CreditCardIcon, EyeIcon, SparklesIcon, TruckIcon } from '@heroicons/react/24/outline';
import { ComponentType, SVGProps } from 'react';

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  shipping: TruckIcon,
  pickup: BuildingStorefrontIcon,
  payment: CreditCardIcon,
  viewing: EyeIcon,
  showroom: SparklesIcon,
};

export const getShopServiceIcon = (icon: string): ComponentType<SVGProps<SVGSVGElement>> => ICONS[icon] ?? TruckIcon;
