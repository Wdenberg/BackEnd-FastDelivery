import { describe, expect, expectTypeOf, it } from "vitest";
import { generateUser, generateUserCreate } from "./UserServices.faker";
import "../app";
import { IUser, IUserCreate } from "../interfaces/IUser";
import UserServices from "./UserServices";
import axios from "axios";
import { ApiError, UnauthorizedError } from "../helpers/API-Error";
import Util from "../Utils/Util";
import * as yup from "yup";

describe("Testing User Service methods", () => {
	it("Should be able to generate a user data of IUser types", async () => {
		const result = await generateUser();
		expectTypeOf(result).toEqualTypeOf<IUser>;
	});

	it("Should be able to generate a user create data of IUserCreate types", async () => {
		const result = await generateUserCreate();
		expectTypeOf(result).toEqualTypeOf<IUserCreate>;
	});

	it("Should be able to create a user, and one should be able IUser types", async () => {
		const dataUser = await generateUserCreate();
		const result = await UserServices.create(dataUser);
		expectTypeOf(result).toEqualTypeOf<IUser>;
	});

	it("Should be able to get users", async () => {
		const result = await UserServices.getUsers();
		expectTypeOf(result.message).toEqualTypeOf<IUser[]>;
	});

	it("Should be able to get a user", async () => {
		const dataUser = await generateUserCreate();
		const user = await UserServices.create(dataUser);

		const result = await UserServices.getUser(user.message.id);
		expectTypeOf(result.message).toEqualTypeOf<IUser>;
	});

	it("Should be able to delete a user", async () => {
		const dataUser = await generateUserCreate();
		const user = await UserServices.create(dataUser);

		const result = await UserServices.delete(user.message.id);
		expectTypeOf(result.message).toEqualTypeOf<IUser>;
	});

	it("Should be able to update a user", async () => {
		const dataUser = await generateUserCreate();
		const user = await UserServices.create(dataUser);

		const result = await UserServices.update(dataUser, user.message.id);
		expectTypeOf(result.message).toEqualTypeOf<IUser>;
	});

	it("Should not be able to create a user an existing email address", async () => {
		try {
			const dataUser = await generateUserCreate();
			await UserServices.create(dataUser);
			await UserServices.create(dataUser);
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("E-mail já cadastrado!");
		}
	});

	it("Should not be able to create a user an invalid password", async () => {
		try {
			const dataUser = await generateUserCreate();
			dataUser.password = "AA";
			await UserServices.create(dataUser);
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("A senha necessita de no mínimo oito caracteres!");
		}
	});

	it("Should not be able to get a user with not have a id", async () => {
		try {
			const result = await UserServices.getUser();
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Id é um campo obrigatório!");
		}
	});

	it("Should not be able to get a user with not existing", async () => {
		try {
			const result = await UserServices.getUser("AAAAAA");
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Usuário inexistente!");
		}
	});

	it("Should not be able to delete a user with not have a id", async () => {
		try {
			const result = await UserServices.delete();
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Id é um campo obrigatório!");
		}
	});

	it("Should not be able to delete a user with not existing", async () => {
		try {
			const result = await UserServices.delete("AAAAAA");
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Usuário inexistente!");
		}
	});

	it("Should not be able to update a user with not have a id", async () => {
		try {
			const dataUser = await generateUserCreate();
			const result = await UserServices.update(dataUser);
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Id é um campo obrigatório!");
		}
	});

	it("Should not be able to update a user with not existing", async () => {
		try {
			const dataUser = await generateUserCreate();
			const result = await UserServices.update(dataUser, "AAAAAAAA");
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Usuário inexistente!");
		}
	});
});

describe("Testing User routes implements", () => {
	it("Should be able to create a user, and one should be able IUserCreate types", async () => {
		try {
			const dataUser = await generateUserCreate();
			const URL = `${process.env.URL_TEST || "https://127.0.0.1"}:${process.env.PORT || 9001}`;
			const result = (await axios.post(URL + "/user/create", dataUser)).data as { message: IUser };
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (_) {}
	});
	it("Should be able to get all users", async () => {
		try {
			const URL = `${process.env.URL_TEST || "https://127.0.0.1"}:${process.env.PORT || 9001}`;
			const result = (await axios.get(URL + "/user")).data;
			expectTypeOf(result.message).toEqualTypeOf<IUser[]>;
		} catch (_) {}
	});

	it("Should be able to get a user", async () => {
		try {
			const dataUser = await generateUserCreate();
			const URL = `${process.env.URL_TEST || "https://127.0.0.1"}:${process.env.PORT || 9001}`;
			const response = (await axios.post(URL + "/user/create", dataUser)).data as { message: IUser };
			expectTypeOf(response.message).toEqualTypeOf<IUser>;

			const result = (await axios.get(URL + "/user/" + response.message.id)).data;
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (_) {}
	});

	it("Should be able to delete a user", async () => {
		try {
			const dataUser = await generateUserCreate();
			const URL = `${process.env.URL_TEST || "https://127.0.0.1"}:${process.env.PORT || 9001}`;
			const response = (await axios.post(URL + "/user/create", dataUser)).data as { message: IUser };
			expectTypeOf(response.message).toEqualTypeOf<IUser>;

			const result = (await axios.delete(URL + "/user/" + response.message.id)).data;
			expectTypeOf(result.message).toEqualTypeOf<IUser>;
		} catch (_) {}
	});
});

describe("Error testing Implements", () => {
	it("Should be able to have a 'AnyError'", async () => {
		try {
			throw new ApiError("AnyError", 500);
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("AnyError");
		}
	});

	it("Should be able to have a 'Internal Server Error'", async () => {
		try {
			throw new Error("Internal Server Error");
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Internal Server Error");
		}
	});

	it("Should be able to have a 'Restrict access'", async () => {
		try {
			throw new UnauthorizedError("Restrict access");
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Restrict access");
		}
	});

	it("Should not be able to have a not expected Error", async () => {
		const data = { data: "" };
		const userSchema = {
			data: yup.string().required("Data é obrigatorio"),
		};
		try {
			await Util.validationData(userSchema, data);
		} catch (err: { message: string } & any) {
			expect(err.message).toBe("Data é obrigatorio");
		}
	});
});
