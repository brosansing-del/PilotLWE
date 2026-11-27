---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import PoliticalOrganisation from '../../components/PoliticalOrganisation.astro';

/* The existing chapter array is copied here from PilotLWE during installation. */
__PRESERVED_CHAPTER_ARRAY__

const overviewPhases = [
 {id:'pwg-mcc',number:'03',period:'1980s',title:'PWG and MCC consolidation',intro:'The People’s War Group develops a strong base in Andhra Pradesh, while the Maoist Communist Centre expands separately in Bihar and the adjoining eastern belt.',location:'Andhra Pradesh, Bihar and adjoining regions',issue:'Organisational consolidation'},
 {id:'convergence',number:'04',period:'1990s–2004',title:'Expansion and convergence',intro:'Insurgent networks expand through forested and tribal regions of central and eastern India as major Maoist formations move gradually toward organisational convergence.',location:'Central and eastern India',issue:'Expansion and convergence'},
 {id:'cpi-maoist',number:'05',period:'2004–2010',title:'CPI (Maoist) and wider expansion',intro:'The merger of the People’s War Group and Maoist Communist Centre creates CPI (Maoist), consolidating armed structures across a wider geographical belt.',location:'Central and eastern India',issue:'Party merger and expansion'},
 {id:'contraction',number:'06',period:'2011–Present',title:'Contraction and transformation',intro:'Security pressure, leadership losses, surrenders, infrastructure expansion and greater administrative access reshape the movement’s geography and operating space.',location:'Multiple affected states',issue:'Contraction and transition'},
];
const allPhases = [
  ...chapters.map((c) => ({...c, period:c.period || '', location:c.id==='naxalbari' ? 'Naxalbari, West Bengal' : 'Multiple states', issue:c.id==='naxalbari' ? 'Agrarian unrest' : 'Formation and fragmentation'})),
  ...overviewPhases.filter((phase) => !chapters.some((c) => c.id===phase.id)),
];
const phases = allPhases.sort((a,b)=>Number(a.number)-Number(b.number));
const subsectionTitles: Record<string,string[]> = {
  'naxalbari':['Agrarian conditions and grievances','Political and ideological background','The uprising and its leadership','Confrontation and police action','The movement’s early setbacks','Strategic differences','Legacy and wider political response'],
  'formation-of-cpi-ml':['A new coordination platform','Political strategy and ideological disagreements','The first organisational divisions','Establishment of CPI (ML)','Public announcement and early programme','Disputes over mass mobilisation','Leadership and party programme','Implementation of armed strategy','Police repression and organisational disruption','Growing divisions','Fragmentation and the loss of leadership','The turning point of 1972']
};
const chapterGroups = (chapter: (typeof phases)[number]) => {
  const paragraphs = 'paragraphs' in chapter && Array.isArray(chapter.paragraphs) ? chapter.paragraphs : [];
  return paragraphs.map((text,index)=>({title:subsectionTitles[chapter.id]?.[index] || `Historical account · ${index+1}`,text}));
};
---
<BaseLayout title="History of the Naxalite Movement | The Naxal Archive" description="Historical evolution and political organisation of the Naxalite movement in India.">
  <Header />
  <main class="museum-history" id="historical-record">
    <div class="mh-shell">
      <header class="mh-head">
        <h1>History of the Naxalite Movement</h1>
      </header>
      <nav class="mh-parts" aria-label="History sections">
        <a href="#naxalbari" data-history-tab="phases">Historical Evolution</a>
        <a href="#political-organisation" data-history-tab="organisation">Organisation &amp; Leadership</a>
      </nav>
      <section class="mh-evolution" id="historical-evolution" aria-label="Historical evolution">
        <nav class="mh-timeline" aria-label="Select historical phase">
          {phases.map((c) => (
            <a href={`#${c.id}`} data-history-phase-link={c.id} aria-label={`${c.period}: ${c.title}`}>
              <span class="mh-timeline-year">{c.period}</span>
              <span class="mh-timeline-name">{c.title}</span>
            </a>
          ))}
        </nav>
        <div class="mh-reading" data-phase-reading>
          {phases.map((chapter) => (
            <article id={chapter.id} class="mh-chapter" data-history-chapter={chapter.id}>
              <div class="mh-chapter-top"><span class="mh-chapter-index">PHASE {chapter.number}</span><span class="mh-chapter-period">{chapter.period}</span></div>
              <h2>{chapter.title}</h2>
              <p class="mh-deck">{chapter.intro}</p>
              <dl class="mh-facts">
                <div><dt>Period</dt><dd>{chapter.period}</dd></div>
                <div><dt>Location</dt><dd>{chapter.location}</dd></div>
                <div><dt>Key issue</dt><dd>{chapter.issue}</dd></div>
              </dl>
              {chapterGroups(chapter).length ? (
                <div class="mh-prose">
                  {chapterGroups(chapter).map((part,index) => (
                    <section class="mh-subsection" id={`${chapter.id}-section-${index+1}`}>
                      <h3>{part.title}</h3>
                      <p>{part.text}</p>
                    </section>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
          <nav class="mh-pager" aria-label="Move between historical phases">
            <button type="button" data-mh-prev>← Previous</button>
            <span data-mh-count aria-live="polite">Phase 1 of 6</span>
            <button type="button" data-mh-next>Next →</button>
          </nav>
        </div>
      </section>
      <div class="mh-organisation" data-history-organisation>
        <PoliticalOrganisation />
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>
<style>
  .museum-history{--mh-paper:#f5f0e7;--mh-ink:#192d25;--mh-muted:#665e55;--mh-rust:#9e4e32;--mh-line:#d8cec0;background:var(--mh-paper);color:var(--mh-ink);min-height:70vh;font-family:Georgia,'Times New Roman',serif;padding:30px 0 90px}
  .museum-history *{box-sizing:border-box}.mh-shell{width:min(1180px,calc(100% - 44px));margin:auto}
  .mh-head{padding:6px 0 23px}.mh-head h1{margin:0;color:var(--mh-ink);font:700 clamp(33px,4.4vw,58px)/1.08 Georgia,serif;letter-spacing:-.045em}
  .mh-parts{display:flex;gap:32px;flex-wrap:wrap;border-bottom:1px solid var(--mh-line)}.mh-parts a{color:#5c5b50;text-decoration:none;padding:13px 2px 15px;font:750 13px/1.4 system-ui,sans-serif;border-bottom:3px solid transparent}.mh-parts a[aria-current="page"],.mh-parts a:hover{color:var(--mh-rust);border-color:var(--mh-rust)}
  .mh-timeline{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0;border-bottom:1px solid var(--mh-line);margin:14px 0 34px}.mh-timeline a{min-width:0;padding:17px 12px 20px;border-bottom:3px solid transparent;text-decoration:none;color:var(--mh-ink);transition:background .18s,border-color .18s}.mh-timeline a+a{border-left:1px solid var(--mh-line)}.mh-timeline a:hover{background:#ece4d8}.mh-timeline a[aria-current="step"]{background:#efe5d7;border-bottom-color:var(--mh-rust)}.mh-timeline-year{display:block;color:var(--mh-rust);font:800 11px/1.4 system-ui,sans-serif;margin-bottom:7px}.mh-timeline-name{display:block;font:650 13px/1.35 Georgia,serif}
  .mh-reading{max-width:830px;margin:0 auto}.mh-chapter{scroll-margin-top:25px}.mh-chapter-top{display:flex;align-items:center;gap:16px;color:var(--mh-rust);font:800 11px/1.4 system-ui,sans-serif;letter-spacing:.09em}.mh-chapter-period{color:#786e61}.mh-chapter h2{font:700 clamp(35px,4vw,44px)/1.12 Georgia,serif;letter-spacing:-.035em;margin:15px 0 18px}.mh-deck{font:400 19px/1.6 Georgia,serif;color:#554f46;max-width:760px;margin:0 0 22px}
  .mh-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;padding:18px 0 19px;margin:0 0 32px;border-top:1px solid var(--mh-line);border-bottom:1px solid var(--mh-line)}.mh-facts div{min-width:0}.mh-facts dt{font:700 10px/1.3 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#846953;margin-bottom:5px}.mh-facts dd{font:650 14px/1.4 Georgia,serif;margin:0}
  .mh-prose{max-width:780px}.mh-subsection{margin:0 0 33px}.mh-subsection h3{font:700 23px/1.2 Georgia,serif;letter-spacing:-.018em;margin:0 0 13px;color:var(--mh-ink)}.mh-subsection p,.mh-overview p{font:400 18px/1.83 Georgia,serif;color:#333b34;margin:0}.mh-overview{max-width:780px}.mh-overview .mh-note{font:italic 14px/1.6 Georgia,serif;color:#806d5f;margin-top:20px}
  .mh-pager{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:36px;padding:24px 0;border-top:1px solid var(--mh-line)}.mh-pager button{background:transparent;border:1px solid #b7a899;border-radius:3px;color:var(--mh-ink);padding:12px 17px;cursor:pointer;font:750 12px system-ui,sans-serif}.mh-pager button:hover:not(:disabled){background:#e8ded0;border-color:var(--mh-rust)}.mh-pager button:disabled{opacity:.35;cursor:default}.mh-pager span{font:700 12px/1.4 system-ui,sans-serif;color:var(--mh-muted)}
  .mh-organisation{margin-top:18px}
  .museum-history a:focus-visible,.museum-history button:focus-visible{outline:3px solid var(--mh-rust);outline-offset:3px}
  @media(max-width:900px){.mh-timeline{display:flex;overflow-x:auto;scrollbar-width:thin}.mh-timeline a{flex:0 0 150px}.mh-reading{max-width:100%}}
  @media(max-width:600px){.museum-history{padding:18px 0 54px}.mh-shell{width:calc(100% - 32px)}.mh-head h1{font-size:37px}.mh-parts{gap:20px}.mh-parts a{font-size:12px}.mh-timeline{margin-bottom:28px}.mh-timeline a{flex-basis:140px}.mh-chapter h2{font-size:36px}.mh-deck{font-size:17px}.mh-facts{gap:10px}.mh-facts dd{font-size:12px}.mh-subsection h3{font-size:21px}.mh-subsection p,.mh-overview p{font-size:17px;line-height:1.77}.mh-pager button{padding:10px}.mh-pager span{font-size:11px}}
</style>
<script>
  // Enhancement runs after the document is available; without JS all historical text remains readable.
  const root = document.querySelector<HTMLElement>('.museum-history');
  if (root) {
    const timeline = [...root.querySelectorAll<HTMLAnchorElement>('[data-history-phase-link]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-history-chapter]')];
    const org = root.querySelector<HTMLElement>('[data-history-organisation]');
    const evolution = root.querySelector<HTMLElement>('.mh-evolution');
    const tabs = [...root.querySelectorAll<HTMLAnchorElement>('[data-history-tab]')];
    const prev = root.querySelector<HTMLButtonElement>('[data-mh-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-mh-next]');
    const counter = root.querySelector<HTMLElement>('[data-mh-count]');
    const readHash = () => decodeURIComponent(window.location.hash.slice(1));
    const select = (value:string, scroll = false) => {
      const idx = panels.findIndex((p) => p.id === value || value.startsWith(p.id+'-section-'));
      const organisationSelected = value === 'political-organisation' || value.startsWith('po-topic-');
      const index = idx >= 0 ? idx : 0;
      if (evolution) evolution.hidden = organisationSelected;
      if (org) org.hidden = !organisationSelected;
      panels.forEach((p,i) => p.hidden = i !== index);
      timeline.forEach((a,i) => { if(i===index)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current'); });
      tabs.forEach((a,i) => { if ((i===1) === organisationSelected) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
      if (prev) prev.disabled = organisationSelected || index===0;
      if (next) next.disabled = organisationSelected || index===panels.length-1;
      if (counter) counter.textContent = `Phase ${index+1} of ${panels.length}`;
      if (scroll) root.scrollIntoView({block:'start',behavior:'auto'});
    };
    select(readHash());
    window.addEventListener('hashchange',()=>select(readHash(),true));
    prev?.addEventListener('click',()=>{const at=panels.findIndex((p)=>!p.hidden);if(at>0)window.location.hash=panels[at-1].id;});
    next?.addEventListener('click',()=>{const at=panels.findIndex((p)=>!p.hidden);if(at>=0&&at<panels.length-1)window.location.hash=panels[at+1].id;});
  }
</script>
