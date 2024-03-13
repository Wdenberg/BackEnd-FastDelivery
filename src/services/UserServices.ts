import { HttpStatusCode } from "../constants/HttpStatusCode";
import { IUser, IUserCreate, IUserPartial, IUserServices, IUserServicesReturn } from "../interfaces/IUser";

import * as yup from "yup";
import md5 from "md5";
import { v4 } from "uuid";
import MongoUserRepository from "../repositories/MongoUserRepository";
import Util from "../Utils/Util";
import { BadRequestError, NotFoundError } from "../helpers/API-Error";
import { UserStatus } from "../constants/UserStatus";

class UserServices implements IUserServices {
	async create(userCreateData: IUserCreate): Promise<IUserServicesReturn> {
		const userSchema = {
			name: yup
				.string()
				.required("O Campo nome é obrigatório!")
				.min(3, "O nome necessita de no mínimo três caracteres!")
				.trim()
				.test("Name-invalido", "O nome não pode ser igual ao email.", (name, context) => {
					return Util.validationNameDiferentEmail(name, context.parent.email);
				}),
			email: yup
				.string()
				.required("O Campo e-mail é obrigatório!")
				.min(10, "O e-mail necessita de no mínimo dez caracteres!")
				.email("Informe um e-mail válido!"),
			password: yup
				.string()
				.required("O campo senha é obrigatório!")
				.min(8, "A senha necessita de no mínimo oito caracteres!")
				.max(16, "A senha necessita de no máximo dezesseis caracteres!")
				.trim()
				.test("Senha-espacos", "a senha não pode ter espaços em branco", senha => {
					return Util.blankLines(senha);
				})
				.test(
					"Senha-requerimentos",
					"A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial",
					senha => {
						const uppercaseRegex = /[A-Z]/;
						const lowercaseRegex = /[a-z]/;
						const numberRegex = /[0-9]/;
						const specialCharRegex = /[!@#$%^&*]/;

						return (
							uppercaseRegex.test(senha) &&
							lowercaseRegex.test(senha) &&
							numberRegex.test(senha) &&
							specialCharRegex.test(senha)
						);
					}
				),
		};
		const userDataValidate = await Util.validationData(userSchema, userCreateData);

		const { name, email, password } = userDataValidate;

		const userExists = await MongoUserRepository.findByObject({ email });

		if (userExists) {
			throw new BadRequestError("E-mail já cadastrado!");
		}

		const hashPassword = md5(password + process.env.SALT_KEY);
		const id = v4();

		const userData: IUser = {
			id,
			name,
			email,
			password: hashPassword,
		};
		const user = await MongoUserRepository.createUser(userData);

		return {
			statusCode: HttpStatusCode.Created,
			message: user,
		};
	}

	async getUser(id?: string): Promise<IUserServicesReturn> {
		if (!id) {
			throw new BadRequestError("Id é um campo obrigatório!");
		}
		const user = await MongoUserRepository.findByObject({ id });

		if (!user || user?.status === UserStatus.StatusDeletado) {
			throw new NotFoundError("Usuário inexistente!");
		}

		return {
			statusCode: HttpStatusCode.OK,
			message: user,
		};
	}

	async getUsers(): Promise<IUserServicesReturn> {
		const users = await MongoUserRepository.findAll();
		return {
			statusCode: HttpStatusCode.OK,
			message: users,
		};
	}

	async update(userUpdateData: IUserPartial, id?: string): Promise<IUserServicesReturn> {
		if (!id) {
			throw new BadRequestError("Id é um campo obrigatório!");
		}
		const user = await MongoUserRepository.findByObject({ id });

		if (!user || user?.status === UserStatus.StatusDeletado) {
			throw new NotFoundError("Usuário inexistente!");
		}

		return {
			statusCode: HttpStatusCode.OK,
			message: "",
		};
	}

	async delete(id?: string): Promise<IUserServicesReturn> {
		if (!id) {
			throw new BadRequestError("Id é um campo obrigatório!");
		}
		const user = await MongoUserRepository.findByObject({ id });

		if (!user || user?.status === UserStatus.StatusDeletado) {
			throw new NotFoundError("Usuário inexistente!");
		}
		const userDelete = await MongoUserRepository.updateById(user._id as string, {
			deletedAt: new Date(),
			status: UserStatus.StatusDeletado,
			email: user.email + "_canceled_" + new Date().getTime(),
		});

		return {
			statusCode: HttpStatusCode.OK,
			message: userDelete,
		};
	}
}

export default new UserServices();
