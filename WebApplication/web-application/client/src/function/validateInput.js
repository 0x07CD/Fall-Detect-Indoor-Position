function validateInput(inputType, inputData) {
	const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
	const email_pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

	switch (inputType) {
		case "username":
			return username_pattern.test(inputData);
		case "email":
			return email_pattern.test(inputData);
		case "password":
			return password_pattern.test(inputData);
		default:
			console.log("input type don't exist...");
			return false;
	}
}

export default validateInput;