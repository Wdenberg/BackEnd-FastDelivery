import { IUserRepository, IUser, IUserCreate, IUserFindByObject, IUserReturn, IUserPartial } from "../interfaces/IUser";
import { User } from "../models/User";

class MongoUserRepository implements IUserRepository {
    async findByObject(userData: IUserFindByObject): IUserReturn {
        return await User.findOne(userData);
    }

    async findAll(): Promise<IUser[]> {
        return await User.find();
    }

    async createUser(userData: IUser): Promise<IUser> {
        return await new User(userData).save();
    }

    async updateById(_id: string, obj: IUserPartial): Promise<any> {
        let item = await User.findByIdAndUpdate(
            _id,
            {
                $set: obj,
            },
            { new: true }
        );

        return item;
    }
}

export default new MongoUserRepository();
