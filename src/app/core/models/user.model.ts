import { enumType } from "./config.model";

export interface User{
    id?: number; 
    name: string;
    userName?: string;
    email: string; 
    bio?: string;
    rating?: number;
    status: enumType;
    profilePicture?: string;
    role: enumType;
}