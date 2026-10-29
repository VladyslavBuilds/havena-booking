// Demo data for Havena.
//
//   npx prisma db seed
//
// Creates demo hosts with 12 listings, guests with past stays and reviews,
// a few upcoming reservations, and a demo account you can log in with:
//
//   demo@havena.app / havena-demo
//
// The demo account has finished stays without a review, so "Leave a review"
// can be tried right away. Running the script again removes all demo data
// first, so it can be used to reset the demo at any time. Real users and
// their listings are never touched.

import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_DOMAIN = "@demo.havena.app";
const DEMO_ACCOUNT = { email: "demo@havena.app", password: "havena-demo", name: "Demo Guest" };

const DAY = 24 * 60 * 60 * 1000;
const daysFromNow = (days) => new Date(Date.now() + days * DAY);
const nights = (start, end) => Math.round((end - start) / DAY);

const IMG = "https://res.cloudinary.com/ix8tmyj9/image/upload";

const hosts = [
    { key: "maria", name: "Maria Costa" },
    { key: "jonas", name: "Jonas Berg" },
    { key: "aiko", name: "Aiko Tanaka" },
];

const guests = ["Emma Wilson", "Lucas Martin", "Sofia Rossi", "Noah Schmidt", "Olivia Brown", "Mateo García"];

// reviews: [guest index, rating, comment]
const listings = [
    {
        host: "maria", category: "Beach", locationValue: "MDV", price: 240,
        title: "Overwater beach bungalow",
        description: "Wake up to turquoise water right under your feet. A thatched bungalow on a quiet stretch of sand with a private deck, hammock and snorkelling gear included.",
        imageSrc: `${IMG}/v1793231596/havena-demo/photo-1499793983690-e29da59ef1c2.jpg`,
        guestCount: 2, roomCount: 1, bathroomCount: 1,
        reviews: [[0, 5, "Unreal location. We snorkelled straight from the deck every morning and saw turtles twice."], [3, 5, "Exactly as pictured. Maria arranged a boat transfer and a candlelit dinner on the beach."], [1, 4, "Beautiful and peaceful. Wi-Fi was patchy, but honestly that was part of the charm."]],
    },
    {
        host: "jonas", category: "Pools", locationValue: "ESP", price: 180,
        title: "Modern villa with private pool",
        description: "Light-filled villa on the Costa Blanca with floor-to-ceiling windows, a heated pool and a shaded terrace for long dinners. Ten minutes by car to the beach.",
        imageSrc: `${IMG}/v1793231664/havena-demo/photo-1512917774080-9991f1c4c750.jpg`,
        guestCount: 6, roomCount: 3, bathroomCount: 2,
        reviews: [[2, 5, "Spotless, stylish and the pool was perfect for the kids. Would come back in a heartbeat."], [4, 4, "Great house. The supermarket is a short drive away, so plan a shop on arrival."]],
    },
    {
        host: "jonas", category: "Countryside", locationValue: "NLD", price: 95,
        title: "Cosy cabin on the forest road",
        description: "Timber cabin at the edge of the Veluwe forest. Wood stove, bikes in the shed and deer in the garden most evenings. Perfect for a slow weekend.",
        imageSrc: `${IMG}/v1793231665/havena-demo/photo-1449844908441-8829872d2607.jpg`,
        guestCount: 4, roomCount: 2, bathroomCount: 1,
        reviews: [[5, 5, "The bikes were a brilliant touch, we cycled to the national park every day."], [0, 4, "Warm, quiet and very clean. The stove takes a little practice."], [2, 5, "Felt like a storybook. Jonas left fresh bread and eggs for our first morning."]],
    },
    {
        host: "aiko", category: "Arctic", locationValue: "ISL", price: 110,
        title: "Little red house in the highlands",
        description: "A classic red cottage alone on a green hill, forty minutes from Reykjavík. Northern lights from the doorstep in winter, midnight sun in summer.",
        imageSrc: `${IMG}/v1793231666/havena-demo/photo-1518780664697-55e3ad937233.jpg`,
        guestCount: 3, roomCount: 1, bathroomCount: 1,
        reviews: [[1, 5, "We saw the aurora on our second night. No light pollution at all. Magical."], [3, 3, "Lovely spot but very basic inside, and the road is rough in the rain."]],
    },
    {
        host: "maria", category: "Lake", locationValue: "ITA", price: 150,
        title: "Boathouse on an alpine lake",
        description: "Historic boathouse right on Lago di Braies with a rowing boat at your door. Mountains on three sides and absolute silence after the day visitors leave.",
        imageSrc: `${IMG}/v1793231667/havena-demo/photo-1470770841072-f978cf4d019e.jpg`,
        guestCount: 2, roomCount: 1, bathroomCount: 1,
        reviews: [[4, 5, "The most beautiful place I have ever slept. Rowing out at sunrise is something I will never forget."], [5, 5, "Worth every euro. Small but perfectly kept, and the hosts are lovely."], [0, 4, "Stunning. Bring warm clothes even in July, evenings are chilly."]],
    },
    {
        host: "maria", category: "Modern", locationValue: "PRT", price: 130,
        title: "Minimalist white house near the coast",
        description: "Architect-designed house in the pine woods of Comporta. White walls, polished concrete, a long garden and the Atlantic a short bike ride away.",
        imageSrc: `${IMG}/v1793231668/havena-demo/photo-1523217582562-09d0def993a6.jpg`,
        guestCount: 4, roomCount: 2, bathroomCount: 2,
        reviews: [[2, 5, "Design magazine material. Quiet, bright and very comfortable beds."], [1, 4, "Loved the house. A car is essential here."]],
    },
    {
        host: "aiko", category: "Islands", locationValue: "THA", price: 120,
        title: "Tropical pool garden retreat",
        description: "Teak bungalows around a lagoon pool, framed by limestone cliffs in Krabi. Breakfast is served under the palms; the beach is a five-minute walk.",
        imageSrc: `${IMG}/v1793231669/havena-demo/photo-1520250497591-112f2f40a3f4.jpg`,
        guestCount: 2, roomCount: 1, bathroomCount: 1,
        reviews: [[3, 5, "Paradise. The pool, the garden, the staff, everything was perfect."], [5, 4, "Great value. Mosquito spray recommended in the evenings."], [4, 5, "We extended our stay by three nights. Says it all."]],
    },
    {
        host: "aiko", category: "Islands", locationValue: "GRC", price: 210,
        title: "Whitewashed island hideaway",
        description: "Traditional cave house in Oia with a sea-view terrace. Watch the famous Santorini sunset from your own chairs instead of the crowded steps.",
        imageSrc: `${IMG}/v1793231670/havena-demo/photo-1533105079780-92b9be482077.jpg`,
        guestCount: 2, roomCount: 1, bathroomCount: 1,
        reviews: [[0, 5, "The terrace alone is worth the price. Sunsets every night with a glass of Assyrtiko."], [2, 4, "Gorgeous, though lots of steps to reach it. Pack light!"]],
    },
    {
        host: "jonas", category: "Lux", locationValue: "USA", price: 450,
        title: "Luxury villa with infinity pool",
        description: "Six-bedroom estate in Palm Springs with an infinity pool, outdoor kitchen, cinema room and mountain views from every window. Concierge on request.",
        imageSrc: `${IMG}/v1793231672/havena-demo/photo-1613490493576-7fde63acd811.jpg`,
        guestCount: 12, roomCount: 6, bathroomCount: 5,
        reviews: [[4, 5, "We celebrated a 40th birthday here. Flawless house and a flawless host."], [1, 5, "Every detail considered. The pool at night is spectacular."]],
    },
    {
        host: "jonas", category: "Skiing", locationValue: "AUT", price: 160,
        title: "Mountain chalet above the clouds",
        description: "Ski-in, ski-out chalet at 1,800 m in the Tyrolean Alps. Sauna, boot warmers and a sunrise over the valley that makes early starts easy.",
        imageSrc: `${IMG}/v1793231673/havena-demo/photo-1542718610-a1d656d1884c.jpg`,
        guestCount: 6, roomCount: 3, bathroomCount: 2,
        reviews: [[5, 5, "Skied from the door every morning. The sauna after a day on the slopes is heaven."], [3, 4, "Cosy and well equipped. The access road needs winter tyres."], [2, 5, "Best chalet we have stayed in. Already booked for next season."]],
    },
    {
        host: "aiko", category: "Modern", locationValue: "FRA", price: 85,
        title: "Bright city apartment in Lyon",
        description: "Sunny one-bedroom flat in the Croix-Rousse quarter with a fully equipped kitchen and a balcony over a quiet courtyard. Markets and bakeries downstairs.",
        imageSrc: `${IMG}/v1793231674/havena-demo/photo-1522708323590-d24dbb6b0267.jpg`,
        guestCount: 2, roomCount: 1, bathroomCount: 1,
        reviews: [[0, 4, "Clean, central and quiet. Great base for exploring the city on foot."], [4, 5, "Aiko's list of local restaurants was gold. Lovely flat."]],
    },
    {
        host: "maria", category: "Countryside", locationValue: "CAN", price: 100,
        title: "Country farmhouse in the maples",
        description: "White clapboard farmhouse in Québec's Eastern Townships, surrounded by maple trees that turn red in October. Big kitchen, wrap-around porch, apple orchard.",
        imageSrc: `${IMG}/v1793231676/havena-demo/photo-1480074568708-e7b720bb3f09.jpg`,
        guestCount: 8, roomCount: 4, bathroomCount: 2,
        reviews: [[1, 5, "We came for the autumn colours and were not disappointed. The porch is the best seat in the house."], [5, 4, "Spacious and homely. A little far from restaurants, so cook in."]],
    },
];

// Past stays of the demo account WITHOUT a review (indices into `listings`,
// how many days ago the stay ended, length in nights). Leave these to try
// "Leave a review" on the trips page.
const demoPastStays = [
    { listing: 0, endedDaysAgo: 12, length: 4 },
    { listing: 4, endedDaysAgo: 38, length: 3 },
    { listing: 9, endedDaysAgo: 75, length: 5 },
];
const demoUpcomingStay = { listing: 2, startsInDays: 21, length: 3 };
const demoFavorites = [1, 7, 8];

async function removeDemoData() {
    const demoUsers = await prisma.user.findMany({
        where: { OR: [{ email: { endsWith: DEMO_DOMAIN } }, { email: DEMO_ACCOUNT.email }] },
        select: { id: true },
    });
    const userIds = demoUsers.map((user) => user.id);

    const demoListings = await prisma.listing.findMany({
        where: { userId: { in: userIds } },
        select: { id: true },
    });
    const listingIds = demoListings.map((listing) => listing.id);

    const touched = { OR: [{ userId: { in: userIds } }, { listingId: { in: listingIds } }] };
    const reviews = await prisma.review.deleteMany({ where: touched });
    const reservations = await prisma.reservation.deleteMany({ where: touched });
    await prisma.listing.deleteMany({ where: { id: { in: listingIds } } });
    await prisma.account.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });

    console.log(`removed previous demo data: ${userIds.length} users, ${listingIds.length} listings, ${reservations.count} reservations, ${reviews.count} reviews`);
}

async function main() {
    await removeDemoData();

    const hostIds = {};
    for (const host of hosts) {
        const user = await prisma.user.create({
            data: { email: `${host.key}${DEMO_DOMAIN}`, name: host.name },
        });
        hostIds[host.key] = user.id;
    }

    const guestIds = [];
    for (const [index, name] of guests.entries()) {
        const user = await prisma.user.create({
            data: { email: `guest${index + 1}${DEMO_DOMAIN}`, name },
        });
        guestIds.push(user.id);
    }

    const listingIds = [];
    let reviewCount = 0;
    let reservationCount = 0;

    for (const [index, item] of listings.entries()) {
        const { host, reviews, ...data } = item;
        const listing = await prisma.listing.create({
            data: { ...data, userId: hostIds[host] },
        });
        listingIds.push(listing.id);

        // Each review comes with the stay it is based on, spread over the past year.
        for (const [position, [guest, rating, comment]] of reviews.entries()) {
            const endDate = daysFromNow(-(20 + position * 60 + index * 7));
            const startDate = new Date(endDate.getTime() - (3 + position) * DAY);

            await prisma.reservation.create({
                data: {
                    userId: guestIds[guest], listingId: listing.id,
                    startDate, endDate,
                    totalPrice: nights(startDate, endDate) * data.price,
                },
            });
            await prisma.review.create({
                data: { userId: guestIds[guest], listingId: listing.id, rating, comment },
            });
            reservationCount++;
            reviewCount++;
        }

        // A few upcoming bookings so some dates are blocked in the calendar.
        if (index % 4 === 1) {
            const startDate = daysFromNow(10 + index);
            const endDate = new Date(startDate.getTime() + 4 * DAY);
            await prisma.reservation.create({
                data: {
                    userId: guestIds[index % guestIds.length], listingId: listing.id,
                    startDate, endDate,
                    totalPrice: 4 * data.price,
                },
            });
            reservationCount++;
        }
    }

    const hashedPassword = await bcrypt.hash(DEMO_ACCOUNT.password, 12);
    const demoUser = await prisma.user.create({
        data: {
            email: DEMO_ACCOUNT.email,
            name: DEMO_ACCOUNT.name,
            hashedPassword,
            favoriteIds: demoFavorites.map((i) => listingIds[i]),
        },
    });

    for (const stay of demoPastStays) {
        const endDate = daysFromNow(-stay.endedDaysAgo);
        const startDate = new Date(endDate.getTime() - stay.length * DAY);
        await prisma.reservation.create({
            data: {
                userId: demoUser.id, listingId: listingIds[stay.listing],
                startDate, endDate,
                totalPrice: stay.length * listings[stay.listing].price,
            },
        });
        reservationCount++;
    }

    const upcomingStart = daysFromNow(demoUpcomingStay.startsInDays);
    await prisma.reservation.create({
        data: {
            userId: demoUser.id, listingId: listingIds[demoUpcomingStay.listing],
            startDate: upcomingStart,
            endDate: new Date(upcomingStart.getTime() + demoUpcomingStay.length * DAY),
            totalPrice: demoUpcomingStay.length * listings[demoUpcomingStay.listing].price,
        },
    });
    reservationCount++;

    console.log(`created ${hosts.length} hosts, ${guests.length} guests, ${listings.length} listings, ${reservationCount} reservations, ${reviewCount} reviews`);
    console.log(`demo account: ${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
