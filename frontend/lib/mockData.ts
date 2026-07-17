// =============================================================
// Inkveil — Mock Data Layer
// Fake JSON matching §10 schemas. No backend calls.
// =============================================================

export const genres = [
  { _id: 'g1', name: 'Werewolf', slug: 'werewolf' },
  { _id: 'g2', name: 'Romance', slug: 'romance' },
  { _id: 'g3', name: 'Fantasy', slug: 'fantasy' },
  { _id: 'g4', name: 'Mafia', slug: 'mafia' },
  { _id: 'g5', name: 'Billionaire', slug: 'billionaire' },
  { _id: 'g6', name: 'Thriller', slug: 'thriller' },
  { _id: 'g7', name: 'Historical', slug: 'historical' },
  { _id: 'g8', name: 'Sci-Fi', slug: 'sci-fi' },
  { _id: 'g9', name: 'Dark Romance', slug: 'dark-romance' },
  { _id: 'g10', name: 'Urban Fantasy', slug: 'urban-fantasy' },
];

export const tags = [
  'Forbidden Love', 'Alpha Male', 'Second Chance', 'Enemies to Lovers',
  'Secret Identity', 'Arranged Marriage', 'Revenge', 'Supernatural',
  'Strong Female Lead', 'Slow Burn', 'Possessive', 'Fated Mates',
  'Royal', 'Betrayal', 'Redemption', 'Dark Past',
];

export const users = {
  reader: { _id: 'u1', name: 'Ananya Sharma', email: 'ananya@example.com', role: 'reader' as const, avatarUrl: '/avatars/reader.jpg', theme: 'light' as const, createdAt: '2025-09-14T10:00:00Z', status: 'active' as const },
  author: { _id: 'u2', name: 'Raven Blackwell', email: 'raven@example.com', role: 'author' as const, avatarUrl: '/avatars/author.jpg', theme: 'dark' as const, createdAt: '2025-06-01T08:00:00Z', status: 'active' as const },
  admin: { _id: 'u3', name: 'Kiran Mehta', email: 'kiran@inkveil.com', role: 'super_admin' as const, avatarUrl: '/avatars/admin.jpg', theme: 'light' as const, createdAt: '2025-01-01T00:00:00Z', status: 'active' as const },
};

export const authors = [
  { _id: 'a1', userId: 'u2', name: 'Raven Blackwell', bio: 'Writing dark romance and werewolf sagas since 2019. Two million reads and counting.', avatarUrl: 'https://i.pravatar.cc/150?img=47', followerCount: 14200, isApproved: true },
  { _id: 'a2', userId: 'u4', name: 'Elara Nocturne', bio: 'Fantasy worlds with morally grey heroes. Coffee addict. Cat person.', avatarUrl: 'https://i.pravatar.cc/150?img=45', followerCount: 8900, isApproved: true },
  { _id: 'a3', userId: 'u5', name: 'Victor Ashford', bio: 'Billionaire romances with a twist. Former finance bro turned full-time storyteller.', avatarUrl: 'https://i.pravatar.cc/150?img=12', followerCount: 22100, isApproved: true },
  { _id: 'a4', userId: 'u6', name: 'Luna Wilder', bio: 'Paranormal romance that keeps you up past midnight. Every. Single. Night.', avatarUrl: 'https://i.pravatar.cc/150?img=49', followerCount: 31500, isApproved: true },
  { _id: 'a5', userId: 'u7', name: 'Dante Moretti', bio: "Mafia dark romance. If you can't handle the heat, don't open the book.", avatarUrl: 'https://i.pravatar.cc/150?img=8', followerCount: 19400, isApproved: true },
];

export interface Book {
  _id: string;
  authorId: string;
  authorName: string;
  title: string;
  coverUrl: string;
  synopsis: string;
  language: string;
  targetAudience: 'female' | 'male' | 'general';
  contentRating: '4+' | '12+' | '16+' | '18+';
  novelType: 'original' | 'adaptation';
  genreId: string;
  genreName: string;
  tags: string[];
  status: 'draft' | 'ongoing' | 'completed';
  freeChapterCount: number;
  defaultChapterPrice: number;
  fullBookUnlockPrice: number;
  views: number;
  ratingAvg: number;
  ratingCount: number;
  chapterCount: number;
  createdAt: string;
  updatedAt: string;
}

export const books: Book[] = [
  { _id: 'b1', authorId: 'a1', authorName: 'Raven Blackwell', title: "The Alpha's Unwanted Bride", coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', synopsis: "When pack law forces the ruthless Alpha Kael to marry the one woman he swore to reject, neither expects the mate bond to burn this fiercely. Lira is no willing bride — she'd rather run than submit. But the forest is watching, ancient powers are stirring, and the real enemy isn't each other.", language: 'English', targetAudience: 'female', contentRating: '18+', novelType: 'original', genreId: 'g1', genreName: 'Werewolf', tags: ['Fated Mates', 'Alpha Male', 'Enemies to Lovers', 'Forbidden Love'], status: 'ongoing', freeChapterCount: 5, defaultChapterPrice: 8, fullBookUnlockPrice: 180, views: 342800, ratingAvg: 8.7, ratingCount: 1243, chapterCount: 67, createdAt: '2025-08-10T12:00:00Z', updatedAt: '2026-07-15T18:30:00Z' },
  { _id: 'b2', authorId: 'a2', authorName: 'Elara Nocturne', title: 'Throne of Ember and Ash', coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop', synopsis: "In the fractured kingdom of Velaris, magic costs blood — and the crown costs everything. Seraphina, a disgraced mage, is offered one chance at redemption: train the kingdom's most dangerous prisoner to wield flame without burning the realm down.", language: 'English', targetAudience: 'female', contentRating: '16+', novelType: 'original', genreId: 'g3', genreName: 'Fantasy', tags: ['Enemies to Lovers', 'Slow Burn', 'Strong Female Lead', 'Dark Past'], status: 'ongoing', freeChapterCount: 8, defaultChapterPrice: 6, fullBookUnlockPrice: 200, views: 198500, ratingAvg: 9.1, ratingCount: 876, chapterCount: 89, createdAt: '2025-07-22T09:00:00Z', updatedAt: '2026-07-14T14:00:00Z' },
  { _id: 'b3', authorId: 'a3', authorName: 'Victor Ashford', title: 'His Contract Wife', coverUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop', synopsis: "Aria Chen needed the money. Damien Blackstone needed a wife — on paper. A twelve-month marriage of convenience between a struggling artist and a tech billionaire with a PR crisis should have been simple. No feelings, no complications, just the contract.", language: 'English', targetAudience: 'female', contentRating: '16+', novelType: 'original', genreId: 'g5', genreName: 'Billionaire', tags: ['Arranged Marriage', 'Slow Burn', 'Secret Identity', 'Betrayal'], status: 'completed', freeChapterCount: 5, defaultChapterPrice: 10, fullBookUnlockPrice: 350, views: 587200, ratingAvg: 8.4, ratingCount: 2102, chapterCount: 124, createdAt: '2025-03-15T11:00:00Z', updatedAt: '2026-04-01T08:00:00Z' },
  { _id: 'b4', authorId: 'a5', authorName: 'Dante Moretti', title: 'Vow of Silence', coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', synopsis: "Valentina Russo was born into the most feared family in Naples — but she was never meant to know. Raised far from the blood and gunpowder, she built a quiet life. Until Luca Ferro, her father's enforcer, shows up at her door with a single instruction: come home, or they'll bring her home.", language: 'English', targetAudience: 'female', contentRating: '18+', novelType: 'original', genreId: 'g4', genreName: 'Mafia', tags: ['Possessive', 'Dark Past', 'Forbidden Love', 'Revenge'], status: 'ongoing', freeChapterCount: 4, defaultChapterPrice: 10, fullBookUnlockPrice: 220, views: 421300, ratingAvg: 9.3, ratingCount: 1587, chapterCount: 52, createdAt: '2025-10-01T07:00:00Z', updatedAt: '2026-07-16T22:00:00Z' },
  { _id: 'b5', authorId: 'a4', authorName: 'Luna Wilder', title: 'Moonbound: Pack of the Hollow', coverUrl: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=400&h=600&fit=crop', synopsis: "Sage never wanted to be a wolf. The bite was an accident — the bond was not. When she stumbles into Hollow Creek, a territory run by the most secretive pack in North America, she discovers that her 'accident' was anything but.", language: 'English', targetAudience: 'general', contentRating: '16+', novelType: 'original', genreId: 'g1', genreName: 'Werewolf', tags: ['Supernatural', 'Fated Mates', 'Strong Female Lead', 'Second Chance'], status: 'ongoing', freeChapterCount: 6, defaultChapterPrice: 7, fullBookUnlockPrice: 160, views: 276400, ratingAvg: 8.9, ratingCount: 934, chapterCount: 45, createdAt: '2025-12-05T15:00:00Z', updatedAt: '2026-07-13T10:00:00Z' },
  { _id: 'b6', authorId: 'a2', authorName: 'Elara Nocturne', title: 'The Last Siren of Elyndor', coverUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=600&fit=crop', synopsis: "The sirens were hunted to extinction three hundred years ago — or so the kingdom believes. Maris hides what she is behind fisherman's clothes and a silent tongue, until a shipwreck leaves a wounded prince on her shore.", language: 'English', targetAudience: 'female', contentRating: '12+', novelType: 'original', genreId: 'g3', genreName: 'Fantasy', tags: ['Forbidden Love', 'Royal', 'Slow Burn', 'Redemption'], status: 'completed', freeChapterCount: 10, defaultChapterPrice: 5, fullBookUnlockPrice: 150, views: 443100, ratingAvg: 9.5, ratingCount: 3210, chapterCount: 98, createdAt: '2025-02-14T08:00:00Z', updatedAt: '2025-12-20T16:00:00Z' },
  { _id: 'b7', authorId: 'a3', authorName: 'Victor Ashford', title: 'Boardroom Sins', coverUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=600&fit=crop', synopsis: "She's the new head of legal. He's the CEO with a hostile-takeover problem and zero respect for boundaries. When a corporate scandal forces them to work nights — alone — in his corner office, professionalism doesn't stand a chance.", language: 'English', targetAudience: 'female', contentRating: '18+', novelType: 'original', genreId: 'g5', genreName: 'Billionaire', tags: ['Enemies to Lovers', 'Alpha Male', 'Betrayal', 'Secret Identity'], status: 'ongoing', freeChapterCount: 5, defaultChapterPrice: 8, fullBookUnlockPrice: 190, views: 312700, ratingAvg: 8.2, ratingCount: 1065, chapterCount: 78, createdAt: '2025-09-20T10:00:00Z', updatedAt: '2026-07-10T21:00:00Z' },
  { _id: 'b8', authorId: 'a5', authorName: 'Dante Moretti', title: 'Blood Oath', coverUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=600&fit=crop', synopsis: "Three families. One city. And the woman caught between them all. When a decades-old blood oath resurfaces, demanding a bride from the Caruso family, nobody expects them to offer their most dangerous daughter.", language: 'English', targetAudience: 'female', contentRating: '18+', novelType: 'original', genreId: 'g9', genreName: 'Dark Romance', tags: ['Arranged Marriage', 'Possessive', 'Strong Female Lead', 'Revenge'], status: 'ongoing', freeChapterCount: 3, defaultChapterPrice: 12, fullBookUnlockPrice: 280, views: 189600, ratingAvg: 9.0, ratingCount: 742, chapterCount: 38, createdAt: '2026-01-10T13:00:00Z', updatedAt: '2026-07-16T19:00:00Z' },
  { _id: 'b9', authorId: 'a4', authorName: 'Luna Wilder', title: 'Cursed Bloodline', coverUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop', synopsis: "Every firstborn in the Thorne family dies before thirty. It's not a curse — it's a contract, signed in blood two centuries ago. When Rowan Thorne discovers the truth on his twenty-ninth birthday, he has one year to break a deal made with something that isn't human.", language: 'English', targetAudience: 'general', contentRating: '16+', novelType: 'original', genreId: 'g10', genreName: 'Urban Fantasy', tags: ['Supernatural', 'Dark Past', 'Second Chance', 'Redemption'], status: 'ongoing', freeChapterCount: 7, defaultChapterPrice: 6, fullBookUnlockPrice: 140, views: 156800, ratingAvg: 8.6, ratingCount: 523, chapterCount: 34, createdAt: '2026-03-01T11:00:00Z', updatedAt: '2026-07-15T08:00:00Z' },
  { _id: 'b10', authorId: 'a1', authorName: 'Raven Blackwell', title: 'Rejected Then Desired', coverUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop', synopsis: "He rejected her at the mating ceremony in front of the entire pack. Three years later, she returns — transformed, powerful, and mated to his rival. Alpha Damon thought rejecting the 'weak' omega was the smartest move he'd ever made.", language: 'English', targetAudience: 'female', contentRating: '18+', novelType: 'original', genreId: 'g1', genreName: 'Werewolf', tags: ['Fated Mates', 'Alpha Male', 'Revenge', 'Second Chance'], status: 'completed', freeChapterCount: 5, defaultChapterPrice: 8, fullBookUnlockPrice: 250, views: 892100, ratingAvg: 9.2, ratingCount: 4521, chapterCount: 156, createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-11-30T20:00:00Z' },
];


export interface Chapter {
  _id: string;
  bookId: string;
  order: number;
  title: string;
  wordCount: number;
  isFree: boolean;
  coinPrice: number;
  status: 'draft' | 'scheduled' | 'published';
  publishedAt: string | null;
}

export const chaptersForBook1: Chapter[] = [
  { _id: 'ch1', bookId: 'b1', order: 1, title: 'The Ceremony', wordCount: 842, isFree: true, coinPrice: 0, status: 'published', publishedAt: '2025-08-10T12:00:00Z' },
  { _id: 'ch2', bookId: 'b1', order: 2, title: 'Unwilling Vows', wordCount: 917, isFree: true, coinPrice: 0, status: 'published', publishedAt: '2025-08-12T12:00:00Z' },
  { _id: 'ch3', bookId: 'b1', order: 3, title: "The Alpha's Den", wordCount: 765, isFree: true, coinPrice: 0, status: 'published', publishedAt: '2025-08-14T12:00:00Z' },
  { _id: 'ch4', bookId: 'b1', order: 4, title: 'First Blood', wordCount: 890, isFree: true, coinPrice: 0, status: 'published', publishedAt: '2025-08-16T12:00:00Z' },
  { _id: 'ch5', bookId: 'b1', order: 5, title: 'The Forest Speaks', wordCount: 934, isFree: true, coinPrice: 0, status: 'published', publishedAt: '2025-08-18T12:00:00Z' },
  { _id: 'ch6', bookId: 'b1', order: 6, title: 'A Warning in Moonlight', wordCount: 812, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-08-20T12:00:00Z' },
  { _id: 'ch7', bookId: 'b1', order: 7, title: 'The Rival Pack', wordCount: 956, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-08-22T12:00:00Z' },
  { _id: 'ch8', bookId: 'b1', order: 8, title: 'Marked', wordCount: 887, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-08-24T12:00:00Z' },
  { _id: 'ch9', bookId: 'b1', order: 9, title: 'Running', wordCount: 921, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-08-26T12:00:00Z' },
  { _id: 'ch10', bookId: 'b1', order: 10, title: "The Elder's Prophecy", wordCount: 798, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-08-28T12:00:00Z' },
  { _id: 'ch11', bookId: 'b1', order: 11, title: 'Submission', wordCount: 845, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-08-30T12:00:00Z' },
  { _id: 'ch12', bookId: 'b1', order: 12, title: 'The Bond Ignites', wordCount: 910, isFree: false, coinPrice: 8, status: 'published', publishedAt: '2025-09-01T12:00:00Z' },
];

export const sampleChapterContent = `<h2>The Ceremony</h2><p>The great hall of the Silverwood Pack smelled of pine smoke and old blood. Lira stood at the edge of the stone dais, her fingers white-knuckled around the hem of her ceremonial dress — a thing of silver thread and someone else's expectations.</p><p>She didn't belong here.</p><p>That much was clear from the way the crowd parted around her, a gap of empty air where warmth should have been. Pack members she'd grown up beside now watched her with the careful blankness of people who'd already decided she was someone else's problem.</p><p>Alpha Kael Voss stood at the altar, if you could call a slab of river-stone an altar. He was everything the old stories promised an Alpha would be — tall, carved from shadow and certainty, with eyes the color of winter pine. He didn't look at her. He looked through her, the way you look through a window to check the weather.</p><p>"By the laws of the Elderwood Pact," the officiant began, her voice carrying across the hushed hall, "when no mate is claimed by the full moon of the twenty-fifth year, the Pack Council may bind one."</p><p><em>May.</em> Such a small word to carry so much cruelty.</p><p>Lira felt the weight of it settle on her shoulders like a physical thing. She'd had plans — a quiet life at the boundary of pack territory, a small garden, books smuggled from the human town three valleys over. Not this. Never this.</p><p>Kael's jaw tightened. She watched the muscle tick beneath his skin, once, twice, three times, like a clock counting down to an explosion.</p><p>"I accept the Council's decision," he said. His voice was flat. A door closing.</p><p>The officiant turned to her. Two hundred pairs of eyes followed.</p><p>"And you, Lira of the Eastern Border?"</p><p>She thought about running. The doors were twenty paces behind her, and she was fast — not Alpha-fast, but fast enough to reach the treeline. The forest would hide her. It always had.</p><p>But the forest was also where they'd find her. And the punishment for refusing a Council binding wasn't exile. It was worse. They'd strip her of pack status entirely. No territory. No protection. No name.</p><p>A rogue wolf in a world that ate rogue wolves alive.</p><p>"I accept," she said, and hated how steady her voice sounded.</p><p>The hall erupted in the polite, performative applause of people relieved the problem wasn't theirs. Kael didn't applaud. He turned, finally, and looked at her — really looked — and what Lira saw in those winter-pine eyes wasn't anger.</p><p>It was worse.</p><p>It was nothing at all.</p>`;

export const reviewsForBook1 = [
  { _id: 'r1', bookId: 'b1', userId: 'u10', userName: 'Priya M.', avatarUrl: '/avatars/reviewer1.jpg', rating: 9, text: "I stayed up until 3 AM reading this. The tension between Kael and Lira is absolutely electric.", helpfulCount: 42, createdAt: '2026-06-10T03:22:00Z' },
  { _id: 'r2', bookId: 'b1', userId: 'u11', userName: 'Ghost_Reader_', avatarUrl: '/avatars/reviewer2.jpg', rating: 8, text: "Strong world-building and the forced proximity trope is done really well here.", helpfulCount: 28, createdAt: '2026-05-22T18:45:00Z' },
  { _id: 'r3', bookId: 'b1', userId: 'u12', userName: 'Sana K.', avatarUrl: '/avatars/reviewer3.jpg', rating: 10, text: "This is the best werewolf romance I've read on any platform. Period.", helpfulCount: 67, createdAt: '2026-04-30T12:10:00Z' },
  { _id: 'r4', bookId: 'b1', userId: 'u13', userName: 'Arjun R.', avatarUrl: '/avatars/reviewer4.jpg', rating: 7, text: "Good story, solid characters. The last five chapters were incredible.", helpfulCount: 15, createdAt: '2026-03-18T09:30:00Z' },
];

export const ratingBreakdownForBook1: Record<number, number> = { 10: 312, 9: 287, 8: 245, 7: 178, 6: 98, 5: 54, 4: 32, 3: 18, 2: 11, 1: 8 };

export const coinPacks = [
  { _id: 'cp1', name: 'Starter', coinsGranted: 50, priceInr: 49, bonusPercent: 0, isActive: true },
  { _id: 'cp2', name: 'Popular', coinsGranted: 120, priceInr: 99, bonusPercent: 20, isActive: true },
  { _id: 'cp3', name: 'Value', coinsGranted: 300, priceInr: 199, bonusPercent: 50, isActive: true },
  { _id: 'cp4', name: 'Mega', coinsGranted: 800, priceInr: 499, bonusPercent: 60, isActive: true },
  { _id: 'cp5', name: 'Ultimate', coinsGranted: 2000, priceInr: 999, bonusPercent: 100, isActive: true },
];

export const wallet = { _id: 'w1', userId: 'u1', coinBalance: 342, updatedAt: '2026-07-16T14:00:00Z' };

export const transactions = [
  { _id: 't1', userId: 'u1', type: 'coin_purchase' as const, amountInr: 199, coinsSpent: null, coinPackId: 'cp3', bookId: null, chapterId: null, createdAt: '2026-07-15T10:00:00Z', description: 'Value Pack — 300 coins' },
  { _id: 't2', userId: 'u1', type: 'chapter_unlock' as const, amountInr: null, coinsSpent: 8, coinPackId: null, bookId: 'b1', chapterId: 'ch6', createdAt: '2026-07-15T11:30:00Z', description: "Unlocked Ch. 6 — The Alpha's Unwanted Bride" },
  { _id: 't3', userId: 'u1', type: 'chapter_unlock' as const, amountInr: null, coinsSpent: 8, coinPackId: null, bookId: 'b1', chapterId: 'ch7', createdAt: '2026-07-15T12:00:00Z', description: "Unlocked Ch. 7 — The Alpha's Unwanted Bride" },
  { _id: 't4', userId: 'u1', type: 'coin_purchase' as const, amountInr: 99, coinsSpent: null, coinPackId: 'cp2', bookId: null, chapterId: null, createdAt: '2026-07-10T09:00:00Z', description: 'Popular Pack — 120 coins' },
  { _id: 't5', userId: 'u1', type: 'chapter_unlock' as const, amountInr: null, coinsSpent: 10, coinPackId: null, bookId: 'b3', chapterId: 'ch-b3-6', createdAt: '2026-07-08T20:00:00Z', description: 'Unlocked Ch. 6 — His Contract Wife' },
];

export const readerLibrary = [
  { bookId: 'b1', progress: 0.18, lastReadChapter: 'ch5', lastReadAt: '2026-07-15T12:00:00Z' },
  { bookId: 'b4', progress: 0.35, lastReadChapter: 'ch-b4-8', lastReadAt: '2026-07-14T23:00:00Z' },
  { bookId: 'b2', progress: 0.05, lastReadChapter: 'ch-b2-2', lastReadAt: '2026-07-12T18:00:00Z' },
  { bookId: 'b6', progress: 0.72, lastReadChapter: 'ch-b6-45', lastReadAt: '2026-07-10T22:00:00Z' },
  { bookId: 'b3', progress: 1.0, lastReadChapter: 'ch-b3-124', lastReadAt: '2026-06-28T16:00:00Z' },
];

export const bookmarks = [
  { _id: 'bk1', userId: 'u1', bookId: 'b1', chapterId: 'ch5', createdAt: '2026-07-15T12:00:00Z' },
  { _id: 'bk2', userId: 'u1', bookId: 'b4', chapterId: 'ch-b4-8', createdAt: '2026-07-14T23:00:00Z' },
  { _id: 'bk3', userId: 'u1', bookId: 'b2', chapterId: 'ch-b2-2', createdAt: '2026-07-12T18:00:00Z' },
];


export const readingHistory = [
  { _id: 'rh1', userId: 'u1', bookId: 'b1', bookTitle: "The Alpha's Unwanted Bride", chapterId: 'ch5', chapterTitle: 'The Forest Speaks', readAt: '2026-07-15T12:00:00Z' },
  { _id: 'rh2', userId: 'u1', bookId: 'b1', bookTitle: "The Alpha's Unwanted Bride", chapterId: 'ch4', chapterTitle: 'First Blood', readAt: '2026-07-15T11:30:00Z' },
  { _id: 'rh3', userId: 'u1', bookId: 'b4', bookTitle: 'Vow of Silence', chapterId: 'ch-b4-8', chapterTitle: 'The Meeting', readAt: '2026-07-14T23:00:00Z' },
];

export const notifications = [
  { _id: 'n1', userId: 'u1', type: 'new_chapter', message: 'Raven Blackwell published a new chapter in "The Alpha\'s Unwanted Bride"', isRead: false, createdAt: '2026-07-16T18:00:00Z' },
  { _id: 'n2', userId: 'u1', type: 'promo', message: '🎉 Weekend special: Get 50% bonus coins on all packs!', isRead: false, createdAt: '2026-07-16T10:00:00Z' },
  { _id: 'n3', userId: 'u1', type: 'new_chapter', message: 'Dante Moretti published a new chapter in "Vow of Silence"', isRead: true, createdAt: '2026-07-15T20:00:00Z' },
];

export const authorBooks = [
  { _id: 'b1', title: "The Alpha's Unwanted Bride", coverUrl: '/covers/book1.jpg', status: 'ongoing' as const, chapterCount: 12, views: 342800, ratingAvg: 8.7, earnings: 24500, lastUpdated: '2026-07-15T18:30:00Z' },
  { _id: 'b10', title: 'Rejected Then Desired', coverUrl: '/covers/book10.jpg', status: 'completed' as const, chapterCount: 156, views: 892100, ratingAvg: 9.2, earnings: 87200, lastUpdated: '2025-11-30T20:00:00Z' },
];

export const adminStats = {
  activeReaders: 12450, activeAuthors: 342, booksPublished: 1876, booksThisMonth: 48,
  grossRevenue: 847500, revenueThisMonth: 124300,
  topBooks: [
    { title: 'Rejected Then Desired', author: 'Raven Blackwell', views: 892100, revenue: 87200 },
    { title: 'His Contract Wife', author: 'Victor Ashford', views: 587200, revenue: 65400 },
    { title: 'The Last Siren of Elyndor', author: 'Elara Nocturne', views: 443100, revenue: 52100 },
    { title: 'Vow of Silence', author: 'Dante Moretti', views: 421300, revenue: 48900 },
    { title: "The Alpha's Unwanted Bride", author: 'Raven Blackwell', views: 342800, revenue: 24500 },
  ],
};

export const testimonials = [
  { name: 'Meera S.', text: 'I discovered three new favorite authors here in one weekend. The reading experience is beautiful — no ads, no popups, just the story.' },
  { name: 'Rohan P.', text: 'Finally a platform that treats web fiction like real literature. The typography alone makes me want to keep reading.' },
  { name: 'Aisha K.', text: "The coin system is fair and transparent. I always know exactly what I'm paying for, and unlocked chapters stay mine forever." },
];

export function getBookById(id: string) { return books.find((b) => b._id === id) || null; }
export function getAuthorById(id: string) { return authors.find((a) => a._id === id) || null; }
export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}
export function formatINR(amount: number): string { return '₹' + amount.toLocaleString('en-IN'); }
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
