Si tu veux que je démocratise le LINK_ dans ta db tu me dis

- Séparation des tickets (si l'utilisateur prévois d'aller à deux conventions différentes, mais futur-proof si tu changes d'avis, il pourras avoir plusieurs tickets pour une même convention)
- Renommage des noms des clés pour quelque chose d'harmonieux
- Un staff peut avoir un niveau d'accès différent suivant la convention
- Utilisation des LINK_ pour les liaisons plus complexes "many-to-many" avec suppression en cascade (meilleurs en performances que d'utiliser du JSON pour faire ce type de liaisons)














































changelogs fait par chatgpt plus détaillé

- **Structure et modularité globale :**
  - **Première version :** Deux tables principales (« convention_profiles » et « convention_tickets ») avec une relation simple.
  - **Dernière version :** Schéma entièrement remanié en plusieurs tables distinctes (users, conventions, products, tickets, staffs, specs, unknown_persons, invoices, payments) avec plusieurs tables de liaison pour gérer les relations many-to-many.

- **Nommage et conventions :**
  - **Première version :** Nommage en camelCase (ex. « firstname », « postalCode », « countryId »).
  - **Dernière version :** Passage au snake_case (ex. « first_name », « postal_code », « country_id ») et renommage des tables (ex. « base_user » → « users »).

- **Évolution des entités utilisateurs et tickets :**
  - **Première version :** Les informations utilisateur et d’inscription à la convention sont dans « convention_profiles », et les tickets sont liés directement à cette table.
  - **Dernière version :** Séparation nette entre les informations de base de l’utilisateur dans « users » et les informations de ticket dans « tickets », avec l’ajout de colonnes supplémentaires (ticket_level, purchase_date, validation_date, code, position) et des statuts supplémentaires.

- **Ajouts fonctionnels et nouveaux modules :**
  - **Première version :** Absence de gestion des produits, paiements, factures, staffs ou spécifications.
  - **Dernière version :**
    - Ajout d’un module de gestion des produits avec prix.
    - Ajout de factures (invoices) et paiements (payments) pour gérer le paiement et la TVA.
    - Intégration d’un système de staffs pour associer des utilisateurs à des conventions avec des niveaux d’accès.
    - Création d’un catalogue de specs et d’une table unknown_persons pour gérer l’invitation de personnes sans compte.
    - Utilisation de tables de liaison (LINK_tickets__specs, LINK_tickets__products, LINK_conventions__products, LINK_tickets__unknown_persons) avec contraintes ON DELETE CASCADE pour assurer l’intégrité référentielle.

- **Amélioration des fonctionnalités de paiement et de validation :**
  - **Première version :** Aucune information sur le paiement ou le suivi financier.
  - **Dernière version :** Ajout de colonnes dans « users » pour le montant dû, le statut de validation de l’email, le statut global de paiement et le badge, ainsi que la gestion des factures et paiements.

Ce changelog compare directement la première version (simple et minimaliste) avec la dernière version (complexe, modulaire et riche en fonctionnalités).
























































-- Table des utilisateurs (informations de base et d'inscription à la convention)
CREATE TABLE users (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    email_validation_status INT,        -- statut de validation de l'email
    global_payment_status INT,          -- statut global de paiement
    badge_status INT,                   -- statut du badge
    amount_due DECIMAL(10,2) DEFAULT 0,   -- montant dû restant à payer
    -- Infos d'inscription à la convention
    status INT,                         -- anciennement registration_status
    friends_group VARCHAR(50),          -- UUID du groupe d'amis
    age DECIMAL(3, 0),                  -- jusqu'à 3 chiffres
    species VARCHAR(100),
    birth_date DATE,
    address VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    country_id CHAR(2),                 -- ex : FR, EN, etc.
    badge_country_id CHAR(2),
    tags JSON,
    licence_plate VARCHAR(20),
    company_name VARCHAR(100),
    free_comment TEXT,
    priority DECIMAL(1, 0) DEFAULT 0,
    fursuit_number VARCHAR(50)          -- numéro de fursuit lors de l'enregistrement
);

-- Table des conventions
CREATE TABLE conventions (
    id VARCHAR(50) NOT NULL PRIMARY KEY,  -- identifiant de la convention
    start_date DATE NOT NULL,             -- date de début
    end_date DATE NOT NULL,               -- date de fin
    max_people INT NOT NULL               -- nombre maximum de personnes
);

-- Catalogue des produits (colonnes convention_id et stock retirées)
CREATE TABLE products (
    id VARCHAR(50) NOT NULL PRIMARY KEY,  -- identifiant du produit
    name VARCHAR(100) NOT NULL,           -- nom du produit
    price DECIMAL(10,2) NOT NULL          -- prix du produit
);

-- Table des tickets avec les colonnes supplémentaires
CREATE TABLE tickets (
    id VARCHAR(50) NOT NULL PRIMARY KEY,   -- identifiant du ticket
    user_id VARCHAR(50) NOT NULL,           -- référence à users(id)
    convention_id VARCHAR(50) NOT NULL,     -- identifiant de la convention
    status VARCHAR(50) NOT NULL,            -- status du ticket (ex: accepté, refusé, etc.)
    is_unknown_person BOOLEAN NOT NULL DEFAULT FALSE,  -- vrai si le ticket concerne une personne invitée.
                                                         -- Futur-proof : pour inviter des personnes sans compte, il suffira d'ajouter une table unknown_persons avec un LINK (tickets.id -- unknown_persons.id)
    ticket_level INT NOT NULL,              -- niveau du ticket
    purchase_date BIGINT NOT NULL,          -- date d'achat (timestamp)
    validation_date BIGINT,                 -- date de validation (timestamp)
    code VARCHAR(255) NOT NULL,             -- code du ticket
    position VARCHAR(5) NOT NULL,           -- position du ticket
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (convention_id) REFERENCES conventions(id)
);

-- Table des staffs liant un utilisateur à une convention avec son niveau d'accès
CREATE TABLE staffs (
    user_id VARCHAR(50) NOT NULL,         -- référence à users(id)
    convention_id VARCHAR(50) NOT NULL,   -- référence à conventions(id)
    access_level VARCHAR(50) NOT NULL,      -- niveau d'accès (ex: safety, collaborator, etc.)
    PRIMARY KEY (user_id, convention_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (convention_id) REFERENCES conventions(id)
);

-- Catalogue des specs
CREATE TABLE specs (
    id VARCHAR(50) NOT NULL PRIMARY KEY,  -- identifiant de la spec
    name VARCHAR(100) NOT NULL            -- nom de la spec
);

-- Table des personnes inconnues (pour invitation de personnes sans compte)
CREATE TABLE unknown_persons (
    id VARCHAR(50) NOT NULL PRIMARY KEY
    -- Ajouter d'autres colonnes si nécessaire (ex. : nom, email, etc.)
);

-- Table des factures
CREATE TABLE invoices (
    id VARCHAR(50) NOT NULL PRIMARY KEY,      -- identifiant de la facture
    user_id VARCHAR(50) NOT NULL,             -- id de l'utilisateur lié à la facture
    products JSON,                           -- JSON array d'objets => { name, price, quantity }
    vat DECIMAL(5,2) NOT NULL,                -- taux de TVA de la facture
    amount_to_pay DECIMAL(10,2) NOT NULL,       -- montant total à régler par l'utilisateur
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des paiements
CREATE TABLE payments (
    id VARCHAR(50) NOT NULL PRIMARY KEY,      -- identifiant du paiement
    invoice_id VARCHAR(50) NOT NULL,          -- référence à la facture liée
    amount DECIMAL(10,2) NOT NULL,            -- montant du paiement
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- TABLES DE LIAISON SIMPLIFIEES

-- Lien entre tickets et specs (un ticket peut avoir plusieurs specs choisies)
CREATE TABLE LINK_tickets__specs (
    ticket_id VARCHAR(50) NOT NULL,       -- référence à tickets(id)
    specs_id VARCHAR(50) NOT NULL,        -- référence à specs(id)
    PRIMARY KEY (ticket_id, specs_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (specs_id) REFERENCES specs(id) ON DELETE CASCADE
);

-- Lien entre tickets et produits (un ticket peut concerner plusieurs produits)
-- Ajout de la quantité choisie par l'utilisateur pour chaque produit
CREATE TABLE LINK_tickets__products (
    ticket_id VARCHAR(50) NOT NULL,       -- référence à tickets(id)
    product_id VARCHAR(50) NOT NULL,      -- référence à products(id)
    quantity INT NOT NULL,                -- quantité du produit choisi par l'utilisateur
    PRIMARY KEY (ticket_id, product_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Lien entre conventions et produits (association des produits autorisés à une convention)
-- avec la gestion du stock disponible pour chaque produit
CREATE TABLE LINK_conventions__products (
    product_id VARCHAR(50) NOT NULL,       -- référence à products(id)
    convention_id VARCHAR(50) NOT NULL,    -- référence à conventions(id)
    stock INT NOT NULL,                    -- stock du produit pour cette convention
    PRIMARY KEY (product_id, convention_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (convention_id) REFERENCES conventions(id) ON DELETE CASCADE
);

-- Lien entre tickets et unknown_persons (futur-proof)
CREATE TABLE LINK_tickets__unknown_persons (
    ticket_id VARCHAR(50) NOT NULL,         -- référence à tickets(id)
    unknown_person_id VARCHAR(50) NOT NULL,   -- référence à unknown_persons(id)
    PRIMARY KEY (ticket_id, unknown_person_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (unknown_person_id) REFERENCES unknown_persons(id) ON DELETE CASCADE
);