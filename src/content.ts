// All editable content lives here: identity, contact, chapter order, layouts, captions.
// `file` refers to an original in photos/ (run `npm run images` after adding photos).

export type Layout =
  | 'large' //       one photograph, as large as its resolution allows
  | 'left' //        a single, smaller photograph set off to the left
  | 'right' //       … or to the right
  | 'row'; //        2–3 photographs side by side, equal height, native ratios

export type Photo = { file: string; alt: string; caption?: string };
export type Row = { layout: Layout; photos: Photo[] };
export type Chapter = {
  id: string;
  title: string;
  /** page background + text colour while this chapter is in view */
  tone: { bg: string; fg: string };
  rows: Row[];
};

export const site = {
  name: 'Jonas Gustavsson',
  discipline: 'Interiors & still life',
  email: '[EMAIL]', // e.g. hello@example.com
  phone: '070-476 20 74',
  instagram: '', // e.g. 'jonasgustavsson' — leave empty to hide
  about: [
    '[A short introduction to Jonas Gustavsson — two or three sentences on the work, the approach to light and the kind of commissions taken on.]',
    '[Representation, studio location or availability.]',
  ],
  hero: {
    file: 'imgi_522_Sköna-hem006.jpg',
    alt: 'A woven hanging pod lined with sheepskins and cushions on a rocky shore at dusk, lanterns glowing beside it.',
    caption: 'Sköna Hem',
  } as Photo,
  night: { bg: '#0f0e0d', fg: '#e9e4dc' },
};

const NR = 'Nya Rum';
const SH = 'Sköna Hem';
const ELLE = 'Elle Decoration';

export const chapters: Chapter[] = [
  {
    id: 'dusk',
    title: 'Dusk',
    tone: { bg: '#141210', fg: '#e9e4dc' },
    rows: [
      { layout: 'large', photos: [{ file: 'imgi_512_Nya-rum004.jpg', caption: NR, alt: 'Dim living room with a velvet sofa, fluted round table and a cluster of woven pendant shades.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_515_Nya-rum31.jpg', caption: NR, alt: 'Hallway vignette: a tall arched mirror, a hanging rail with a jacket and a rough timber plinth.' },
        { file: 'imgi_516_Nya-rum41.jpg', caption: NR, alt: 'Overhead view of stoneware plates, glasses and a white vase on a live-edge wooden table.' },
      ] },
      { layout: 'right', photos: [{ file: 'imgi_511_Nya-rum003.jpg', caption: NR, alt: 'A balloon-dog sculpture in a glass case on a dark walnut sideboard, berries in a vase beside it.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_519_Sköna-hem003.jpg', caption: SH, alt: 'Covered porch of a dark timber cabin with rattan armchairs and sheepskins, sea beyond the windows.' },
        { file: 'imgi_520_Sköna-hem004.jpg', caption: SH, alt: 'A black-stained cabin among pines on the archipelago, a dining table set on the deck.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_513_Nya-rum11.jpg', caption: NR, alt: 'Plaster-walled living room in blush and grey with a low sofa, sculpture and swing-arm wall lamp.' }] },
      { layout: 'large', photos: [{ file: 'imgi_531_NR-0031.jpg', alt: 'Dark still life: a bouquet of thistles and dahlias in a black vase among stacked plates.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_530_NR-0021.jpg', alt: 'Table from above, speckled blue plates, oysters and cutlery on a linen cloth.' },
        { file: 'imgi_532_NR-0041.jpg', alt: 'Table from above on dark linen: speckled bowls, mushrooms and trailing eucalyptus.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_529_NR-0011.jpg', alt: 'Dining table against a deep teal wall, dried flowers and wine glasses in low light.' }] },
      { layout: 'large', photos: [{ file: 'imgi_533_Belysning-RH001.jpg', alt: 'Dining room in brown and blush with a row of pendant lamps over an oak table.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_534_Belysning-RH002.jpg', alt: 'A glowing glass lamp and dark ceramic vase on a slim black console.' },
        { file: 'imgi_535_Belysning-RH003.jpg', alt: 'A black desk lamp throwing light across a small desk against a teal wall.' },
        { file: 'imgi_536_Belysning-RH004.jpg', alt: 'A pink upholstered chair with a mustard throw under a black woven pendant.' },
      ] },
      { layout: 'right', photos: [{ file: 'imgi_537_Belysning-RH005.jpg', alt: 'Hoop pendants and a bare bulb above a white dome lamp in a grey corner.' }] },
    ],
  },
  {
    id: 'blue-hour',
    title: 'Blue hour',
    tone: { bg: '#1b2227', fg: '#e3e6e6' },
    rows: [
      { layout: 'large', photos: [{ file: 'imgi_551_1.jpg', alt: 'A studio workspace with a slate-blue wall, open shelving and a long pale desk.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_552_2.jpg', alt: 'Desk with a geometric print, a pink task lamp and a black pendant against blue panelling.' },
        { file: 'imgi_553_3.jpg', alt: 'Flat lay of notebooks, scissors, colour swatches and a ribbed paper tray.' },
        { file: 'imgi_554_4.jpg', alt: 'Dark blue shelving with patterned boxes, a filing drawer unit and baskets.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_555_5.jpg', alt: 'Cork pinboard with a moon-phase print and swatches on a blue wall.' }] },
    ],
  },
  {
    id: 'northern-light',
    title: 'Northern light',
    tone: { bg: '#f2f0eb', fg: '#1d1b19' },
    rows: [
      { layout: 'large', photos: [{ file: 'imgi_556_RH-001.jpg', alt: 'Loft living room under tall factory windows, a leather sofa among palms and woven chairs.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_582_ELLE-D1.jpg', caption: ELLE, alt: 'White dining room with tall windows, wooden chairs and a vintage botanical chart.' },
        { file: 'imgi_583_ELLE-D2.jpg', caption: ELLE, alt: 'A school chair and chrome trolley of bottles and terracotta pots under framed prints.' },
      ] },
      { layout: 'right', photos: [{ file: 'imgi_584_ELLE-D3.jpg', caption: ELLE, alt: 'Close detail of the trolley: books, glassware, a pine cone and a single white ranunculus.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_585_ELLE-D4.jpg', caption: ELLE, alt: 'A honey-coloured vintage cabinet with magnolia branch beneath a poster of birds.' },
        { file: 'imgi_586_ELLE-D5.jpg', caption: ELLE, alt: 'White kitchen with bentwood chairs, a black wall lamp and pans on rails.' },
        { file: 'imgi_587_ELLE-D6.jpg', caption: ELLE, alt: 'Kitchen wall rails hung with pans, ladles, glasses and a caged lamp.' },
      ] },
      { layout: 'row', photos: [
        { file: 'imgi_624_Veranda005.jpg', caption: 'Veranda', alt: 'A black step ladder used as a plant stand by a garden window.' },
        { file: 'imgi_626_Veranda006.jpg', caption: 'Veranda', alt: 'Glass veranda with potted plants, a watering can and chequered floor.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_627_S0011.jpg', alt: 'Study corner with grey geometric wall shapes, a sculpted head and a triangle rug.' }] },
      { layout: 'right', photos: [{ file: 'imgi_628_S0021.jpg', alt: 'Grey sideboard with stacked boxes and brass lamps on parquet.' }] },
    ],
  },
  {
    id: 'pastel',
    title: 'Pastel',
    tone: { bg: '#f3e8e3', fg: '#2a1f1c' },
    rows: [
      { layout: 'large', photos: [{ file: 'imgi_652_005.jpg', alt: 'Blush dining room with paper pom-pom lights over a white-draped table and rattan chair.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_650_NY-Omslag.jpg', alt: 'Arched windows, pom-pom lights and a glass cabinet in a pale pink room.' },
        { file: 'imgi_651_002.jpg', alt: 'Glass shelves of coral ceramic pumpkins, patterned boxes and peonies.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_653_001.jpg', alt: 'Scalloped white plates arranged from above on a pink plaster surface.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_654_003.jpg', alt: 'A grey vanity desk with a pink lamp, flip-up mirror and blossoms.' },
        { file: 'imgi_655_004.jpg', alt: 'Peonies in a glass vase beside stacked plates and coupes of champagne.' },
      ] },
      { layout: 'large', photos: [{ file: 'imgi_635_Hornsgatan002.jpg', alt: 'Children’s room with harlequin wallpaper, a yellow bookcase and pink floor lamp.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_647_Bord001.jpg', alt: 'Brass and mint side tables arranged on a pale green studio sweep.' },
        { file: 'imgi_648_Bord002.jpg', alt: 'Walnut nesting tables and a tilted tabletop against a grey studio wall.' },
        { file: 'imgi_649_Bord003.jpg', alt: 'White wire tables and a red base on a coral studio sweep.' },
      ] },
      { layout: 'right', photos: [{ file: 'imgi_640_Insp004.jpg', alt: 'Mint ceramics, a green pendant and a toy soldier on a pale green cabinet.' }] },
    ],
  },
  {
    id: 'copper-and-oak',
    title: 'Copper & oak',
    tone: { bg: '#ece7df', fg: '#211d19' },
    rows: [
      { layout: 'large', photos: [{ file: 'imgi_681_aa1.jpg', alt: 'Kitchen with a copper splashback, oak drawer fronts and open shelves.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_684_Plaza005.jpg', alt: 'A brass pendant over an oak kitchen with ceramic birds on floating shelves.' },
        { file: 'imgi_685_Plaza006.jpg', alt: 'Close up of two copper saucepans on a glossy white counter.' },
      ] },
      { layout: 'large', photos: [{ file: 'imgi_680_a1.jpg', alt: 'Long pale kitchen with a window seat, plants and an enamel casserole on the counter.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_683_Plaza002.jpg', alt: 'Kitchen sink with botanical pear prints on clipboards and a leaf-print towel.' },
        { file: 'imgi_686_Plaza008.jpg', alt: 'White shelving with terracotta cups and a stacked white vase holding greenery.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_687_Plaza0012.jpg', alt: 'Flat lay on black: a cast-iron pot, copper tiles, brass cutlery and black knives.' }] },
      { layout: 'large', photos: [{ file: 'imgi_682_aaa1.jpg', alt: 'Bright white kitchen under a sloping ceiling with open shelves and a steel hood.' }] },
    ],
  },
  {
    id: 'open-air',
    title: 'Open air',
    tone: { bg: '#f4f4f2', fg: '#1b1c1d' },
    rows: [
      { layout: 'large', photos: [{ file: 'imgi_678_x.jpg', alt: 'A woman in a sun hat looks out to sea from a deck of woven outdoor sofas.' }] },
      { layout: 'right', photos: [{ file: 'imgi_679_xx.jpg', alt: 'Dark rattan lounge set beneath a grey parasol on a terrace above the sea.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_667_Pacific-sid-68.jpg', alt: 'White dining room with black leather chairs and a chartreuse wall.' },
        { file: 'imgi_666_Nova.jpg', alt: 'White bedroom with a red throw, red reading lamp and a wall clock.' },
      ] },
      { layout: 'row', photos: [
        { file: 'imgi_665_New-york-Sid-94-1.jpg', alt: 'Bedroom with a cobalt headboard wall and a window onto trees.' },
        { file: 'imgi_668_Smile-Sid-92.jpg', alt: 'Bright bedroom with a green chair, a tartan duvet and a black pendant.' },
      ] },
      { layout: 'left', photos: [{ file: 'imgi_662_Filippa-Sid-70.jpg', alt: 'White dining set against a vivid orange wall, film reels framed alongside.' }] },
      { layout: 'row', photos: [
        { file: 'imgi_663_Mattor0001.jpg', alt: 'Rugs in jute, moss green and grey rolled and laid across a white floor.' },
        { file: 'imgi_664_Mattor0002.jpg', alt: 'Striped runners on white stairs, a blue rug rolled beside them.' },
      ] },
      { layout: 'row', photos: [
        { file: 'imgi_694_A.jpg', alt: 'Living room with a black timber wall, fireplace and sofa set with candles.' },
        { file: 'imgi_701_Yesterday.jpg', alt: 'Petrol-blue wall above a tufted sofa with blue cushions.' },
        { file: 'imgi_728_001.jpg', alt: 'Classic drawing room with wing chairs and a sofa facing tall curtained windows.' },
      ] },
    ],
  },
];

/** Every photograph in viewing order — drives the lightbox and index. */
export const sequence: (Photo & { chapter: string })[] = [
  { ...site.hero, chapter: chapters[0].title },
  ...chapters.flatMap((c) => c.rows.flatMap((r) => r.photos.map((p) => ({ ...p, chapter: c.title })))),
];
