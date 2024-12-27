-------------------------------------------------
-- Pokemon

-- Allows user to add Pokemon
INSERT INTO Pokemon (pokedex_num, pokname, ev_yield, ability)
VALUES(:pokedex_num_input, :pokname_input, :ev_yield_input, :ability_input)

-- Allows user to delete Pokemon
DELETE FROM Pokemon
WHERE pokedex_num = :pokedex_num_input

-- Allows user to update already established Pokemon
SELECT pokedex_num, pokname, ev_yield, ability 
FROM Pokemon 
WHERE pokedex_num = :pokedex_num_input

UPDATE Pokemon
	SET pokname = :pokname_input, 
		ev_yield = :ev_yield_input, 
		ability = :ability_input
	WHERE pokedex_num = :pokedex_num_input
		
-- Display Table
SELECT * FROM Pokemon

-------------------------------------------------
-- Types

INSERT INTO Types (typename, color, description)
VALUES(:typename_input, :color_input, :description_input)

SELECT typename FROM Types -- For the drop-down menu

DELETE FROM Types
WHERE typename = :typename_input

SELECT typename, color, description
FROM Types
WHERE typename = :typename_input

UPDATE Types
	SET color = :color_input,
		description = :description_input
	WHERE typename = :typename_input

SELECT * FROM Types

-------------------------------------------------
-- Pokemon_Types

INSERT INTO Pokemon_Types (pokedex_num, typename, generation)
VALUES(:pokedex_num_input, :typename_input, :generation_input)

DELETE FROM Pokemon_Types
WHERE pokedex_num = :pokedex_num_input
AND typename = :typename_input

SELECT pokedex_num, typename, generation
FROM Pokemon_Types
WHERE pokedex_num = :pokedex_num_input
AND typename = :typename_input

UPDATE Pokemon_Types
	SET typename = :typename_input,
		generation = :generation_input
	WHERE pokedex_num = :pokedex_num_input

SELECT * FROM Pokemon_Types

-------------------------------------------------
-- Cities

INSERT INTO Cities (cityname, attractions)
VALUES(:cityname_input, :attractions_input)

DELETE FROM Cities
WHERE cityname = :cityname_input

SELECT attractions
FROM Cities
WHERE cityname = :cityname_input

UPDATE Cities
	SET cityname = :cityname_input,
		attractions = :attractions_input
	WHERE cityname = :cityname_input

SELECT * FROM Cities

-------------------------------------------------
-- GymLeaders

INSERT INTO GymLeaders (gymleadername)
VALUES(:gymleadername_input)

SELECT cityname FROM Cities -- For drop-down menu
SELECT typename FROM Types

DELETE FROM GymLeaders
WHERE gymleaderno = :gymleaderno_input

SELECT gymleadername
FROM GymLeaders
WHERE gymleaderno = :gymleaderno_input

UPDATE GymLeaders
	SET gymleadername = :gymleadername_input
	WHERE gymleaderno = :gymleaderno_input

SELECT * FROM GymLeaders

-------------------------------------------------
-- GymLeaders_Pokemon

INSERT INTO GymLeaders_Pokemon (pokedex_num, gymleaderno, levelcap)
VALUES(:pokedex_num_input, :gymleaderno_input, :levelcap_input)

DELETE FROM GymLeaders_Pokemon
WHERE pokedex_num = :pokedex_num_input
AND gymleaderno = :gymleaderno_input

SELECT pokedex_num, gymleaderno, levelcap
FROM GymLeaders_Pokemon
WHERE pokedex_num = :pokedex_num_input
AND gymleaderno = :gymleaderno_input

UPDATE GymLeaders_Pokemon
	SET pokedex_num = :pokedex_num_input
		gymleaderno = :gymleaderno_input
		levelcap = :levelcap_input
	WHERE pokedex_num = :pokedex_num_input
	AND gymleaderno = :gymleaderno_input

SELECT * FROM GymLeaders_Pokemon