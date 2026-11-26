import { projectNavigation, pageHref, sectionHref } from './navigation.js'

export function PageIntro({ label, title, children }) {
  return <header className="page-intro wrap">
    {label && <p className="page-label">{label}</p>}
    <h1 tabIndex={-1}>{title}</h1>
    <p className="page-intro-copy">{children}</p>
  </header>
}

export function SectionLinks({ page, section }) {
  const { sections, label } = projectNavigation.find((item) => item.page === page)
  return <nav className="section-navigation wrap" aria-label={label + ' · subapartats'}>
    <ul role="list">{sections.map(([id, title]) =>
      <li key={id}><a href={sectionHref(page, id)} aria-current={section === id ? 'page' : undefined}>{title}</a></li>
    )}</ul>
  </nav>
}

export function ProjectBreadcrumbs({ page }) {
  const item = projectNavigation.find((entry) => entry.page === page)
  return <nav className="project-breadcrumbs" aria-label="Ubicació">
    <ol role="list">
      <li><a href={pageHref('casos')}>Projectes</a></li>
      <li>{page === 'projecte'
        ? <span aria-current="page">Ceràmica Riu Sec</span>
        : <a href={pageHref('projecte')}>Ceràmica Riu Sec</a>}</li>
      {page !== 'projecte' && <li><span aria-current="page">{item.label}</span></li>}
    </ol>
  </nav>
}

const projectGroups = [
  ['Procés', projectNavigation.slice(1, 3)],
  ['Solució ERP', projectNavigation.slice(3)],
]

export function ProjectMenu({ page }) {
  return <nav className="project-navigation" aria-label="Apartats del projecte">
    <a className="project-menu-overview" href={pageHref('projecte')}>Resum del projecte</a>
    <div className="project-menu-groups">
      {projectGroups.map(([label, entries]) => <div key={label}>
        <p className="project-menu-label">{label}</p>
        <ul role="list">{entries.map((item) => <li key={item.page}>
          <a href={item.href} aria-current={page === item.page ? 'location' : undefined}>{item.label}</a>
        </li>)}</ul>
      </div>)}
    </div>
  </nav>
}

const projectSequence = projectNavigation.flatMap(({ page, label, href, sections }) =>
  sections.length
    ? sections.map(([id, title]) => ({ page, section: id, title, href: sectionHref(page, id) }))
    : [{ page, section: '', title: label, href }]
)

export function ProjectPager({ page, section }) {
  const index = projectSequence.findIndex((item) => item.page === page && item.section === section)
  const previous = projectSequence[index - 1]
  const next = projectSequence[index + 1]
  return <nav className="project-pager wrap" aria-label="Continuar pel projecte">
    <a href={previous?.href || pageHref('casos')}><small>{previous ? 'Anterior' : 'Tornar a'}</small><strong>{previous?.title || 'Projectes'}</strong></a>
    <a href={next?.href || pageHref('projecte')}><small>{next ? 'Següent' : 'Tornar a'}</small><strong>{next?.title || 'Resum del projecte'}</strong></a>
  </nav>
}

export function ProjectOverview() {
  const clientLogo = <img
    className="project-logo"
    src={import.meta.env.BASE_URL + 'images/ceramica-riu-sec-logo.png'}
    alt="Ceràmica Riu Sec"
    width="2172"
    height="724"
  />

  return <>
    <PageIntro label="Indústria ceràmica · Onda" title={clientLogo}>Fabricant de taulells amb 64 persones. El projecte analitza com coordinar l’aprovisionament de matèries primeres.</PageIntro>
    <section className="section-space wrap">
      <h2>Explora el projecte</h2>
      <ul className="project-index" role="list">{projectNavigation.slice(1).map((item) => <li key={item.page}>
        <h3><a href={item.href}>{item.label}</a></h3>
        <p>{item.description}</p>
      </li>)}</ul>
    </section>
    <section className="section-space wrap case-brief">
      <article><h2>El repte</h2><p>Els correus i fulls separats dificulten conéixer l’estoc real i provoquen compres urgents i avisos tardans.</p></article>
      <article><h2>L’objectiu</h2><p>Tindre el material a temps i compartir la informació entre producció, compres, magatzem i qualitat.</p></article>
      <article id="abast"><h2>L’abast</h2><p>De la necessitat de producció al registre del material acceptat. La fabricació i el pagament queden fora.</p></article>
    </section>
    <p className="project-status wrap"><strong>Projecte en curs.</strong> Millores proposades, pendents d’implantació.</p>
  </>
}
