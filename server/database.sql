CREATE TABLE users (
	id SERIAL,
	username VARCHAR(50) UNIQUE,
	pass VARCHAR(255),
	token VARCHAR(255) UNIQUE
);

CREATE TABLE messages(
	messageId SERIAL,
	username VARCHAR(255),
	message VARCHAR(255),
	time BIGINT
);

