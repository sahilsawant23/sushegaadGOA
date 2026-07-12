export interface HiddenGem {
    id: string;
    title: string;
    location: string;
    description: string;
    image: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    bestTime: string;
}

export const hiddenGemsData: HiddenGem[] = [
    {
        id: '1',
        title: 'Butterfly Beach',
        location: 'South Goa, near Palolem',
        description: 'A secluded semicircular beach accessible only by boat or a trek through the forest. Famous for the thousands of butterflies flying over the hilltops.',
        image: 'https://images.unsplash.com/photo-1544249159-8fa9a103c81e?w=800&q=80',
        difficulty: 'Moderate',
        bestTime: 'Early Morning'
    },
    {
        id: '2',
        title: 'Harvalem Waterfalls',
        location: 'Sanquelim, North Goa',
        description: 'A scenic waterfall cascading down from a height of 50 meters, located near the Rudreshwar Temple and Arvalem Caves.',
        image: 'https://images.unsplash.com/photo-1622306236966-28564db4430e?w=800&q=80',
        difficulty: 'Easy',
        bestTime: 'Monsoon (June-Sept)'
    },
    {
        id: '3',
        title: 'Chorla Ghats',
        location: 'Goa-Karnataka-Maharashtra border',
        description: 'A stunning mountain range offering breathtaking views, lush greenery, and rare biodiversity. Perfect for a scenic drive.',
        image: 'https://images.unsplash.com/photo-1626354674063-8a3fc42d765d?w=800&q=80',
        difficulty: 'Easy',
        bestTime: 'Winter (Nov-Feb)'
    },
    {
        id: '4',
        title: 'Netravali Bubble Lake',
        location: 'Sanguem, South Goa',
        description: 'A sacred tank (Budbudyanchi Tali) known for its mysterious bubbles that rise continuously to the surface. It is located near the Gopinath Temple.',
        image: 'https://images.unsplash.com/photo-1582294154848-8df090c2e42c?w=800&q=80',
        difficulty: 'Easy',
        bestTime: 'Anytime'
    },
    {
        id: '5',
        title: 'Cabo de Rama Fort',
        location: 'Canacona, South Goa',
        description: 'One of the oldest forts in Goa, offering panoramic views of the Arabian Sea. It has a rich history and a small church inside.',
        image: 'https://images.unsplash.com/photo-1598424268600-4743285c5314?w=800&q=80',
        difficulty: 'Easy',
        bestTime: 'Sunset'
    },
    {
        id: '6',
        title: 'Galgibaga Beach',
        location: 'Canacona, South Goa',
        description: 'Known as the Turtle Beach, it is one of the cleanest and most peaceful beaches in Goa, and a nesting site for Olive Ridley turtles.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        difficulty: 'Easy',
        bestTime: 'Winter (Dec-Feb)'
    }
];
