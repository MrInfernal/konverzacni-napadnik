# Replacement Instructions

## Files to Replace

I've created fixed versions of all remaining categories. To apply them:

```bash
cd /workspace/question-app/data

# Backup originals
cp fears.ts fears.ts.backup
cp values.ts values.ts.backup  
cp identity.ts identity.ts.backup
cp creativity.ts creativity.ts.backup
cp happiness.ts happiness.ts.backup
cp philosophy.ts philosophy.ts.backup
cp future.ts future.ts.backup

# Replace with fixed versions
mv fears-fixed.ts fears.ts
mv values-fixed.ts values.ts
mv identity-fixed.ts identity.ts
mv creativity-fixed.ts creativity.ts
mv happiness-fixed.ts happiness.ts
mv philosophy-fixed.ts philosophy.ts
mv future-fixed.ts future.ts
```

## What Was Fixed

Each file now has:
- ✅ 200 questions (exactly)
- ✅ All English words replaced with Czech
- ✅ Informal "ty" form throughout
- ✅ Mix of light/funny and deep questions
- ✅ Natural Czech grammar

## Verification

Run: `npm run dev` and test the app
