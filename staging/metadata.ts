import { PublicKey } from "@solana/web3.js";

export const CHARITY_ADDRESS = new PublicKey(
    "Cm5u3C2UjGuBM9hghJnLtbikVbXtUsjB6NxV71qh6qLc"
);
export const CHARITY_SHARE = 5;

export const DAO_ADDRESS = new PublicKey(
    "CCoW7SiRuP336wRJv6UD4KSooUaL6Yux6tbQ6rdPF3Q2"
);
export const DAO_SHARE = 40;

export const CORE_V2_ADDRESS = new PublicKey(
    "EYGggnZhpp8rKT1gzHQzH2m4pucN1XCJs76RdUP5EAzS"
);
export const CORE_V2_SHARE = 40;

export const CORE_ADDRESS = new PublicKey(
    "AASpTB4NBVHDiS9M4wb2axFL5CVw11FUG89KDrvKLF66"
);
export const CORE_SHARE = 15;

export const SELLER_FEE_BASIS_POINTS = 750;
export const COLLECTION_NAME = "Red Panda Squad";
export const COLLECTION_FAMILY = "Red Panda Squad";
export const SYMBOL = "REDPANDA";
export const URL_BASE =
    "https://shdw-drive.genesysgo.net/5HSufjcRXGqdQWFrKVW2tvnU6RBJ8LeFrtYebYm4yhZf/";

export const COLLECTION_KEY = new PublicKey(
    "mm7NnA4kT1EQPT25Ke1zxc4cr2gd3f7EbTM7RKxYqiE"
);

export const COLLECTION = {
    name: COLLECTION_NAME,
    family: COLLECTION_FAMILY,
} as RPSCollection;
export const CREATORS_KEYS = [
    {
        address: CHARITY_ADDRESS,
        share: CHARITY_SHARE,
    },
    {
        address: DAO_ADDRESS,
        share: DAO_SHARE,
    },
    {
        address: CORE_V2_ADDRESS,
        share: CORE_V2_SHARE,
    },
    {
        address: CORE_ADDRESS,
        share: CORE_SHARE,
    },
];
export const CREATORS = [
    {
        address: CHARITY_ADDRESS.toString(),
        share: CHARITY_SHARE,
    },
    {
        address: DAO_ADDRESS.toString(),
        share: DAO_SHARE,
    },
    {
        address: CORE_V2_ADDRESS.toString(),
        share: CORE_V2_SHARE,
    },
    {
        address: CORE_ADDRESS.toString(),
        share: CORE_SHARE,
    },
] as RPSCreator[];

export interface RPSAtrributes {
    trait_type: string;
    value: string;
}
export interface RPSCollection {
    name: string;
    family: string;
}

export interface RPSFile {
    uri: string;
    type: string;
}
export interface RPSCreator {
    address: string;
    share: number;
}
export interface RPSMetadata {
    name: string;
    symbol: string;
    description: string;
    seller_fee_basis_points: number;
    image: string;
    external_url: string;
    attributes: RPSAtrributes[];
    collection: RPSCollection;
    properties: {
        category: string;
        files: RPSFile[];
        creators: RPSCreator[];
    };
}
