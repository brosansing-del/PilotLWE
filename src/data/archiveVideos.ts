/**
 * The Naxal Archive: video catalogue.
 *
 * Add a new entry to publish another video. The page layouts pick it up
 * automatically. Titles and summaries must reflect what editors have verified.
 * Thumbnails are served by YouTube from each video ID.
 */
export type ArchiveVideo = {
  slug: string;
  kind: 'interview' | 'victim';
  title: string;
  context: string;
  description: string;
  youtubeId: string;
  publisher?: string;
  reviewed: boolean;
};

export const archiveVideos: ArchiveVideo[] = [
  
  { 
    slug: "bastar-odisha-former-ied-expert",
    kind: "interview",
    title: "From Maoist Insurgent to Mainstream Life: Pandu Dada’s Story",
    context: "Opinions / Bastar–Odisha border",
    description: "Surrendered Maoist Pandu Dada from Chandameta recounts his decade-long association with the insurgency. He describes the hardships, isolation and constant fear of death that eventually led him to abandon armed struggle and return to mainstream society in 2022.",
    youtubeId: "nJTdvrmsYHA",
    publisher: "Bastar Talkies",
    reviewed: false,
  },
    {
    slug: 'sonu-post-surrender',
    kind: 'interview',
    title: 'Bhupathi’s Surrender: Ending 43 Years of Armed Struggle',
    context: 'Former Politburo member / Post-surrender interview',
    description: 'Former CPI (Maoist) Politburo member Mallojula Venugopal Rao, alias Bhupathi, reflects on the movement’s strategic failures and declining public support. Following his surrender in Gadchiroli, he urges remaining cadres to abandon violence and work within the constitutional framework.',
    youtubeId: '3xPH45Wf6fQ',
    publisher: "IANS TV",
    reviewed: false,
  },
  {
    slug: 'girdhar-post-surrender',
    kind: 'interview',
    title: 'Former Maoist Commander Girdhar Reveals the Insurgency’s Inner Workings',
    context: 'Former Gadchiroli DVC secretary / Interview',
    description: 'After 28 years in the Maoist movement, former Gadchiroli commander Girdhar reveals its extortion networks, parallel governance and violent Jan Adalats. He explains how security operations, rural development and declining public support influenced his decision to surrender.',
    youtubeId: 'HDkOddSX81Q',
    publisher: "IndiaTV",
    reviewed: false,
  },

  {
    slug: 'ramdher-guerrilla-life',
    kind: 'interview',
    title: 'Lalita’s Journey: Leaving Behind 35 Years of Maoist Insurgency',
    context: 'Former cadre / Personal account',
    description: 'Former Maoist Divisional Committee member Lalita recounts 35 years of hardship, fear, illness and restrictions on family life. Following her surrender alongside her husband Ramdher, she reflects on the personal sacrifices of underground life and her return to mainstream society.',
    youtubeId: 'q8WtjhbML8s',
    publisher: "Bastar Talkies",
    reviewed: false,
  },
  {
  slug: 'security-force-story-01',
  kind: 'victim',
  title: '2014 Sukma Attack: 14 CRPF Killed, Human Shield Allegations',
  context: 'Victims’ Corner / Video report',
  description: 'In December 2014, a Maoist ambush in Sukma’s Kasalpada forest claimed the lives of 14 CRPF personnel and injured at least 13 others. Survivors recount the incident and allege that Maoists used women and children as human shields, endangering civilian lives.',
  youtubeId: 'A16768P8ZZc',
  publisher: 'NDTV',
  reviewed: false,
},



  {
    slug: 'security-force-story-02',
    kind: 'victim',
    title: "2017 Burkapal Attack: Injured CRPF Survivor Recounts Maoist Ambush",
    context: 'Video report / Victims\u2019 Corner',
    description: "In April 2017, a Maoist ambush in Sukma’s Burkapal claimed the lives of 25 CRPF jawans and injured six others. Survivor Jitendra Kumar recounts the horrific attack on personnel protecting road construction work, highlighting the devastating human cost of Maoist violence.",
    youtubeId: 'RbozFkKVOIA',
    publisher: "ABPLIVE",
    reviewed: false,
  },
  {
    slug: 'security-force-story-03',
    kind: 'victim',
    title: "2018 Dantewada Attack: Doordarshan Crew Member Records Message Amid Maoist Ambush",
    context: 'Video report / Victims\u2019 Corner',
    description: "On October 30, 2018, a Maoist ambush in Chhattisgarh’s Dantewada district claimed the lives of Doordarshan cameraman Achyutananda Sahu and two state police personnel while they were traveling for election coverage. Amid heavy gunfire, surviving Doordarshan crew member Mormukut Sharma recorded a raw, emotional selfie video from the ground for his mother, describing being surrounded by insurgents and fearing he would not survive.",
    youtubeId: 'BaaLxMXPcZw',
    publisher: "The Quint",
    reviewed: false,
  },
  {
    slug: 'security-force-story-04',
    kind: 'victim',
    title: "2023 Dantewada IED Blast: 10 DRG Jawans and Civilian Driver Killed",
    context: 'Video report / Victims\u2019 Corner',
    description: "In Chhattisgarh’s Dantewada district, 10 District Reserve Guard (DRG) personnel and their civilian driver were killed when Maoists blew up their vehicle using an improvised explosive device (IED). The security team was returning from an anti-Maoist search operation.",
    youtubeId: '7DJhVw-Wb_c',
    publisher: "NDTV",
    reviewed: false,
  },

  {
    slug: "santosh-poyam-ied-survivor",
    kind: "victim",
    title: "Bastar IED Blast Victim: 20-Year-Old Santosh Poyam Recounts Losing Both Legs",
    context: "IED blast survivor / Personal story",
    description: "Twenty-year-old Santosh Poyam, a tribal youth from Sonapal in Bastar, recounts how a Maoist-planted improvised explosive device (IED) shattered his life when he was 19.",
    youtubeId: "u7oUVf7sYVE",
    publisher: "IBC24 BASTAR",
    reviewed: false,
  },
  {
    slug: "additional-sp-akash-rao-ied-blast",
    kind: "victim",
    title: "Sukma IED Attack: Additional SP Akash Rao Giripunje Killed",
    context: "Security-force casualties / Video news report",
    description: "While inspecting a limestone quarry in Sukma’s Konta area, Additional SP Akash Rao Giripunje was killed in a targeted command-IED blast and two accompanying officers (TI Sonal Gwal and SDOP Bhanu Pratap Chandrakar) sustained serious injuries. ",
    youtubeId: "Vh2MLbve1XA",
    publisher: "IBC24 BASTAR",
    reviewed: false,
  },
  {
    slug: "pedda-korma-conflict-impact",
    kind: "victim",
    title: "June 2025 Pedda Korma Killings: Three Villagers Murdered in Retaliation",
    context: "Conflict-affected community / Ground report",
    description: "On June 17, 2025, Maoist insurgents stormed the remote village of Pedda Korma in Chhattisgarh’s Bijapur district and killed three villagers—relatives of surrendered commander Dinesh Modiyam, including a 13-year-old boy. ",
    youtubeId: "aYUNSXZgQ2I",
    publisher: "IBC24 BASTAR",
    reviewed: false,
  },
  {
    slug: "madanwada-2009-attack",
    kind: "victim",
    title: "2009 Madanwada Ambush: SP Vinod Kumar Choubey and Nearly 30 Jawans Killed",
    context: "2009 attack / Security-force victims",
    description: "On 12 July 2009, a deadly Maoist ambush in Madanwada, Chhattisgarh, claimed the lives of nearly 30 security personnel, including SP Vinod Kumar Choubey, the state's first IPS officer killed in Maoist violence. He was posthumously awarded the Kirti Chakra.",
    youtubeId: "G8SnQcGXgqA",
    publisher: "Nayi Drishti Bindu News",
    reviewed: false,
  },
  {
    slug: "sukalu-ex-maoist-interview",
    kind: "interview",
    title: "Sukalu Ram Kashyap: From Maoist Militia to Peaceful Family Life",
    context: "Former Maoist / Interview",
    description: "Former Jan Militia president Sukalu Ram Kashyap recounts his disillusionment with the Maoist movement and eventual surrender. Supported by government rehabilitation initiatives, he is now rebuilding his life with his four children and participating in community activities.",
    youtubeId: "BuUl1Rl1OSA",
    publisher: "IBC24 BASTAR",
    reviewed: false,
  },
  {
    slug: "venugopal-armed-struggle-interview",
    kind: "interview",
    title: "Venugopal: Reflections on the Failure of Armed Struggle",
    context: "Former Maoist Politburo member / Statement",
    description: "Former CPI (Maoist) Politburo member Venugopal acknowledges that prolonged armed struggle alienated the movement from the public. Criticising the leadership’s resistance to change, he appeals to remaining cadres to abandon violence and pursue peaceful engagement within the law.",
    youtubeId: "24N8nU5bDFE",
    publisher: "IBC24 BASTAR",
    reviewed: false,
  },
  {
    slug: "rupesh-mass-surrenders-explanation",
    kind: "interview",
    title: "Former Maoist Leader Rupesh Reveals Internal Divisions Over Peace Talks",
    context: "Former Maoist / Interview",
    description: "Surrendered Central Committee member Rupesh rejects allegations of betrayal and reveals disagreements within CPI (Maoist) over ceasefire proposals and peace talks. He questions the remaining leadership’s strategic decisions and urges cadres to reassess the consequences of continued armed struggle.",
    youtubeId: "T6eLCj8KXaI",
    publisher: "IBC24 BASTAR",
    reviewed: false,
  },
  {
    slug: "jhiram-ghati-former-maoists-account",
    kind: "interview",
    title: "2013 Jhiram Ghati Attack: Former Maoist Leader Admits Grave Mistake",
    context: "Jhiram Ghati / Former-cadre testimony",
    description: "Former Maoist Central Committee member Rupesh acknowledges the killing of Congress leaders and innocent civilians in the 2013 Jhiram Ghati attack as a grave mistake. He expresses regret and reflects on the consequences of prolonged armed insurgency.",
    youtubeId: "8IQhM6xOatE",
    publisher: "NDTV MP Chhattisgarh",
    reviewed: false,
  },
  {
    slug: "sabyasachi-panda-hostage-interview",
    kind: "interview",
    title: "2012 Odisha Hostage Crisis: Maoist Leader Sabyasachi Panda Speaks Out",
    context: "Maoist leader / Media interview account",
    description: "An interview with Odisha Maoist leader Sabyasachi Panda examines the kidnapping of two Italian nationals in 2012. The report explores his stated justifications, political demands and internal divisions, highlighting the impact of Maoist insurgency on civilian safety.",
    youtubeId: "sqklOQ7TXjk",
    publisher: "NDTV",
    reviewed: false,
  },
];

export function youtubeWatchUrl(video: ArchiveVideo): string {
  return `https://www.youtube.com/watch?v=${video.youtubeId}`;
}

export function youtubeThumbnail(video: ArchiveVideo): string {
  return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
}
