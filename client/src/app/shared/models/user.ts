export interface User {
  email:string;
  displayName:string;
  token:string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserLogin {
  email: string,
  password: string
}

export interface UserRegister {
  displayName:string;
  email: string,
  password: string
}

