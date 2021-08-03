create database cash_machine;

create table account(
    id serial not null primary key,
    num_account varchar(255) not null unique,
    type_account varchar(155) not null,
    password varchar(500) not null,
    client varchar(255) not null,
    balance numeric not null,
    status boolean not null
);