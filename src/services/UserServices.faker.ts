import { faker } from "@faker-js/faker";
import md5 from "md5";
import { IUser, IUserCreate } from "../interfaces/IUser";
import MongoUserRepository from "../repositories/MongoUserRepository";

const generateUser = async (): Promise<IUser> => {
	let email: string;
	do {
		email = faker.internet.email();
	} while (await MongoUserRepository.findByObject({ email }));

	return {
		id: faker.string.uuid(),
		name: faker.internet.userName(),
		email,
		password: md5(faker.string.alphanumeric(8) + process.env.SALT_KEY),
		status: 1,
	};
};

const generateUserCreate = async (): Promise<IUserCreate> => {
	let email: string;
	do {
		email = faker.internet.email();
	} while (await MongoUserRepository.findByObject({ email }));

	return {
		name: faker.internet.userName(),
		email,
		password: faker.string.alphanumeric(8) + "L@8a",
	};
};

export { generateUser, generateUserCreate };
