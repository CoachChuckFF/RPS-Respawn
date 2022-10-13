#! /bin/bash

solana config set -u l
solana config set --keypair /Users/drkrueger/.config/solana/programs/rps.json

echo "Cleaning up Amman"
amman stop &> /dev/null
rm -rf .ledger &> /dev/null
rm -rf .amman &> /dev/null

amman start