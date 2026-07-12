import { BlogPost } from '../types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Best Time to Visit Goa: A Comprehensive Guide',
    excerpt: 'Discover the perfect time to visit Goa based on weather, festivals, and your preferences. From the vibrant peak season to the serene monsoon, find your ideal Goan experience.',
    content: `
      <p class="lead">Goa, the party capital of India, is a year-round destination, but the experience changes drastically with the seasons. Whether you're looking for sun-kissed beaches, vibrant nightlife, or lush green landscapes, timing your visit is key.</p>

      <h3>Peak Season: November to February</h3>
      <p>This is undoubtedly the most popular time to visit Goa. The weather is pleasant, with cool breezes and clear skies. Temperatures range between 20°C and 30°C, making it perfect for beach hopping and water sports.</p>
      <ul>
        <li><strong>Vibe:</strong> Energetic, crowded, and festive.</li>
        <li><strong>Events:</strong> Sunburn Festival, Christmas and New Year celebrations, Goa Carnival (February).</li>
        <li><strong>Prices:</strong> Expect premium rates for flights and accommodation.</li>
      </ul>

      <h3>Shoulder Season: March to May</h3>
      <p>As the temperature starts to rise, the crowds thin out. This is a great time for budget travelers who can tolerate the heat. The sea is still calm enough for swimming, and you can enjoy the beaches without the hustle.</p>
      <ul>
        <li><strong>Vibe:</strong> Relaxed and laid-back.</li>
        <li><strong>Tip:</strong> Carry plenty of sunscreen and stay hydrated. Afternoon siestas are a must!</li>
      </ul>

      <h3>Monsoon Season: June to September</h3>
      <p>Goa transforms into a lush green paradise during the monsoons. While swimming is generally unsafe due to rough seas, this is the best time for nature lovers.</p>
      <ul>
        <li><strong>Highlights:</strong> Dudhsagar Waterfalls in full glory, spice plantation tours, and vibrant festivals like Sao Joao.</li>
        <li><strong>Vibe:</strong> Romantic, peaceful, and rejuvenating.</li>
      </ul>

      <h3>Conclusion</h3>
      <p>There is no "wrong" time to visit Goa; it all depends on what you seek. For parties, choose December. For relaxation, choose March. For nature, choose July.</p>
    `,
    author: 'Sarah Jenkins',
    publishDate: new Date('2024-01-15'),
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
    category: 'Travel Tips',
    tags: ['weather', 'planning', 'seasons', 'festivals']
  },
  {
    id: '2',
    title: 'Top 10 Hidden Beaches in South Goa',
    excerpt: 'Escape the crowds and discover South Goa\'s pristine, secret beaches. A guide to the most secluded spots for tranquility and untouched beauty.',
    content: `
      <p class="lead">While North Goa is famous for its nightlife, South Goa is the soul of the state, offering serenity and pristine coastline. Beyond the popular Palolem and Colva, there are hidden gems waiting to be explored.</p>

      <h3>1. Kakolem Beach (Tiger Beach)</h3>
      <p>Hidden in a bay, this beach is a nightmare to reach but a dream to behold. Accessed via a steep path or by boat, it offers complete isolation and stunning views.</p>
      <p><strong>Best for:</strong> Adventure seekers and couples looking for privacy.</p>

      <h3>2. Galgibaga Beach</h3>
      <p>Known as one of the nesting sites for the Olive Ridley turtles, Galgibaga is an ecologically sensitive zone. You won't find shacks here, just endless golden sand and pine trees.</p>
      <p><strong>Tip:</strong> Visit during the nesting season (January to February) but respect the conservation efforts.</p>

      <h3>3. Butterfly Beach</h3>
      <p>Accessible only by boat from Palolem or Agonda, this semicircular bay is famous for the millions of butterflies that visit the surrounding hillocks. It's also a great spot to catch a glimpse of dolphins.</p>

      <h3>4. Cola Beach</h3>
      <p>Home to the famous "Blue Lagoon," Cola Beach offers a unique landscape where a freshwater lagoon meets the sea. You can kayak in the lagoon or sunbathe on the golden sands.</p>

      <h3>5. Betul Beach</h3>
      <p>Located near the mouth of the Sal River, Betul is a fishing village with a quiet beach. It's famous for its lighthouse and fresh seafood delicacies served in nearby local eateries.</p>

      <h3>Why Choose South Goa?</h3>
      <p>If you want to disconnect from the world and reconnect with nature, these hidden beaches are your sanctuary. Pack a picnic, bring a book, and let the sound of the waves be your playlist.</p>
    `,
    author: 'Rajesh Naik',
    publishDate: new Date('2024-01-20'),
    image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
    category: 'Destinations',
    tags: ['beaches', 'hidden gems', 'secluded', 'nature']
  },
  {
    id: '3',
    title: 'Goan Cuisine: Beyond Vindaloo and Xacuti',
    excerpt: 'Dive deep into the rich culinary heritage of Goa. From street food to fine dining, explore the flavors that define this coastal paradise.',
    content: `
      <p class="lead">Goan cuisine is a melting pot of Konkani, Portuguese, and Bahmani influences. While Vindaloo and Xacuti are global ambassadors, the local palate offers so much more.</p>

      <h3>The Staples: Fish Curry and Rice</h3>
      <p>No trip to Goa is complete without the staple meal of <em>Xit Codi</em> (Fish Curry Rice). Made with coconut, kokum (a local souring agent), and fresh catch, it's a comfort food that hits the soul.</p>

      <h3>Breakfast of Champions: Ros Omelette</h3>
      <p>Forget pancakes; try the Ros Omelette. It's an omelette drowning in spicy chicken or chickpea gravy (Ros), served with local bread called <em>Poi</em> or <em>Pao</em>. Best enjoyed at local carts in Panjim or Margao.</p>

      <h3>Must-Try Dishes</h3>
      <ul>
        <li><strong>Cafreal:</strong> Chicken marinated in a green paste of coriander, chilies, and vinegar, then fried.</li>
        <li><strong>Sorpotel:</strong> A spicy pork stew, traditionally cooked days in advance to let the flavors mature.</li>
        <li><strong>Bebinca:</strong> The Queen of Goan desserts. A multi-layered coconut and jaggery pudding that requires incredible patience to bake.</li>
      </ul>

      <h3>Vegetarian Delights</h3>
      <p>Contrary to popular belief, Goa has amazing vegetarian food. Try <em>Khatkhate</em>, a mixed vegetable stew, or <em>Mushroom Xacuti</em>.</p>

      <h3>Where to Eat?</h3>
      <p>From the legendary Martin's Corner in Betalbatim to the rustic Gunpowder in Assagao, Goa offers a gastronomic journey like no other.</p>
    `,
    author: 'Maria D\'Souza',
    publishDate: new Date('2024-01-25'),
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    category: 'Food & Culture',
    tags: ['food', 'cuisine', 'restaurants', 'local flavors']
  },
  {
    id: '4',
    title: 'Nightlife Guide: From Trance to Techno',
    excerpt: 'Navigating the vibrant nightlife of Goa. Find the best clubs, beach shacks, and night markets for an unforgettable evening.',
    content: `
      <p class="lead">When the sun sets, Goa wakes up. The state's nightlife is legendary, catering to everyone from hard-core ravers to those seeking a quiet drink by the sea.</p>

      <h3>North Goa: The Party Hub</h3>
      <p>If you want to dance until dawn, head to Baga, Calangute, or Anjuna.</p>
      <ul>
        <li><strong>Tito's Lane (Baga):</strong> The most famous party street, packed with clubs like Tito's and Mambo's.</li>
        <li><strong>Anjuna & Vagator:</strong> Home to legendary venues like Curlies and HillTop, famous for psychedelic trance parties.</li>
        <li><strong>Thalassa (Siolim):</strong> For a more upscale vibe with Greek food, sunset views, and fire shows.</li>
      </ul>

      <h3>Silent Noise Parties</h3>
      <p>Head to Palolem in the south for the unique "Silent Noise" parties. Everyone wears headphones, and you can switch between different DJ channels. It keeps the party going without breaking noise pollution laws!</p>

      <h3>Night Markets</h3>
      <p>Goa's nightlife isn't just about drinking. The Saturday Night Market in Arpora is a cultural experience with live music, food stalls from around the world, and endless shopping.</p>

      <h3>Safety Tips</h3>
      <p>While Goa is generally safe, always travel in groups, keep an eye on your drinks, and use registered taxis to get back to your hotel.</p>
    `,
    author: 'Alex Party',
    publishDate: new Date('2024-02-01'),
    image: 'https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg',
    category: 'Nightlife',
    tags: ['party', 'clubs', 'music', 'night markets']
  },
  {
    id: '5',
    title: 'Heritage Walk: Old Goa Churches',
    excerpt: 'Walk through history in the UNESCO World Heritage site of Old Goa. Explore the magnificent architecture and spiritual legacy of the Portuguese era.',
    content: `
      <p class="lead">Old Goa (Velha Goa) was once the capital of Portuguese India and was known as the "Rome of the East." Today, its churches stand as majestic reminders of a bygone era.</p>

      <h3>Basilica of Bom Jesus</h3>
      <p>This UNESCO World Heritage site holds the mortal remains of St. Francis Xavier. The baroque architecture and the un-plastered laterite exterior make it unique. It's a pilgrimage center for Christians worldwide.</p>

      <h3>Se Cathedral</h3>
      <p>Located opposite the Basilica, this is one of the largest churches in Asia. Validated to St. Catherine, it is famous for its "Golden Bell," which is said to be the largest in Goa and has a rich tone.</p>

      <h3>Church of St. Cajetan</h3>
      <p>Modeled on the original St. Peter's Basilica in Rome, this church is a stunning example of Corinthian architecture. It's less crowded, offering a peaceful atmosphere for reflection.</p>

      <h3>Augustine Tower</h3>
      <p>Visit the ruins of the Church of St. Augustine. The 46-meter high tower is all that remains of what was once a massive complex, offering a hauntingly beautiful photo opportunity.</p>

      <h3>Tips for Visitors</h3>
      <ul>
        <li><strong>Dress Code:</strong> Please dress modestly (shoulders and knees covered) as these are active places of worship.</li>
        <li><strong>Timing:</strong> Early morning (around 8 AM) is the best time to visit to avoid the heat and the busloads of tourists.</li>
      </ul>
    `,
    author: 'Heritage Lover',
    publishDate: new Date('2024-02-10'),
    image: 'https://images.pixels.com/photos/3225528/pexels-photo-3225528.jpeg', // Assuming general church/heritage image
    category: 'Heritage',
    tags: ['history', 'architecture', 'churches', 'unesco']
  },
  {
    id: '6',
    title: 'Water Sports: A Thrill Seeker\'s Guide',
    excerpt: 'From parasailing to scuba diving, get your adrenaline fix with our guide to the best water sports activities in Goa.',
    content: `
      <p class="lead">Goa's 100km coastline isn't just for sunbathing. It's a playground for water sports enthusiasts.</p>

      <h3>Parasailing</h3>
      <p>Get a bird's eye view of the coastline. Winch-boat parasailing is popular at Calangute and Candolim beaches. It's safe and requires no prior experience.</p>

      <h3>Scuba Diving</h3>
      <p>Explore the underwater world of Grande Island. While visibility isn't like the Maldives, you can still spot colorful coral, fish, and even shipwrecks.</p>
      <ul>
        <li><strong>Best Season:</strong> October to April.</li>
        <li><strong>Operators:</strong> Always choose PADI-certified dive centers.</li>
      </ul>

      <h3>Kayaking in the Backwaters</h3>
      <p>For a more serene experience, kayak through the mangroves of the Sal Backwaters or the Nerul River. It's a great way to spot birds and see the greener side of Goa.</p>

      <h3>Jet Skiing & Banana Boats</h3>
      <p>Available on almost every major commercial beach. Great for groups and families looking for quick thrills.</p>

      <h3>White Water Rafting</h3>
      <p>Yes, Goa has rafting! Head to the Mhadei River during the monsoon (June to September) for Class 2 and 3 rapids nestled in the Western Ghats.</p>
    `,
    author: 'Adventure Junkie',
    publishDate: new Date('2024-02-15'),
    image: 'https://images.pexels.com/photos/2351287/pexels-photo-2351287.jpeg', // General water/beach activity
    category: 'Adventure',
    tags: ['water sports', 'adventure', 'scuba', 'thrill']
  }
];