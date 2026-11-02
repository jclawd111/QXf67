#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ledger="${QSAFE_LOCAL_LEDGER:-.local-validator}"
# The program loads at a fixed TEST-ONLY address, the same one used by
# fixtures/qsafe-v3.json. It needs no program keypair.
if [[ ! -f target/deploy/qsafe3.so ]]; then
  cargo-build-sbf --manifest-path programs/qsafe3/Cargo.toml --sbf-out-dir target/deploy
fi
exec solana-test-validator --ledger "$ledger" --rpc-port 19099 --faucet-port 19900 --gossip-port 19102 --dynamic-port-range 19110-19160 --bind-address 127.0.0.1 --bpf-program k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn target/deploy/qsafe3.so
