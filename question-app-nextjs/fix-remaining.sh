#!/bin/bash
# This script will be used to verify counts after manual fixes
echo "Current question counts:"
for file in data/fears.ts data/values.ts data/identity.ts data/creativity.ts data/happiness.ts data/philosophy.ts data/future.ts; do
    count=$(grep -c '^ *"' "$file")
    echo "$(basename $file): $count questions"
done
