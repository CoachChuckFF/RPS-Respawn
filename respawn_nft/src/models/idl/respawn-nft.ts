export type RespawnNft = {
  "version": "0.1.0",
  "name": "respawn_nft",
  "instructions": [
    {
      "name": "createRespawnPoint",
      "accounts": [
        {
          "name": "respawnAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "respawnVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "shouldCheckName",
          "type": "u8"
        }
      ]
    },
    {
      "name": "respawn",
      "accounts": [
        {
          "name": "respawnAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimerCloneVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimerGenesisVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "respawnVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "respawnPointAccount",
      "docs": [
        "RespawnPointAccount",
        "PDA: genesis mint",
        ""
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "genesisMint",
            "type": "publicKey"
          },
          {
            "name": "cloneMint",
            "type": "publicKey"
          },
          {
            "name": "communityWallet",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadProgramAccount",
      "msg": "Could not find program account."
    },
    {
      "code": 6001,
      "name": "BumpDoesNotMatch",
      "msg": "Bump does not match account"
    },
    {
      "code": 6002,
      "name": "NameDoesNotMatch",
      "msg": "Metadata name does not match"
    }
  ]
};

export const IDL: RespawnNft = {
  "version": "0.1.0",
  "name": "respawn_nft",
  "instructions": [
    {
      "name": "createRespawnPoint",
      "accounts": [
        {
          "name": "respawnAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "respawnVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "shouldCheckName",
          "type": "u8"
        }
      ]
    },
    {
      "name": "respawn",
      "accounts": [
        {
          "name": "respawnAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimerCloneVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimerGenesisVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "respawnVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cloneMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "genesisMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "respawnPointAccount",
      "docs": [
        "RespawnPointAccount",
        "PDA: genesis mint",
        ""
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "genesisMint",
            "type": "publicKey"
          },
          {
            "name": "cloneMint",
            "type": "publicKey"
          },
          {
            "name": "communityWallet",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadProgramAccount",
      "msg": "Could not find program account."
    },
    {
      "code": 6001,
      "name": "BumpDoesNotMatch",
      "msg": "Bump does not match account"
    },
    {
      "code": 6002,
      "name": "NameDoesNotMatch",
      "msg": "Metadata name does not match"
    }
  ]
};
