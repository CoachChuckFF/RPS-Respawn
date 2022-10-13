#! /bin/bash


RPC=https://quiet-muddy-log.solana-mainnet.quiknode.pro/4fffdad3de6974646ada97e9a6941f6aa3c5fd8e/
# RPC=https://api.mainnet-beta.solana.com 
KEYPAIR=~/.config/solana/programs/rps.json
SUGAR_SHDW=3Sods1fRNiG1GSvAjXMfrh99XLe8wVN3JtAr4qA56F7Q

solana config set --url $RPC --keypair $KEYPAIR

# sugar deploy -r $RPC -k $KEYPAIR -l debug

# Cost Per Mint 0.0119812


sugar mint -r $RPC -k $KEYPAIR -n 1000

# while ! sugar mint -r $RPC -k $KEYPAIR -n 1000
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