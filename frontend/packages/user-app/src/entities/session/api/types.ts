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
  last_name?: string;
  phone?: string;
  messenger?: string;
}

export interface RegisterStep2Response {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  messenger: string | null;
  avatar_image: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  messenger: string | null;
  avatar_image: string | null;
}

export interface LoginResponse extends User {}
