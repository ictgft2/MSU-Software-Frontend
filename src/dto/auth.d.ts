export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  address: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  address?: string;
}
