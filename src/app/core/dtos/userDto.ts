import { enumType } from "../models/config.model";

export interface UserDto { 
    id?: number; 
    name: string; 
    role: enumType;
    email: string;
    status: enumType;
    profilePicture?: string;
}
