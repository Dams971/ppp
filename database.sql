
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY, -- remplacer ceci par un uuid et mettre un second champ avec l'id discord pour pouvoir rechercher également
    discord_id VARCHAR(50),
    createdAt BIGINT NOT NULL,
    bio VARCHAR(62),
    birthday BIGINT,
    igEvent DECIMAL(4, 0) DEFAULT 0,
    irlEvent DECIMAL(4, 0) DEFAULT 0,
    minecraftPseudoLink VARCHAR(100),
    vrchatPseudoLink VARCHAR(100),
    isWhitelisted BOOLEAN DEFAULT false,
    xp DECIMAL(10, 0) DEFAULT 0,
    level DECIMAL(10, 0) DEFAULT 1,
    goldenpaw DECIMAL(10, 0) DEFAULT 0,
    greencoin DECIMAL(10, 0) DEFAULT 0
);

CREATE TABLE irl_events (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL, -- Discord ID ou null si non lié
    account_id VARCHAR(255), -- UUID du compte web ou null si non lié
    event_name VARCHAR(100) NOT NULL, -- Nom de l'événement
    event_date BIGINT NOT NULL, -- Timestamp de l'événement
    location VARCHAR(255),
    is_attended BOOLEAN DEFAULT true, -- Indique si la personne a participé
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE convention_profiles (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    status INT NOT NULL,  -- REGISTERED, BLOCKED, ....
    friends_group VARCHAR(50), -- UUID du friends group --
    username VARCHAR(100) NOT NULL,
    firstname VARCHAR(50), -- Figurant sur la CNI
    lastname VARCHAR(50),
    age DECIMAL(2, 0),
    species VARCHAR(100), -- Menu déroulant
    birthdate DATE, 
    address VARCHAR(255), -- Penser à rédiger le RGPD
    postalCode VARCHAR(10),
    city VARCHAR(100),
    countryId CHAR(2), -- FR / EN / Etc
    badgeCountryId CHAR(2), -- étudier ce que ça pourrait être ?
    phone VARCHAR(20),
    tags JSON,
    licencePlate VARCHAR(20),
    companyName VARCHAR(100),
    freeComment TEXT,
    `priority` DECIMAL(1, 0) DEFAULT 0,
    FOREIGN KEY (id) REFERENCES accounts(id)
);

CREATE TABLE convention_tickets (
    id VARCHAR(50) PRIMARY KEY,
    status INT NOT NULL DEFAULT 1,  -- PAID, WAITING, ....
    ticket_level INT NOT NULL,
    purchase_date BIGINT NOT NULL,
    validation_date BIGINT,
    code VARCHAR(255) NOT NULL,
    position VARCHAR(5) NOT NULL,
    FOREIGN KEY (id) REFERENCES convention_profiles(id)
);

-- Seven
INSERT INTO convention_tickets (
    id,
    status,
    ticket_level,
    purchase_date,
    validation_date,
    code
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    1,
    2,
    1696070400
);

INSERT INTO convention_profiles (
    id,
    status,
    friends_group,
    username,
    firstname,
    lastname,
    age,
    species,
    birthdate,
    address,
    postalCode,
    city,
    countryId,
    badgeCountryId,
    phone,
    tags,
    licencePlate,
    companyName,
    freeComment,
    `priority`
) VALUES (
    '570d085a-2472-4200-8524-02a9e2d8a4e1', -- UUID de l'utilisateur
    1,                                      -- Status (par exemple "REGISTERED")
    'f9b8f001-a111-41d4-bf33-335d74ff0001',  -- UUID du groupe d'amis
    'Seven',                              -- Nom d'utilisateur
    'K',                                 -- Prénom figurant sur la CNI
    'P',                                  -- Nom
    21,                                     -- Âge
    'Hyène',                               -- Espèce (menu déroulant)
    '1993-09-22',                           -- Date de naissance (AAAA-MM-JJ)
    '123 Rue de Exemple',                   -- Adresse
    '75001',                                -- Code postal
    'Paris',                                -- Ville
    'FR',                                   -- Pays (France)
    'FR',                                   -- Pays sur le badge (France)
    '+33612345678',                         -- Téléphone
    '["tag1", "tag2", "tag3"]',             -- Tags (au format JSON)
    'AB-123-CD',                            -- Plaque d'immatriculation
    'FurAgora',                      -- Nom de la compagnie
    'Aucun commentaire particulier',        -- Commentaire libre
    1                                       -- Priorité (par défaut 0, ici 1)
);

{
    "profileId": "f6ac6b74-4ae2-49d8-8e80-4fb246e4d0c4",
    "status": "REGISTERED",
    "badge": 0,
    "username": "Nevels Arcania",
    "firstname": "Kylian",
    "lastname": "Parent",
    "species": "Spotted Hyena Hybrid",
    "birthdate": "2002-12-07",
    "address": "200 Impasse du pont Romain",
    "postalCode": "83210",
    "city": "Solliès-Toucas",
    "countryId": "FR",
    "badgeCountryId": null,
    "phone": "+33 6 34 07 36 65",
    "tshirtSize": "M",
    "tags": [
        "GIFT_LOTTERY",
        "CGU_ACCEPTED"
    ],
    "tagsSecured": [],
    "languageIds": [
        "FR"
    ],
    "donation": 0,
    "freeComment": "",
    "licencePlate": "",
    "companyName": "",
}