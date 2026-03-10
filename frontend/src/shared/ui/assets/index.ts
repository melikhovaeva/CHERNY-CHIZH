import type { FunctionComponent, SVGProps } from 'react';
import InstagramIcon from './socials/instagram.svg?react';
import TelegramIcon from './socials/telegram.svg?react';
import VkIcon from './socials/vk.svg?react';
import WhatsappIcon from './socials/whatsapp.svg?react';

export { default as EditIcon } from './edit.svg?react';
export { default as LogoBigIcon } from './logo-big.svg?react';
export { default as LogoIcon } from './logo.svg?react';
export { default as PuppyNotFoundIcon } from './puppy-not-found.svg?react';
export { default as SaveIcon } from './save.svg?react';

export const SocialIcons: Record<
  string,
  FunctionComponent<SVGProps<SVGSVGElement>>
> = {
  instagram: InstagramIcon,
  messenger: TelegramIcon,
  vk: VkIcon,
  whatsapp: WhatsappIcon,
};
