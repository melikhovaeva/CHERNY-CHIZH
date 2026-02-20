export interface RegisterStep1Request {
  email: string;
  password: string;
  password2: string;
}

export interface RegisterStep1Response {
  email: string;
}

export interface RegisterStep2Request {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone?: string;
  telegram?: string;
}

export interface RegisterStep2Response {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  telegram: string | null;
}
