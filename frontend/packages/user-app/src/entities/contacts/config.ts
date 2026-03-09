import { ContactEnum } from './enums';
import type { ContactData, DocumentData } from './type';

export const CONTACT_DATA: ContactData[] = [
  {
    id: 1,
    type: ContactEnum.CONTACT,
    name: 'phone',
    value: '+7 (926) 232-43-07',
    href: 'tel:+79262324307',
  },
  {
    id: 2,
    type: ContactEnum.CONTACT,
    name: 'email',
    value: 'info@sharpei.club',
    href: 'mailto:info@sharpei.club',
  },
  {
    id: 3,
    type: ContactEnum.SOCIALS,
    name: 'vk',
    value: 'https://vk.com/sharpei.club',
    href: 'https://vk.com/sharpei.club',
  },
  {
    id: 4,
    type: ContactEnum.SOCIALS,
    name: 'messenger',
    value: '@sharpei.club',
    href: 'https://t.me/sharpei.club',
  },
  {
    id: 5,
    type: ContactEnum.SOCIALS,
    name: 'instagram',
    value: '@sharpei.club',
    href: 'https://www.instagram.com/sharpei.club',
  },

  {
    id: 6,
    type: ContactEnum.SOCIALS,
    name: 'whatsapp',
    value: '+7 (926) 232-43-07',
    href: 'https://wa.me/79262324307',
  },
];

export const DOCUMENT_DATA: DocumentData[] = [
  {
    id: 1,
    name: 'Договор оферты',
    value: 'certificate.pdf',
  },
  {
    id: 2,
    name: 'Политика конфиденциальности',
    value: 'privacy.pdf',
  },
];
