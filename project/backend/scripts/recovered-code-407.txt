const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\1451c98c-fbc6-44be-8f42-253cd51bf054\\.system_generated\\logs\\transcript_full.jsonl';

async function search() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (line.includes('realtime/places') && (line.includes('tool_calls') || line.includes('TargetContent') || line.includes('ReplacementContent'))) {
      console.log(`--- MATCH AT LINE ${index} ---`);
      try {
        const data = JSON.parse(line);
        // Print the whole tool call if it exists
        if (data.tool_calls) {
          data.tool_calls.forEach(tc => {
            console.log('Tool Name:', tc.name);
            if (tc.args) {
              console.log('Args TargetFile:', tc.args.TargetFile);
              if (tc.args.ReplacementContent) {
                console.log('ReplacementContent Length:', tc.args.ReplacementContent.length);
                fs.writeFileSync(path.join(__dirname, `recovered-code-${index}.txt`), tc.args.ReplacementContent);
                console.log(`Saved ReplacementContent to recovered-code-${index}.txt`);
              }
              if (tc.args.CodeContent) {
                console.log('CodeContent Length:', tc.args.CodeContent.length);
                fs.writeFileSync(path.join(__dirname, `recovered-code-${index}.txt`), tc.args.CodeContent);
                console.log(`Saved CodeContent to recovered-code-${index}.txt`);
              }
            }
          });
        }
      } catch (err) {
        console.error('JSON parse error:', err.message);
      }
    }
  }
}

search();
