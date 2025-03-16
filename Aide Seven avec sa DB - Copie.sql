CREATE TABLE audit_logs ( -- Pas sûr de le mettre
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id CHAR(36) NOT NULL,
    `action` ENUM('create','update','delete','status_change') NOT NULL,
    field_name VARCHAR(50) DEFAULT NULL,
    old_value TEXT DEFAULT NULL,
    new_value TEXT DEFAULT NULL,
    user_id CHAR(36) NOT NULL KEY,
    `timestamp` TIMESTAMP NULL DEFAULT current_timestamp(),
    ip_address VARCHAR(42) DEFAULT NULL
);

CREATE TABLE accounts (
    id CHAR(36) NOT NULL PRIMARY KEY, -- uuid
	username VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE KEY, -- Ce n'est plus la primary car il faut privilégier les valeurs statiques, mais j'ai mis un key pour l'indexer tout de même 
    password VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    member_type ENUM('regular','vip','partner','board') NOT NULL DEFAULT 'regular',
    telegram_id VARCHAR(50),
    discord_id VARCHAR(50),
    twitch_id VARCHAR(50),
    instagram_id VARCHAR(50),
    FOREIGN KEY (discord_id) REFERENCES users(id),
    FOREIGN KEY (twitch_id) REFERENCES twitch_users(id)
);

CREATE TABLE registration (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL KEY,
    convention_id CHAR(36) NOT NULL KEY,
    registration_status ENUM('accepted', 'waiting', 'refused') DEFAULT 'waiting',      -- Remplacer les DECIMAL par des ENUM ?  -- anciennement registration_status
    friends_group CHAR(36),          -- UUID du groupe d'amis
    global_payment_status ENUM('accepted', 'waiting', 'refused') DEFAULT 'waiting',          -- statut global de paiement
    badge_status ENUM('accepted', 'waiting', 'refused') DEFAULT 'waiting',                   -- statut du badge
    staff_member BOOLEAN DEFAULT false, -- Séparé dans une autre table pour afficher le grade de l'utilisateur
    vip_member BOOLEAN DEFAULT false,
    amount_due DECIMAL(10,0) DEFAULT 0,   -- montant dû restant à payer
    fursuit_lounge_access BOOLEAN DEFAULT false,
    fursuiter BOOLEAN DEFAULT false,
    first_convention BOOLEAN DEFAULT false,
    display_attendee BOOLEAN DEFAULT true,
    fursuit_number INT DEFAULT 0,          -- nombre de fursuit qu'il amène
    `priority` BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES convention_profiles(id),
    FOREIGN KEY (convention_id) REFERENCES conventions(id)
);

-- Table des utilisateurs (informations de base et d'inscription à la convention)
CREATE TABLE convention_profiles (
    id CHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    email_validation_status BOOLEAN DEFAULT false,        -- statut de validation de l'email
    age INT,                  -- jusqu'à 3 chiffres
    species VARCHAR(100),
    birthdate DATE,
    address VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    country_id CHAR(2),                 -- ex : FR, EN, etc.
    badge_country_id CHAR(2),
    tags JSON,
    licence_plate VARCHAR(20),
    company_name VARCHAR(100),
    free_comment TEXT,
    FOREIGN KEY (id) REFERENCES accounts(id)
);

-- Table des conventions
CREATE TABLE conventions (
    id CHAR(36) NOT NULL PRIMARY KEY,  -- identifiant de la convention
    name VARCHAR(50) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,             -- date de début
    end_date DATE NOT NULL,               -- date de fin
    max_people INT NOT NULL               -- nombre maximum de personnes
);

-- Catalogue des produits disponibles en boutique(colonnes convention_id et stock retirées)
CREATE TABLE purchased_products ( -- Non lié à un ticket car il peut demander le remboursement avant une certaine date et à ce moment là on initie nous même le remboursement et le retrait de l'article de son compte
    id CHAR(36) NOT NULL PRIMARY KEY,  
    product_id CHAR(36) NOT NULL KEY,  -- identifiant du produit
    user_id CHAR(36) NOT NULL KEY,
    name VARCHAR(100) NOT NULL,           -- nom du produit
    price DECIMAL(10,2) NOT NULL,         -- prix du produit
    quantity INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES accounts(id)
);

-- Catalogue des produits disponibles en boutique(colonnes convention_id et stock retirées)
CREATE TABLE products (
    id CHAR(36) NOT NULL PRIMARY KEY,  -- identifiant du produit
    convention_id CHAR(36) NOT NULL KEY,
    name VARCHAR(100) NOT NULL,           -- nom du produit
    price DECIMAL(10,2) NOT NULL,         -- prix du produit
    stock INT NOT NULL,
     -- purchase_quantity DECIMAL(10,2) NOT NULL, à quoi ça sert ?
    active BOOLEAN DEFAULT true,           -- Produit actif ?
    FOREIGN KEY (convention_id) REFERENCES conventions(id)
);

-- Table des tickets avec les colonnes supplémentaires
CREATE TABLE tickets (
    id CHAR(36) NOT NULL PRIMARY KEY, 
    user_id CHAR(36) NOT NULL KEY, -- identifiant du user
    convention_id CHAR(36) NOT NULL KEY,     -- identifiant de la convention
    status ENUM('accepted', 'refused', 'pending', 'used') NOT NULL DEFAULT 'pending',  -- status du ticket (ex: accepté, refusé, etc.) -- Remplacer par une enum
    -- Passer le status en 4 ou 0 ou autre à la fin de la convention pour le marquer comme utilisé ou expiré
    ticket_level ENUM('standard', 'sponsor', 'sponsor+') NOT NULL DEFAULT 'standard',              -- niveau du ticket
    purchase_date TIMESTAMP NOT NULL DEFAULT current_timestamp(),          -- date d'achat (timestamp) (pour la liste des attendees, ne pas associer la position à la réservation, l'associer après les register en classant du plus petit au plus grand la purchase_date)
    validation_date TIMESTAMP DEFAULT NULL,                 -- date de validation (timestamp)
    code CHAR(8) NOT NULL UNIQUE KEY,  -- code du ticket > 5 ou 6 caractères aléatoires
    badge_number INT NOT NULL UNIQUE AUTO_INCREMENT,           -- position du ticket
    FOREIGN KEY (user_id) REFERENCES accounts(id),
    FOREIGN KEY (convention_id) REFERENCES conventions(id)
);

-- Table des staffs liant un utilisateur à une convention avec son niveau d'accès
CREATE TABLE staffs (   
    user_id CHAR(36) NOT NULL, -- référence à convention_profiles(id)
    convention_id CHAR(36) NOT NULL,   -- référence à conventions(id)
    access_level ENUM('BOARD', 'SAFETY', 'CONOPS', 'COLLABORATOR') NOT NULL DEFAULT 'COLLABORATOR',      -- niveau d'accès (ex: safety, collaborator, etc.)
    expiration DATE NOT NULL,
    PRIMARY KEY (user_id, convention_id),
    FOREIGN KEY (user_id) REFERENCES convention_profiles(id),
    FOREIGN KEY (convention_id) REFERENCES conventions(id)
);

-- Table des factures
CREATE TABLE invoices (
    id CHAR(36) NOT NULL PRIMARY KEY,      -- identifiant de la facture
    user_id CHAR(36) NOT NULL KEY,             -- id de l'utilisateur lié à la facture
    products JSON,                           -- JSON array d'objets => { name, price, quantity }
    vat DECIMAL(5,2) NOT NULL,                -- taux de TVA de la facture
    amount_to_pay DECIMAL(10,2) NOT NULL,       -- montant total à régler par l'utilisateur
    FOREIGN KEY (user_id) REFERENCES accounts(id)
);

-- Table des paiements
CREATE TABLE payments (
    id CHAR(36) NOT NULL,      -- identifiant du paiement
    user_id CHAR(36) NOT NULL KEY,
    payment_date TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    method VARCHAR(50) NOT NULL,
    invoice_id CHAR(36) NOT NULL KEY,          -- référence à la facture liée
    amount DECIMAL(5,2) NOT NULL,            -- montant du paiement
    status enum('completed','pending','failed','refunded') DEFAULT 'completed',
    PRIMARY KEY (user_id, invoice_id),
    FOREIGN KEY (user_id) REFERENCES accounts(id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

CREATE TABLE events (
    id CHAR(36) NOT NULL PRIMARY KEY, -- Remplacer par CHAR pour les uuid
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location_id CHAR(36) NULL KEY, -- J'autorise les valeurs NULL ici
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    max_capacity INT DEFAULT NULL,
    is_members_only BOOLEAN DEFAULT false,
    status enum('draft','published','cancelled','completed') DEFAULT 'draft',
    created_at TIMESTAMP NULL DEFAULT current_timestamp(),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

CREATE TABLE events_attended (
    id CHAR(36) PRIMARY KEY,
    account_id CHAR(36) NOT NULL KEY,
    event_id CHAR(36) NOT NULL KEY,
    event_name VARCHAR(100) NOT NULL, -- Nom de l'événement
    event_date DATE NOT NULL, -- Timestamp de l'événement
    location VARCHAR(255),
    is_attended BOOLEAN DEFAULT true, -- Indique si la personne a participé
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

CREATE TABLE locations (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country_id CHAR(2) NOT NULL,
    capacity INT,
    created_at TIMESTAMP NULL DEFAULT current_timestamp()
);

CREATE TABLE membership_payments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  membership_id CHAR(36) NOT NULL KEY,
  amount DECIMAL(5,2) NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  payment_method CHAR(50) NOT NULL,
  transaction_ref VARCHAR(100) DEFAULT NULL,
  status enum('completed','pending','failed','refunded') DEFAULT 'completed',
  FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE
);

CREATE TABLE membership_plans (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  period enum('monthly','annual') NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  benefits LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  is_active BOOLEAN DEFAULT true
);

-- Table des adhésions
CREATE TABLE memberships (
  id CHAR(36) NOT NULL PRIMARY KEY,
  member_id CHAR(36) NOT NULL KEY,
  plan_id CHAR(36) NOT NULL KEY,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status enum('active','expired','cancelled') DEFAULT 'active',
  discount_applied DECIMAL(5,2) DEFAULT 0.00,
  auto_renew BOOLEAN DEFAULT true,
  FOREIGN KEY (member_id) REFERENCES accounts(id),
  FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE CASCADE
);

CREATE TABLE users ( -- Utilisateurs Discord
    id CHAR(36) PRIMARY KEY, -- remplacer ceci par un uuid et mettre un second champ avec l'id discord pour pouvoir rechercher également
    discord_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    bio VARCHAR(62),
    birthday DATE NULL,
    igEvent INT NOT NULL DEFAULT 0,
    irlEvent INT NOT NULL DEFAULT 0,
    minecraftPseudoLink VARCHAR(100) NULL,
    vrchatPseudoLink VARCHAR(100) NULL,
    isWhitelisted BOOLEAN DEFAULT false,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    goldenpaw INT DEFAULT 0,
    greencoin INT DEFAULT 0
);