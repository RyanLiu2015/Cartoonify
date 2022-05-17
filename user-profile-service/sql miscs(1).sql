use cartoonify;

CREATE TABLE users (
	uid INT NOT NULL AUTO_INCREMENT COMMENT "Unique identifier",
	username VARCHAR(100) NOT NULL COMMENT "Username for login",
	password VARCHAR(300) NOT NULL COMMENT "Password for login",
	email VARCHAR(100) NOT NULL COMMENT "Email for login",
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT "Timestamp on which this entry is created",
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT "Timestamp on which this entry is updated",
	PRIMARY KEY ( uid )
);

CREATE TABLE feeds (
	fid INT NOT NULL AUTO_INCREMENT COMMENT "Unique identifier",
    author_id INT NOT NULL COMMENT "The uid of the author of this feed",
    resource_identifier VARCHAR(400) COMMENT "The identifier of the feed image",
    upvote_count INT NOT NULL DEFAULT 0 COMMENT "Upvote count",
    share_count INT NOT NULL DEFAULT 0 COMMENT "Share count",
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT "Timestamp on which this entry is created",
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT "Timestamp on which this entry is updated",
    FOREIGN KEY ( author_id )
        REFERENCES users( uid ),
	PRIMARY KEY ( fid )
);

INSERT INTO users (username, password, email) VALUES ("Yuan Liu", "hash", "yuanl59@uci.edu");
INSERT INTO users (username, password, email) VALUES ("Jiacheng He", "hash", "jiach16@uci.edu");
INSERT INTO users (username, password, email) VALUES ("Canjian Chen", "hash", "canjianc@uci.edu");
INSERT INTO users (username, password, email) VALUES ("Huapei Su", "hash", "huapes1@uci.edu");

INSERT INTO feeds (author_id,resource_identifier,upvote_count,share_count) VALUES (1,"yahhh",0,0);

SELECT * FROM users ORDER BY uid DESC LIMIT 10;

CREATE USER 'server_access'@'localhost' IDENTIFIED BY 'Tf9kaiR7e';
GRANT INSERT, UPDATE, DELETE, SELECT ON cartoonify.* TO 'server_access'@'localhost' WITH GRANT OPTION;