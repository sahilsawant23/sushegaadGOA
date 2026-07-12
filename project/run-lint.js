try {
    const { execSync } = require('child_process');
    execSync('npx eslint .', { stdio: 'inherit' });
} catch (error) {
    console.log('Error output captured via node script');
}
