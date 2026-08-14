/**
 * mockListings.js
 *
 * Hardcoded mock property data for the Rising Home prototype.
 * 10 listings across 4 Chicago neighborhoods.
 * No real database or API — all values are fictional.
 *
 * @typedef {Object} Listing
 * @property {string}  id
 * @property {string}  address
 * @property {number}  price            Monthly rent in USD
 * @property {number}  bedrooms
 * @property {number}  bathrooms
 * @property {number}  sqft
 * @property {boolean} petFriendly
 * @property {string}  neighborhood
 * @property {number}  walkabilityScore  0–100
 * @property {number}  schoolRating      1–10
 * @property {string}  type             "rent" | "buy"
 * @property {string}  tag              Short label shown on card
 * @property {{ x: number, y: number }} mapPin  Percent position on mock map
 */

/** @type {Listing[]} */
export const mockListings = [
  // ── Wicker Park ──────────────────────────────────────────────────────────
  {
    id: 'prop-001',
    address: '1421 N Milwaukee Ave, Chicago, IL',
    price: 1_850,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 920,
    petFriendly: true,
    neighborhood: 'Wicker Park',
    walkabilityScore: 92,
    schoolRating: 7,
    type: 'rent',
    tag: 'Great Walkability',
    mapPin: { x: 28, y: 38 },
  },
  {
    id: 'prop-002',
    address: '1812 W North Ave, Chicago, IL',
    price: 2_100,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1_200,
    petFriendly: false,
    neighborhood: 'Wicker Park',
    walkabilityScore: 89,
    schoolRating: 8,
    type: 'rent',
    tag: 'Spacious 3BR',
    mapPin: { x: 30, y: 42 },
  },
  {
    id: 'prop-003',
    address: '2047 W Pierce Ave, Chicago, IL',
    price: 1_600,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 680,
    petFriendly: true,
    neighborhood: 'Wicker Park',
    walkabilityScore: 85,
    schoolRating: 7,
    type: 'rent',
    tag: 'Cozy & Affordable',
    mapPin: { x: 26, y: 45 },
  },

  // ── Lincoln Park ──────────────────────────────────────────────────────────
  {
    id: 'prop-004',
    address: '555 W Fullerton Pkwy, Chicago, IL',
    price: 2_400,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1_050,
    petFriendly: true,
    neighborhood: 'Lincoln Park',
    walkabilityScore: 94,
    schoolRating: 9,
    type: 'rent',
    tag: 'Near the Park',
    mapPin: { x: 52, y: 22 },
  },
  {
    id: 'prop-005',
    address: '2301 N Clark St, Chicago, IL',
    price: 3_200,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1_500,
    petFriendly: false,
    neighborhood: 'Lincoln Park',
    walkabilityScore: 96,
    schoolRating: 9,
    type: 'buy',
    tag: 'Top Schools',
    mapPin: { x: 55, y: 25 },
  },
  {
    id: 'prop-006',
    address: '1740 N Wells St, Chicago, IL',
    price: 1_950,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 760,
    petFriendly: true,
    neighborhood: 'Lincoln Park',
    walkabilityScore: 91,
    schoolRating: 8,
    type: 'rent',
    tag: 'Pet Friendly',
    mapPin: { x: 50, y: 29 },
  },

  // ── Logan Square ──────────────────────────────────────────────────────────
  {
    id: 'prop-007',
    address: '3140 W Logan Blvd, Chicago, IL',
    price: 1_700,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 870,
    petFriendly: true,
    neighborhood: 'Logan Square',
    walkabilityScore: 82,
    schoolRating: 7,
    type: 'rent',
    tag: 'Trendy Neighborhood',
    mapPin: { x: 18, y: 33 },
  },
  {
    id: 'prop-008',
    address: '2528 N Kedzie Ave, Chicago, IL',
    price: 1_550,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 640,
    petFriendly: false,
    neighborhood: 'Logan Square',
    walkabilityScore: 79,
    schoolRating: 6,
    type: 'rent',
    tag: 'Best Value',
    mapPin: { x: 15, y: 37 },
  },

  // ── River North ───────────────────────────────────────────────────────────
  {
    id: 'prop-009',
    address: '400 N McClurg Ct, Chicago, IL',
    price: 2_800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1_100,
    petFriendly: false,
    neighborhood: 'River North',
    walkabilityScore: 98,
    schoolRating: 8,
    type: 'rent',
    tag: 'Downtown Living',
    mapPin: { x: 65, y: 55 },
  },
  {
    id: 'prop-010',
    address: '222 W Erie St, Chicago, IL',
    price: 3_500,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1_800,
    petFriendly: true,
    neighborhood: 'River North',
    walkabilityScore: 97,
    schoolRating: 8,
    type: 'buy',
    tag: 'Luxury Unit',
    mapPin: { x: 63, y: 58 },
  },
];

/** Returns all unique neighborhood names from the listings. */
export const neighborhoods = [...new Set(mockListings.map((l) => l.neighborhood))];
