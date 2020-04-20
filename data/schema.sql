DROP TABLE IF EXISTS user_info;

CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    user_name TEXT,
    weight  FLOAT,
    height  FLOAT,
    age INT,
    gender VARCHAR(7)
);
INSERT INTO user_info (user_name,weight,height,age,gender) VALUES ('sssss',-2.0,-2.0,1,'f');