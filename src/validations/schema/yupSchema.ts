import * as yup from "yup";

yup.addMethod<yup.StringSchema>(
	yup.string,
	"username",
	function (this: yup.StringSchema) {
		return this.required("Tên đăng nhập không được để trống").min(
			3,
			"Tên đăng nhập phải có ít nhất 3 ký tự",
		);
	},
);

yup.addMethod<yup.StringSchema>(
	yup.string,
	"password",
	function (this: yup.StringSchema) {
		return this.required("Mật khẩu không được để trống").min(
			6,
			"Mật khẩu phải có ít nhất 6 ký tự",
		);
	},
);

yup.addMethod<yup.StringSchema>(
	yup.string,
	"emailTest",
	function (this: yup.StringSchema) {
		return this.required("Email không được để trống").email(
			"Email không hợp lệ",
		);
	},
);

yup.addMethod<yup.StringSchema>(
	yup.string,
	"firstName",
	function (this: yup.StringSchema) {
		return this.required("Tên không được để trống").min(
			2,
			"Tên phải có ít nhất 2 ký tự",
		);
	},
);

yup.addMethod<yup.StringSchema>(
	yup.string,
	"lastName",
	function (this: yup.StringSchema) {
		return this.required("Họ không được để trống").min(
			2,
			"Họ phải có ít nhất 2 ký tự",
		);
	},
);

yup.addMethod<yup.StringSchema>(
	yup.string,
	"gender",
	function (this: yup.StringSchema) {
		return this.required("Giới tính không được để trống").oneOf(
			["Male", "Female", "Other"],
			"Giới tính không hợp lệ",
		);
	},
);

declare module "yup" {
	interface StringSchema {
		username(params?: { message?: string }): StringSchema;
		password(params?: { message?: string }): StringSchema;
		emailTest(params?: { message?: string }): StringSchema;
		firstName(params?: { message?: string }): StringSchema;
		lastName(params?: { message?: string }): StringSchema;
		gender(params?: { message?: string }): StringSchema;
	}
}
