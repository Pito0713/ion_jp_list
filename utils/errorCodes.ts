export const getErrorCodeKey = (code: Number) => {
	switch (code) {
		case 1001:
			return 'user_unauthorized';
		case 1002:
			return 'user_authorized_not_pass';
		case 1003:
			return 'sever_request_failed';
		case 1004:
			return 'account_password_required';
		case 1005:
			return 'duplicate_account';
		case 1006:
			return 'password_error';
		case 1007:
			return 'account_error';
		case 1008:
			return 'delete_data_error';
		case 1009:
			return 'daily_resource_not_found';
		default:
			return 'error_unknown'; //系统繁忙，请稍后重试
	}
};
