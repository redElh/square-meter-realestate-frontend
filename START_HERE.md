# 🚀 START CHROMADB - IMPORTANT!

## You MUST run ChromaDB in a separate terminal window

### Option 1 (Recommended) - Double-click this file:
```
START_CHROMADB.bat
```

### Option 2 - Run in a NEW terminal:
```cmd
cd C:\Users\u\square-meter-realestate\frontend
chroma run --host localhost --port 8000 --path ./chroma
```

### KEEP THAT TERMINAL OPEN!

The ChromaDB server MUST stay running for the AI Assistant to work.

---

## After ChromaDB is running, test it:

Open a NEW terminal and run:
```
node test-query-flow.js
```

You should see: ✅ Query completed in ~70ms

---

## Then refresh your browser:

Press **Ctrl + Shift + R** to reload the page with the new code.

The AI Assistant will now work perfectly!
