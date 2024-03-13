import { Request, Response } from "express";
import mongoose from "mongoose";
import { HttpStatusCode } from "../constants/HttpStatusCode";

interface IUser {
    _id?: string;
    id: string;
    name: string;
    email: string;
    password: string;
    status?: number;
    phone?: string;
    anddresses?: [
        {
            street: string;
            street_number: string;
            zipcode: string;
            city: string;
            state: string;
            complement?: string;
        }
    ];
    deletedAt?: Date;
}

interface IUserPartial {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    deletedAt?: Date;
    status?: number;
}

interface IUserCreate {
    name: string;
    email: string;
    password: string;
}

interface IUserCreateReturn {}

type IUserFindByObject = {
    _id?: mongoose.Types.ObjectId;
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
};

interface IUserRepository {
    findByObject(userData: IUserFindByObject): Promise<IUser | null>;

    findAll(): Promise<IUser[]>;

    createUser(userData: IUser): Promise<IUser>;
}

interface IUserController {
    create(req: Request, res: Response): Promise<Response>;
    getUser(req: Request, res: Response): Promise<Response>;
    getUsers(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}

type IUserReturn = Promise<IUser | null>;

type IUserServicesReturn = {
    statusCode: HttpStatusCode;
    message: any;
};

interface IUserServices {
    create(userCreateData: IUserCreate): Promise<IUserServicesReturn>;
    getUser(id: string): Promise<IUserServicesReturn>;
    getUsers(): Promise<IUserServicesReturn>;
    update(userUpdateData: IUserPartial, id: string): Promise<IUserServicesReturn>;
    delete(id: string): Promise<IUserServicesReturn>;
}

export {
    IUser,
    IUserPartial,
    IUserCreate,
    IUserCreateReturn,
    IUserRepository,
    IUserFindByObject,
    IUserController,
    IUserReturn,
    IUserServices,
    IUserServicesReturn,
};
