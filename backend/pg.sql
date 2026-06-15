create database details(
create table users(
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null
);
create table songloc(
    id serial primary key,
    user_id uuid not null integer references unique users(id),
    song_name varchar(255) not null,
    artist varchar(255) not null,
    lat varchar(255) not null,
    long varchar(255) not null,
    update timestamp not null default now() 
)
);
select u.name, s.song_name, s.artist, s.lat, s.long, s.update from users u join songloc s on u.id=s.user_id;