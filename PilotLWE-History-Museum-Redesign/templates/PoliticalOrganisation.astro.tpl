---
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');
/* Existing Political Organisation analysis is injected from the user's local project. */
__PRESERVED_POLITICAL_ARRAY__
---
<section class="po-museum" id="political-organisation" aria-labelledby="po-title">
  <header class="po-museum-head">
    <h2 id="po-title">Political Organisation &amp; Leadership</h2>
  </header>
  <details class="po-diagram-expand">
    <summary>View organisational hierarchy diagram</summary>
    <figure class="po-diagram">
      <img src={`${BASE}/images/history/cpi-maoist-hierarchy.png`} alt="Editor-provided diagram illustrating the organisational hierarchy of CPI (Maoist)" loading="lazy" decoding="async" />
      <figcaption>Illustrative diagram provided by the site editor. Verify each organisational relationship against the cited constitutional source.</figcaption>
    </figure>
  </details>
  <nav class="po-topic-nav" aria-label="Organisation topics">
    {sections.map((section,i)=><a href={`#po-topic-${i+1}`} data-po-link={i+1} title={section.title}><span>{String(i+1).padStart(2,'0')}</span>{section.title}</a>)}
  </nav>
  <div class="po-reading">
    {sections.map((section,i)=>(
      <article class="po-article" id={`po-topic-${i+1}`} data-po-topic={i+1}>
        <div class="po-meta">ORGANISATION &amp; LEADERSHIP <span>SECTION {String(i+1).padStart(2,'0')}</span></div>
        <h3>{section.title}</h3>
        <div class="po-body">{section.paragraphs.map(p=><p>{p}</p>)}</div>
      </article>
    ))}
    <nav class="po-pager" aria-label="Move between organisation sections">
      <button type="button" data-po-prev>← Previous</button>
      <span data-po-counter aria-live="polite">Section 1 of {sections.length}</span>
      <button type="button" data-po-next>Next →</button>
    </nav>
  </div>
</section>
<style>
  .po-museum{--po-ink:#192d25;--po-rust:#9e4e32;--po-border:#d8cec0;color:var(--po-ink);font-family:Georgia,serif;scroll-margin-top:35px}
  .po-museum *{box-sizing:border-box}.po-museum-head{margin:20px 0 24px}.po-museum-head h2{font:700 clamp(34px,4vw,44px)/1.12 Georgia,serif;letter-spacing:-.03em;margin:0}
  .po-diagram-expand{margin:12px 0 24px}.po-diagram-expand summary{display:inline-block;cursor:pointer;color:#9e4e32;border-bottom:1px solid #a75a37;padding-bottom:5px;font:750 12px/1.5 system-ui,sans-serif}.po-diagram{margin:18px auto 28px;max-width:980px}.po-diagram img{display:block;width:100%;height:auto;max-height:530px;object-fit:contain;background:#fff;border:1px solid #d5cabc}.po-diagram figcaption{font:12px/1.5 system-ui,sans-serif;color:#71685c;margin-top:7px}
  .po-topic-nav{display:flex;gap:8px;overflow-x:auto;scrollbar-width:thin;padding:0 0 13px;margin-bottom:27px;border-bottom:1px solid var(--po-border)}.po-topic-nav a{flex:0 0 170px;min-height:72px;display:flex;flex-direction:column;gap:6px;padding:10px 12px;text-decoration:none;color:var(--po-ink);border:1px solid #d9cec1;font:650 12px/1.3 Georgia,serif;background:#fffcf7}.po-topic-nav a span{font:800 10px/1.2 system-ui,sans-serif;color:var(--po-rust)}.po-topic-nav a:hover,.po-topic-nav a[aria-current="step"]{background:#eadfd0;border-color:var(--po-rust)}
  .po-reading{max-width:780px;margin:0 auto}.po-article{scroll-margin-top:35px}.po-meta{font:800 10px/1.5 system-ui,sans-serif;letter-spacing:.08em;color:var(--po-rust)}.po-meta span{margin-left:14px;color:#81786c}.po-article h3{font:700 clamp(30px,3.6vw,42px)/1.16 Georgia,serif;letter-spacing:-.035em;margin:16px 0 24px}.po-body p{font:400 18px/1.82 Georgia,serif;margin:0 0 23px;color:#343b34}
  .po-pager{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:36px;padding-top:23px;border-top:1px solid var(--po-border)}.po-pager button{border:1px solid #baaa9a;background:transparent;padding:12px 15px;color:var(--po-ink);font:700 12px system-ui,sans-serif;cursor:pointer}.po-pager button:hover:not(:disabled){background:#eadfd0;border-color:var(--po-rust)}.po-pager button:disabled{opacity:.35;cursor:default}.po-pager span{font:700 12px system-ui,sans-serif;color:#666058}
  .po-museum a:focus-visible,.po-museum button:focus-visible{outline:3px solid var(--po-rust);outline-offset:3px}
  @media(max-width:650px){.po-museum-head h2{font-size:35px}.po-topic-nav a{flex-basis:145px}.po-article h3{font-size:32px}.po-body p{font-size:17px;line-height:1.78}.po-pager button{padding:10px}}
</style>
<script>
  const root = document.querySelector<HTMLElement>('.po-museum');
  if (root) {
    const sections=[...root.querySelectorAll<HTMLElement>('[data-po-topic]')];
    const links=[...root.querySelectorAll<HTMLAnchorElement>('[data-po-link]')];
    const prev=root.querySelector<HTMLButtonElement>('[data-po-prev]');
    const next=root.querySelector<HTMLButtonElement>('[data-po-next]');
    const counter=root.querySelector<HTMLElement>('[data-po-counter]');
    const refresh=()=>{
      const hash=decodeURIComponent(window.location.hash.slice(1));
      const match=/^po-topic-(\d+)$/.exec(hash);
      const idx=match? Math.max(0,Math.min(sections.length-1,Number(match[1])-1)):0;
      sections.forEach((s,i)=>s.hidden=i!==idx);
      links.forEach((link,i)=>{if(i===idx)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current')});
      if(prev) prev.disabled=idx===0;
      if(next) next.disabled=idx===sections.length-1;
      if(counter)counter.textContent=`Section ${idx+1} of ${sections.length}`;
    };
    refresh();
    window.addEventListener('hashchange',refresh);
    prev?.addEventListener('click',()=>{const idx=sections.findIndex(s=>!s.hidden);if(idx>0)window.location.hash=`po-topic-${idx}`;});
    next?.addEventListener('click',()=>{const idx=sections.findIndex(s=>!s.hidden);if(idx>=0&&idx<sections.length-1)window.location.hash=`po-topic-${idx+2}`;});
  }
</script>
