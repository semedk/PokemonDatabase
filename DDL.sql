SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Pokemon;
CREATE TABLE Pokemon (
	pokedex_num int NOT NULL,
	pokname varchar(255) NOT NULL,
	ev_yield varchar(255) NOT NULL,
	ability varchar(255) NOT NULL,
	PRIMARY KEY (pokedex_num)
);
INSERT INTO Pokemon (pokedex_num, pokname, ev_yield, ability)
VALUES (0025, 'Pikachu', '2 Spd', 'Static'),
(0278, 'Wingull', '1 Spd', 'Keen Eye'),
(074, 'Geodude', '1 Def', 'Rock Head'),
(059, 'Arcanine', '2 Atk' , 'Intimidate'),
(017, 'Pidgeotto', '2 Spd', 'Keen Eye'),
(0248, 'Tyranitar', '3 Atk', 'Sand Stream');


DESCRIBE Pokemon;

DROP TABLE IF EXISTS Types;
CREATE TABLE Types (
	typename varchar(255) NOT NULL,
	color varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	PRIMARY KEY (typename)
);
INSERT INTO Types (typename, color, description)
VALUES ('Fire', 'Red', 'Fire-type moves are super-effective against Bug, Grass, Ice, and Steel-type pokemon while Fire-type pokemon are weak to ground, roc, and water type moves.'),
('Water', 'Blue', 'Super-effective against Fire-Ground, and Rock-type pokemon while Water-type Pokemon are weak to Electric and Grass-type moves'),
('Rock', 'Brass', 'Super-effective against Bug, Fire, Flying, and Ice-Type Pokemon while they are weak to fighting, grass, ground, steel, and water type moves'),
('Ground', 'Light Brown', 'Super-effective against Electric-, Fire-, Poison-, Rock-, and Steel-type pokemon, while Ground-type Pokémon are weak to Grass-, Ice-, and Water-type moves'),
('Electric', 'Yellow', 'Super-effective against Flying- and Water-type pokemon, while Electric-type pokemon are weak to Ground-type moves'),
('Dark', 'Black', 'Super-effective against Ghost- and Psychic-type pokemon, while Dark-type Pokemon are weak to Bug-, Fairy-, and Fighting-type moves'),
('Flying', 'Light Blue', 'Super-effective against Bug-, Fighting-, and Grass-type pokemon, while Flying-type pokemon are weak to Electric-, Ice-, and Rock-type moves'),
('Normal', 'Light Grey', 'Not super-effective against any pokemon, but Normal-type pokemon are weak to Fighting-type pokemon'),
('Grass', 'Green', 'Super-effective against Ground, Rock, and Water type pokemon while grass-type pokemon are weak to Bug, Fire, Flying, Ice, and Poison-type moves');

DESCRIBE Types;

DROP TABLE IF EXISTS Pokemon_Types;
CREATE TABLE Pokemon_Types (
	pokedex_num int NOT NULL,
	typename varchar(255) NOT NULL,
	generation int NOT NULL,
	FOREIGN KEY (pokedex_num) REFERENCES Pokemon(pokedex_num) ON DELETE CASCADE,
	FOREIGN KEY (typename) REFERENCES Types(typename) ON DELETE CASCADE
);
INSERT INTO Pokemon_Types(pokedex_num, typename, generation)
VALUES (0278, 'Flying', 3),
(0278, 'Water', 3),
(0248, 'Rock', 2),
(0248, 'Dark', 2),
(074, 'Rock', 1),
(074, 'Ground', 1),
(059, 'Fire', 1),
(017, 'Flying', 1),
(017, 'Normal', 21),
(0025, 'Electric', 1);

DESCRIBE Pokemon_Types;

DROP TABLE IF EXISTS Cities;
CREATE TABLE Cities (
	cityname varchar(255) NOT NULL,
	attractions varchar(255) NOT NULL,
	PRIMARY KEY(cityname)
);
INSERT INTO Cities(cityname, attractions)
VALUES ('Pewter City', 'Pewter Museum of Science'),
('Lavaridge Town', 'Hot Springs'),
('Eterna City', 'The Cycle Shop');

DESCRIBE Cities;

DROP TABLE IF EXISTS GymLeaders;
CREATE TABLE GymLeaders (
	gymleaderno int AUTO_INCREMENT NOT NULL,
	gymleadername varchar(255) NOT NULL,
	cityname varchar(255) NOT NULL,
	typename varchar(255) NOT NULL,
	PRIMARY KEY(gymleaderno),
	FOREIGN KEY (typename) REFERENCES Types(typename) ON DELETE CASCADE
);
INSERT INTO GymLeaders(gymleaderno, gymleadername, cityname, typename)
VALUES (1, 'Brock', 'Pewter City', 'Rock'),
(8, 'Blaine', 'Cinnabar Island', 'Fire'),
(9, 'Falkner', 'Violet Gym', 'Flying');

DESCRIBE GymLeaders;

DROP TABLE IF EXISTS GymLeaders_Pokemon;
CREATE TABLE GymLeaders_Pokemon (
	pokedex_num int NOT NULL,
	gymleaderno int NOT NULL,
	levelcap int NOT NULL,
	FOREIGN KEY (pokedex_num) REFERENCES Pokemon(pokedex_num) ON DELETE CASCADE
);

INSERT INTO GymLeaders_Pokemon(pokedex_num, gymleaderno, levelcap)
VALUES (074, 1, 14),
(059, 8, 47),
(0017, 9, 13);

DESCRIBE GymLeaders_Pokemon;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;