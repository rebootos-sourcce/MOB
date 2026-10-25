#!/bin/sh
# Run the gift bank validator from Reboot-OS branch feat/p0-gift-bank-validator-20261014,
# unchanged, on one folder that holds banks/, schema.json and mapping.json, and save
# its three outputs beside them, as the anxiety run did.
#
# usage: run_validator.sh REBOOT_OS_CLONE FOLDER
# The validator is read out of git, never copied by hand, and its SHA-256 is printed
# so a reader can match it against `git show` of the branch.
set -u
RO="$1"; D="$2"
V="$(mktemp -d)/validate_gift_banks.py"
git -C "$RO" show origin/feat/p0-gift-bank-validator-20261014:atuned/test/tools/validate_gift_banks.py > "$V"
echo "validator $(git -C "$RO" rev-parse origin/feat/p0-gift-bank-validator-20261014) sha256 $(sha256sum "$V" | cut -d' ' -f1)"
python3 -I "$V" --directory "$D/banks" --schema "$D/schema.json" --mapping "$D/mapping.json" \
  > "$D/validator-run-2026-10-16.stdout.json" 2> "$D/validator-run-2026-10-16.stderr.txt"
echo "exit $?" > "$D/validator-run-2026-10-16.exit.txt"
cat "$D/validator-run-2026-10-16.exit.txt" "$D/validator-run-2026-10-16.stderr.txt"
