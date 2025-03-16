type Accounts = {
    id: string,
    username: string,
    email: string,
    password: string,
    createdAt: number,
    irlEvent: number,
    telegram_id: string,
    discord_id: string,
    twitch_id: string,
    instagram_id: string
}

type User = {
    id: string,
    discord_id: string,
    username: string,
    email: string,
    password: string,
    createdAt: number,
    bio: string,
    birthday: number,
    igEvent: number,
    irlEvent: number,
    minecraftPseudoLink: string,
    vrchatPseudoLink: string,
    isWhitelisted: (boolean | number),
    xp: number,
    level: number,
    goldenpaw: number,
    greencoin: number,
    type: String
};

type Ticket = { // Type combinant ticket ET convention profiles car certains peuvent avoir les deux en requête avec les jointures
    id: string,
    status: number,
    ticket_level: number,
    purchase_date: number,
    validation_date: number,
    code: string,

    username: string,
    firstname: string,
    lastname: string,
    age: number,
    species: string,
    birthdate: number,
    address: string,
    postalCode: string,
    city: string,
    countryId: string,
    badgeCountryId: string,
    phone: string,
    tags: object,
    licencePlate: string,
    companyName: string,
    freeComment: string,
    priority: number
};

type Aggregator = Partial<User> | Partial<Ticket> | Partial<Accounts>

// Les types pour insérer update ou find en DB pour des recherches dynamiques
export enum Tables {
    PROFILES = 'convention_profiles',
    TICKETS = 'convention_tickets',
    USERS = 'users',
    ACCOUNTS = 'accounts'
};

export type { Accounts, User, Ticket, Aggregator };