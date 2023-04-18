export interface IData {
	username: string;
	password: string;
}

export interface IResponse {
	status: number;
	token?: string;
	username?: string;
}

export interface IMessages {
	messageid: number;
	username: string;
	message: string;
	time: bigint;
}