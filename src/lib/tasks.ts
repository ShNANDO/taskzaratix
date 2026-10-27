export interface TaskImage {
  id: string;
  photo: string;
  alt: string;
  isTarget: boolean;
}

export interface QuizTask {
  id: number;
  prompt: string;
  hint?: string;
  reward: number; // USD
  images: TaskImage[];
}

const CDN = "https://images.unsplash.com/photo-";

/** Square, WebP, quality-tuned tile URL. */
export function photoUrl(photo: string, size = 220): string {
  return `${CDN}${photo}?auto=format&fit=crop&crop=entropy&w=${size}&h=${size}&q=55&fm=webp`;
}

/** Responsive candidates so retina screens stay sharp without bloating 1x. */
export function photoSrcSet(photo: string): string {
  return [160, 220, 320, 440]
    .map((w) => `${photoUrl(photo, w)} ${w}w`)
    .join(", ");
}

export const TILE_SIZES = "(max-width: 480px) 30vw, 150px";

const t = (id: string, photo: string, alt: string): TaskImage => ({
  id,
  photo,
  alt,
  isTarget: true,
});
const f = (id: string, photo: string, alt: string): TaskImage => ({
  id,
  photo,
  alt,
  isTarget: false,
});

// Photo library (all real photography, verified to load).
const P = {
  // dogs
  pups: "1587300003388-59208cc962cb",
  dog1: "1543466835-00a7907e9de1",
  dog2: "1560807707-8cc77767d783",
  dog3: "1583337130417-3346a1be7dee",
  dog4: "1552053831-71594a27632d",
  dog5: "1587764379873-97837921fd44",
  duck: "1556155092-490a1ba16284",
  // people
  man: "1500648767791-00dcc994a43e",
  woman1: "1544005313-94ddf0286df2",
  woman2: "1517841905240-472988babdf9",
  woman3: "1494790108377-be9c29b29330",
  worker: "1558618666-fcd25c85cd64",
  // cars
  porsche: "1503376780353-7e6692767b70",
  mustang: "1494976388531-d1058494cdd8",
  camaro: "1552519507-da3b142c6e3d",
  hyundaiRed: "1550355291-bbee04a92027",
  bmwWhite: "1555215695-3004980ad54e",
  ferrariRed: "1583121274602-3e2820c69888",
  bugatti: "1544636331-e26879cd4d9b",
  gtr: "1568605117036-5fe5e7bab0b7",
  ferrariYellow: "1503736334956-4c8f8e92946d",
  bmwGrey: "1580273916550-e323be2ae537",
  vwTeal: "1541899481282-d53bffe3c35d",
  sedanBlue: "1502877338535-766e1452684a",
  suvWhite: "1519641471654-76ce0107ad1b",
  audiNight: "1493238792000-8113da705763",
  // traffic
  light1: "1573551565225-99f8fdb14ef1",
  light2: "1509316785289-025f5b846b35",
  light3: "1567613096207-2f0aabb4d4a1",
  // places
  eiffel: "1502602898657-3e91760cbb34",
  parisBridge: "1499856871958-5b9627545d1a",
  parisArc: "1520939817895-060bdaf4fe1b",
  eiffel2: "1431274172761-fca41d930114",
  germany: "1467269204594-9661b134dd2b",
  fujiPagoda: "1526481280693-3bfa7568e0f3",
  tajArch: "1548013146-72479768bada",
  taj: "1524492412937-b28074a5d7da",
  towerBridge: "1533929736458-ca588d08c8be",
  thaiBoats: "1552465011-b4e21bf6e79a",
  thaiTemple: "1528181304800-259b08848526",
  cinqueTerre: "1516483638261-f4dbaf036963",
  greece: "1533105079780-92b9be482077",
  savanna: "1547471080-7cc2caa01a7e",
  prague: "1541849546-216549ae216d",
  burjAlArab: "1518684079-3c830dcef090",
  dubai: "1512453979798-5ea266f8880c",
  nycStreet: "1449824913935-59a10b8d2000",
  nycSkyline: "1480714378408-67cf0d13bc1b",
  flatiron: "1514924013411-cbf25faa35bb",
  empireState: "1534430480872-3498386e7856",
  nycSunset: "1546436836-07a91091f160",
  dolomites: "1476514525535-07fb3b4ae5f1",
  venice: "1523906834658-6e24ef2386f9",
  sydney: "1523482580672-f109ba8cb9be",
  bananas: "1571771894821-ce9b6c11b08e",
  diner: "1555992336-fb0d29498b13",
} as const;

const REWARD = 212 / 8; // 8 tasks = $212.00 total

export const TASKS: QuizTask[] = [
  {
    id: 1,
    prompt: "Mark all images that contain dogs",
    reward: REWARD,
    images: [
      t("d1", P.pups, "Two puppies"),
      f("x1", P.duck, "A duck on water"),
      t("d2", P.dog1, "A dog outdoors"),
      t("d3", P.dog2, "A puppy on grass"),
      t("d4", P.dog3, "Close-up of a dog"),
      t("d5", P.dog4, "A dog looking at the camera"),
      f("x2", P.man, "A man smiling"),
      f("x3", P.bananas, "Bananas on a yellow background"),
      t("d6", P.dog5, "A white puppy"),
    ],
  },
  {
    id: 2,
    prompt: "Mark all images that contain cars",
    reward: REWARD,
    images: [
      t("c1", P.mustang, "A black Ford Mustang"),
      f("x1", P.pups, "Two puppies"),
      t("c2", P.porsche, "A silver sports sedan"),
      f("x2", P.man, "A man smiling"),
      t("c3", P.suvWhite, "A white SUV by a lake"),
      f("x3", P.savanna, "A lone tree in the savanna"),
      t("c4", P.vwTeal, "A teal hatchback"),
      f("x4", P.duck, "A duck on water"),
      t("c5", P.camaro, "A blue Chevrolet Camaro"),
    ],
  },
  {
    id: 3,
    prompt: "Car brands: mark every supercar",
    reward: REWARD,
    images: [
      t("s1", P.ferrariRed, "A red Ferrari supercar"),
      f("x1", P.suvWhite, "A white family SUV"),
      t("s2", P.bugatti, "A Bugatti front grille"),
      t("s3", P.ferrariYellow, "A yellow Ferrari"),
      f("x2", P.vwTeal, "A teal hatchback"),
      t("s4", P.gtr, "A sports coupe on an open road"),
      f("x3", P.diner, "An American diner interior"),
      t("s5", P.mustang, "A Ford Mustang Shelby"),
      f("x4", P.bananas, "Bananas on a yellow background"),
    ],
  },
  {
    id: 4,
    prompt: "Mark every red or yellow car",
    reward: REWARD,
    images: [
      t("r1", P.hyundaiRed, "A red hatchback"),
      f("x1", P.camaro, "A blue Camaro"),
      t("r2", P.ferrariRed, "A red Ferrari"),
      f("x2", P.bmwWhite, "A white BMW"),
      f("x3", P.bmwGrey, "A grey BMW coupe"),
      t("r3", P.ferrariYellow, "A yellow Ferrari"),
      f("x4", P.sedanBlue, "A blue sedan"),
      f("x5", P.suvWhite, "A white SUV"),
      f("x6", P.audiNight, "Car tail lights at night"),
    ],
  },
  {
    id: 5,
    prompt: "Country facts: France — mark every photo taken in Paris",
    reward: REWARD,
    images: [
      t("p1", P.eiffel, "The Eiffel Tower by the Seine"),
      f("x1", P.towerBridge, "Tower Bridge in London"),
      t("p2", P.parisBridge, "Pont Alexandre III in Paris"),
      f("x2", P.taj, "The Taj Mahal in India"),
      t("p3", P.parisArc, "Arc de Triomphe from above"),
      f("x3", P.sydney, "Sydney Opera House"),
      t("p4", P.eiffel2, "The Eiffel Tower"),
      f("x4", P.dubai, "The Dubai skyline"),
      f("x5", P.venice, "Canals of Venice"),
    ],
  },
  {
    id: 6,
    prompt: "Country facts: USA — mark every photo of New York City",
    reward: REWARD,
    images: [
      t("n1", P.nycSkyline, "Manhattan skyline"),
      f("x1", P.prague, "Rooftops of Prague"),
      t("n2", P.flatiron, "The Flatiron Building"),
      t("n3", P.nycStreet, "A street in Manhattan"),
      f("x2", P.venice, "The Rialto Bridge in Venice"),
      t("n4", P.empireState, "The Empire State Building"),
      f("x3", P.burjAlArab, "Burj Al Arab in Dubai"),
      t("n5", P.nycSunset, "New York at sunset"),
      f("x4", P.sydney, "Sydney Opera House"),
    ],
  },
  {
    id: 7,
    prompt: "Country facts: Asia — mark every landmark located in Asia",
    reward: REWARD,
    images: [
      t("a1", P.fujiPagoda, "A pagoda with Mount Fuji behind it"),
      f("x1", P.eiffel, "The Eiffel Tower"),
      t("a2", P.taj, "The Taj Mahal"),
      f("x2", P.towerBridge, "Tower Bridge in London"),
      t("a3", P.thaiTemple, "A golden Thai temple"),
      f("x3", P.cinqueTerre, "Cinque Terre in Italy"),
      t("a4", P.tajArch, "The Taj Mahal seen through an arch"),
      t("a5", P.thaiBoats, "Longtail boats in Thailand"),
      f("x4", P.greece, "A whitewashed Greek village"),
    ],
  },
  {
    id: 8,
    prompt: "Final task: mark every photo taken in Italy",
    reward: REWARD,
    images: [
      t("i1", P.cinqueTerre, "Cinque Terre on the Italian coast"),
      f("x1", P.greece, "A Greek island village"),
      t("i2", P.venice, "The Rialto Bridge in Venice"),
      f("x2", P.germany, "A German old town"),
      t("i3", P.dolomites, "A lake in the Italian Dolomites"),
      f("x3", P.prague, "Rooftops of Prague"),
      f("x4", P.dubai, "The Dubai skyline"),
      f("x5", P.savanna, "A tree in the savanna"),
      f("x6", P.worker, "A craftsman at work"),
    ],
  },
];

export const TOTAL_TASKS = TASKS.length;
