export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
  }
  
  export interface UserLogin {
    email: string;
    password: string;
  }
  
  export interface UserRegistration extends UserLogin {
    email: string;
    username: string;
  }
  
  export interface UserResponse {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
  }