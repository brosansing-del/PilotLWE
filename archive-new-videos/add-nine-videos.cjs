/** Add nine editorial video records without overwriting earlier records. */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const target = path.join(root, 'src', 'data', 'archiveVideos.ts');
const dry = process.argv.includes('--dry-run');
const records = [
  {
    slug: 'santosh-poyam-ied-survivor', kind: 'victim',
    title: 'Santosh Poyam: Rebuilding Life After an IED Blast',
    context: 'IED blast survivor / Personal story',
    description: 'According to the supplied description, Santosh Poyam lost both legs in a Naxal IED blast and is working to rebuild his life. The full account and circumstances require review of the original video.',
    youtubeId: 'u7oUVf7sYVE', reviewed: false,
  },
  {
    slug: 'additional-sp-akash-rao-ied-blast', kind: 'victim',
    title: 'Additional SP Akash Rao: IED Blast Report',
    context: 'Security-force casualties / Video news report',
    description: 'The supplied Hindi headline reports that Additional SP Akash Rao died in an IED blast and two other officers were seriously injured. The date, location and circumstances remain to be checked against the recording.',
    youtubeId: 'Vh2MLbve1XA', reviewed: false,
  },
  {
    slug: 'pedda-korma-conflict-impact', kind: 'victim',
    title: 'Pedda Korma: Conflict, Security and Development',
    context: 'Conflict-affected community / Ground report',
    description: 'The supplied report headline describes the effect of Naxal violence on Pedda Korma and difficulties in accessing security and development services. Additional details await video review.',
    youtubeId: 'aYUNSXZgQ2I', reviewed: false,
  },
  {
    slug: 'madanwada-2009-attack', kind: 'victim',
    title: 'Madanwada Attack (2009): Remembering SP Vinod Kumar Choubey and the Personnel Killed',
    context: '2009 attack / Security-force victims',
    description: 'The supplied video headline revisits the 2009 Madanwada attack and states that SP Vinod Kumar Choubey and 30 personnel lost their lives. Exact casualty figures and the events covered require source verification.',
    youtubeId: 'G8SnQcGXgqA', reviewed: false,
  },
  {
    slug: 'sukalu-ex-maoist-interview', kind: 'interview',
    title: 'Sukalu: Why He Joined the Movement and How He Escaped',
    context: 'Former Maoist / Interview',
    description: 'The supplied interview title asks why Sukalu joined the Maoist organisation and how he escaped its control. Key quotations and chronology will be added after checking the video.',
    youtubeId: 'BuUl1Rl1OSA', reviewed: false,
  },
  {
    slug: 'venugopal-armed-struggle-interview', kind: 'interview',
    title: 'Venugopal: Reflections on the Failure of Armed Struggle',
    context: 'Former Maoist Politburo member / Statement',
    description: 'According to the supplied Hindi headline, former Politburo member Venugopal attributed the movement\'s failure to armed struggle. The precise remarks and context require review of the recording.',
    youtubeId: '24N8nU5bDFE', reviewed: false,
  },
  {
    slug: 'rupesh-mass-surrenders-explanation', kind: 'interview',
    title: 'Rupesh: An Explanation of Mass Surrenders',
    context: 'Former Maoist / Interview',
    description: 'An interview described by the contributor as an explanation by former Maoist Rupesh of mass surrenders. Specific arguments and remarks will be summarised after editorial review.',
    youtubeId: 'T6eLCj8KXaI', reviewed: false,
  },
  {
    slug: 'jhiram-ghati-former-maoists-account', kind: 'interview',
    title: 'Jhiram Ghati Attack: Former Maoists Speak',
    context: 'Jhiram Ghati / Former-cadre testimony',
    description: 'The supplied headline says former Maoists discussed aspects of the Jhiram Ghati attack and expressed regret. Specific claims and statements should be verified against the original recording.',
    youtubeId: '8IQhM6xOatE', reviewed: false,
  },
  {
    slug: 'sabyasachi-panda-hostage-interview', kind: 'interview',
    title: 'Sabyasachi Panda: Journalists Recount a Hostage-Release Interview',
    context: 'Maoist leader / Media interview account',
    description: 'The supplied description recounts journalists, including those from NDTV, interviewing Maoist leader Sabyasachi Panda. It says he announced plans to release a hostage to the media group. Details await review of the original account.',
    youtubeId: 'sqklOQ7TXjk', reviewed: false,
  },
];
function toCode(v) {
  return `  {\n    slug: ${JSON.stringify(v.slug)},\n    kind: ${JSON.stringify(v.kind)},\n    title: ${JSON.stringify(v.title)},\n    context: ${JSON.stringify(v.context)},\n    description: ${JSON.stringify(v.description)},\n    youtubeId: ${JSON.stringify(v.youtubeId)},\n    reviewed: false,\n  },`;
}
if (!fs.existsSync(target)) {
  console.error(`Cannot find ${target}. Run this from D:\\thenaxalarchive after installing the previous Opinions & Victims' Corner package.`);
  process.exitCode = 1;
} else {
  const original = fs.readFileSync(target, 'utf8');
  const anchor = /\n\];(?=\s*export function youtubeWatchUrl)/;
  if (!original.includes('export const archiveVideos') || !anchor.test(original)) {
    console.error('Unexpected archiveVideos.ts format. No files changed.');
    process.exitCode = 1;
  } else {
    const newEntries = records.filter(v => !new RegExp(`youtubeId:\\s*['\"]${v.youtubeId}['\"]`).test(original));
    console.log(`${newEntries.length} new videos; ${records.length - newEntries.length} already present.`);
    for (const e of newEntries) console.log(`  ${e.kind}: ${e.title}`);
    if (dry) {
      console.log('Dry run complete. No changes made.');
    } else if (!newEntries.length) {
      console.log('Nothing to add.');
    } else {
      const backup = target + '.before-nine-videos.bak';
      if (!fs.existsSync(backup)) fs.copyFileSync(target, backup);
      const updated = original.replace(anchor, '\n' + newEntries.map(toCode).join('\n') + '\n];');
      fs.writeFileSync(target, updated, 'utf8');
      console.log('Added to ' + target);
      console.log('Backup: ' + backup);
    }
  }
}
