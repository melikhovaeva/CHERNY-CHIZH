import type { ContactEnum } from './enums';

export interface ContactData {
  id: number;
  type: ContactEnum.CONTACT | ContactEnum.SOCIALS;
  name: string;
  value: string;
  href: string;
}

export interface DocumentData {
  id: number;
  name: string;
  value: string;
}
