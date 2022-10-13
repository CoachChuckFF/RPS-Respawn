#! /bin/bash

solana config set --url https://quiet-muddy-log.solana-mainnet.quiknode.pro/4fffdad3de6974646ada97e9a6941f6aa3c5fd8e/ --keypair ~/.config/solana/programs/rps.json

RPC=https://quiet-muddy-log.solana-mainnet.quiknode.pro/4fffdad3de6974646ada97e9a6941f6aa3c5fd8e/
KEYPAIR=~/.config/solana/programs/rps.json
OLD_STORAGE_ACCOUNT=FT7Ecb6QYA94XCMpuxHeXiDDBCMDmzBzr7jxm4afrMpY
STORAGE_ACCOUNT=5HSufjcRXGqdQWFrKVW2tvnU6RBJ8LeFrtYebYm4yhZf
CANY=7uU1WSVirK5tMjJwWjkCWagwhnZaxmzdAuiGNouXcA2k
SUGAR=3Sods1fRNiG1GSvAjXMfrh99XLe8wVN3JtAr4qA56F7Q

# DELETE STORAGE
# shdw-drive delete-storage-account --rpc $RPC --keypair $KEYPAIR $OLD_STORAGE_ACCOUNT

# Create Storage Account ( 3Sods1fRNiG1GSvAjXMfrh99XLe8wVN3JtAr4qA56F7Q )
# shdw-drive create-storage-account --rpc $RPC --keypair $KEYPAIR --name RPS --size 8GB

# Get Storage accounts
# shdw-drive get-storage-account --rpc $RPC --keypair $KEYPAIR

# Upload Easter Egg
# shdw-drive upload-file --rpc $RPC --keypair $KEYPAIR --storage-account $STORAGE_ACCOUNT --file ./easter-egg.json

# Upload Test Files
# shdw-drive upload-multiple-files --rpc $RPC --keypair $KEYPAIR --storage-account $STORAGE_ACCOUNT --directory ./collection

# Upload until everything is uploaded
# while ! shdw-drive upload-multiple-files --rpc $RPC --keypair $KEYPAIR --storage-account $STORAGE_ACCOUNT --directory ./files-to-upload
# do
#     echo "Retrying in: "
#     sleep 1
#     echo "3"
#     sleep 1
#     echo "2"
#     sleep 1
#     echo "1"
#     sleep 1
# done