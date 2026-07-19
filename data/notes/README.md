# Notes

Drop your `.txt` files (sample questions, notes) in this folder, then run:

```
npm run build-index
```

This embeds every file with Gemini and writes `data/index.json`, which the
chat route (`app/api/chat/route.ts`) uses to retrieve relevant context for
each question. Re-run the command whenever you add or change files.
