import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(import.meta.dirname || '.', 'data/leaderboard.json');

function sortLeaderboard(entries) {
  return [...entries].sort((a, b) => {
    // 1. Primary: Correct Answers (DESC)
    const correctA = a.correctAnswers !== undefined ? a.correctAnswers : (a.totalCorrect || 0);
    const correctB = b.correctAnswers !== undefined ? b.correctAnswers : (b.totalCorrect || 0);
    if (correctB !== correctA) return correctB - correctA;

    // 2. Secondary: Total Score (DESC)
    const scoreA = a.totalScore !== undefined ? a.totalScore : (a.score || 0);
    const scoreB = b.totalScore !== undefined ? b.totalScore : (b.score || 0);
    if (scoreB !== scoreA) return scoreB - scoreA;

    // 3. Tertiary: Total Time Taken (ASC: lower is faster)
    const timeA = a.totalTimeSeconds !== undefined ? a.totalTimeSeconds : (a.timeTakenSeconds || 9999);
    const timeB = b.totalTimeSeconds !== undefined ? b.totalTimeSeconds : (b.timeTakenSeconds || 9999);
    return timeA - timeB;
  });
}

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return sortLeaderboard(parsed);
  } catch (err) {
    console.error('Error reading leaderboard file:', err);
    return [];
  }
}

function writeData(entries) {
  try {
    const sorted = sortLeaderboard(entries);
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(sorted, null, 2), 'utf8');
    return sorted;
  } catch (err) {
    console.error('Error writing leaderboard file:', err);
    return entries;
  }
}

function leaderboardApiPlugin() {
  return {
    name: 'vite-plugin-leaderboard-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        if (url === '/api/leaderboard') {
          // Public READ endpoint - open to everyone
          if (req.method === 'GET') {
            const data = readData();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(data));
            return;
          }

          // Protected WRITE endpoint - validates payload
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const submission = JSON.parse(body);

                // Strict Backend Payload Validation
                if (
                  !submission ||
                  typeof submission.name !== 'string' ||
                  !submission.name.trim() ||
                  typeof submission.correctAnswers !== 'number' ||
                  submission.correctAnswers < 0 ||
                  submission.correctAnswers > 15 ||
                  typeof submission.totalScore !== 'number' ||
                  submission.totalScore < 0 ||
                  submission.totalScore > 300 ||
                  !submission.attemptId
                ) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Invalid or tampered quiz submission payload' }));
                  return;
                }

                const currentData = readData();

                // Duplicate prevention via unique attemptId
                const exists = currentData.some((item) => item.attemptId === submission.attemptId);

                let updated;
                if (exists) {
                  updated = currentData;
                } else {
                  updated = writeData([...currentData, submission]);
                }

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(updated));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), leaderboardApiPlugin()],
});
