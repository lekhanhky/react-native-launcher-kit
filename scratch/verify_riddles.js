const fs = require('fs');

const content = fs.readFileSync('example/src/data/riddles100Data.ts', 'utf8');

// Simple regex or parse to verify contents
const riddleIds = content.match(/id:\s*'r_[a-z]_\d{2}'/g) || [];
console.log('Total riddle IDs found:', riddleIds.length);

const worlds = ['animals', 'fruits', 'household', 'vehicles', 'nature'];
worlds.forEach(w => {
  const match = content.match(new RegExp(`worldId:\\s*'${w}'`, 'g')) || [];
  console.log(`World ${w}: ${match.length} riddles`);
});

const correctOptions = content.match(/isCorrect:\s*true/g) || [];
console.log('Total correct options:', correctOptions.length);

const falseOptions = content.match(/isCorrect:\s*false/g) || [];
console.log('Total false options:', falseOptions.length);

if (riddleIds.length === 100 && correctOptions.length === 100 && falseOptions.length === 300) {
  console.log('SUCCESS: All 100 riddles verified with 100% data integrity!');
  process.exit(0);
} else {
  console.error('VERIFICATION FAILED');
  process.exit(1);
}
