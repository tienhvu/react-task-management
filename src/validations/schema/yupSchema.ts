import * as yup from "yup";
yup.addMethod<yup.StringSchema>(yup.string, "username", function () {
	return this.required("Tên đăng nhập không được để trống").min(
		3,
		"Tên đăng nhập phải có ít nhất 3 ký tự",
	);
});

yup.addMethod<yup.StringSchema>(yup.string, "password", function () {
	return this.required("Mật khẩu không được để trống").min(
		6,
		"Mật khẩu phải có ít nhất 6 ký tự",
	);
});
declare module "yup" {
	interface StringSchema {
		username(params?: { message?: string }): StringSchema;
		password(params?: { message?: string }): StringSchema;
	}
}
