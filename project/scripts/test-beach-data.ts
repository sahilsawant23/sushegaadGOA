import { goaBeaches } from '../src/data/beachesData';

console.log(`Total beaches: ${goaBeaches.length}`);
goaBeaches.forEach(b => {
    console.log(`ID: "${b.id}", Name: "${b.name}"`);
    if (b.id !== b.id.toLowerCase()) {
        console.warn(`WARNING: Highcase ID found: ${b.id}`);
    }
    if (b.id.includes(' ')) {
        console.warn(`WARNING: Space in ID found: ${b.id}`);
    }
});
