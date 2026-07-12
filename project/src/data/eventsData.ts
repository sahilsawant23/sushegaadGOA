export interface Event {
    id: string;
    title: string;
    category: 'Music' | 'Cultural' | 'Food' | 'Nightlife';
    date: string;
    location: string;
    description: string;
    image: string;
    price: string;
}

export const eventsData: Event[] = [
    {
        id: '1',
        title: 'Goa Carnival 2026',
        category: 'Cultural',
        date: '2026-02-14',
        location: 'Panaji, Goa',
        description: 'The most famous festival in Goa featuring colorful parades, floats, music, and dancing in the streets.',
        image: 'https://images.unsplash.com/photo-1565576722889-0d12e69312b9?w=800&q=80',
        price: 'Free'
    },
    {
        id: '2',
        title: 'Sunburn Festival Reloaded',
        category: 'Music',
        date: '2026-03-20',
        location: 'Vagator Beach',
        description: 'Asia’s largest electronic music festival returns with top international DJs and an electrifying atmosphere.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
        price: '₹2500 Onwards'
    },
    {
        id: '3',
        title: 'The Goa Food & Cultural Festival',
        category: 'Food',
        date: '2026-04-10',
        location: 'Campal Grounds, Panaji',
        description: 'A celebration of Goan cuisine, featuring local delicacies, cooking competitions, and live performances.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        price: 'Entry Free'
    },
    {
        id: '4',
        title: 'Shigmo Festival',
        category: 'Cultural',
        date: '2026-03-05',
        location: 'All over Goa',
        description: 'A vibrant spring festival celebrated with traditional folk dances, float parades, and colors.',
        image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
        price: 'Free'
    },
    {
        id: '5',
        title: 'Saturday Night Market',
        category: 'Nightlife',
        date: 'Every Saturday',
        location: 'Arpora',
        description: 'A sprawling market with hundreds of stalls selling clothes, accessories, spices, and global food.',
        image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
        price: 'Free Entry'
    },
    {
        id: '6',
        title: 'International Jazz Festival',
        category: 'Music',
        date: '2026-11-20',
        location: 'Stone Water Eco Resort',
        description: 'Enjoy smooth jazz tunes from world-renowned artists by the sea.',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
        price: '₹1000'
    }
];
