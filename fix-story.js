const fs = require('fs');
let code = fs.readFileSync('src/components/StoryScene.tsx', 'utf-8');
code = code.replace('let latestScores =', 'const latestScores =');
fs.writeFileSync('src/components/StoryScene.tsx', code);
