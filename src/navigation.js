export const projectBase = '#/casos/ceramica-riu-sec'

export const mainNavigation = [
  { page: 'inici', label: 'Inici', href: '#/' },
  { page: 'serveis', label: 'Serveis', href: '#/serveis' },
  { page: 'casos', label: 'Projectes', href: '#/casos' },
  { page: 'consultora', label: 'Equip', href: '#/consultora' },
  { page: 'contacte', label: 'Contacte', href: '#/contacte' },
]

export const projectNavigation = [
  { page: 'projecte', label: 'Resum del projecte', href: projectBase, sections: [] },
  {
    page: 'proces', label: 'Procés actual', href: projectBase + '/proces',
    description: 'Consulta les huit activitats, els problemes detectats i el model AS-IS.',
    sections: [
      ['abast', 'Abast del procés'], ['activitats', 'Activitats'],
      ['diagnostic', 'Diagnòstic'], ['model-actual', 'Diagrama AS-IS'],
    ],
  },
  {
    page: 'millora', label: 'Proposta de millora', href: projectBase + '/millora',
    description: 'Coneix els canvis i com funcionaria el procés amb el model TO-BE.',
    sections: [
      ['canvis', 'Categories de millora'], ['recorregut', 'Recorregut proposat'],
      ['model-proposat', 'Diagrama TO-BE'],
    ],
  },
  {
    page: 'requisits', label: 'Requisits ERP', href: projectBase + '/requisits',
    description: 'Revisa les històries d’usuari, les dades i les tasques que ha de cobrir l’ERP.',
    sections: [
      ['histories', 'Històries d’usuari'], ['dades', 'Dades diferencials'],
      ['tasques-erp', 'Cobertura ERP'],
    ],
  },
  {
    page: 'seleccio', label: 'Selecció ERP', href: projectBase + '/seleccio-erp',
    description: 'Compara Odoo i Business Central i consulta el GAP i la parametrització.',
    sections: [
      ['comparativa', 'Comparativa'], ['gap', 'Anàlisi GAP'],
      ['parametritzacio', 'Parametrització'],
    ],
  },
]

export const legalNavigation = [
  { page: 'privacitat', label: 'Privacitat', href: '#/privacitat' },
  { page: 'cookies', label: 'Cookies', href: '#/cookies' },
]

const pages = [...mainNavigation, ...projectNavigation, ...legalNavigation]
const legacyRoutes = {
  '#/empresa': projectBase,
  [projectBase + '/empresa']: projectBase,
  '#/documents': projectBase,
  [projectBase + '/documents']: projectBase,
  '#/proces': projectBase + '/proces',
  '#/analisi': projectBase + '/analisi',
  '#/millora': projectBase + '/millora',
  '#/requisits': projectBase + '/requisits',
  '#/equip': '#/consultora',
  '#proces': projectBase + '/proces',
  '#inici': '#/',
}

export const pageHref = (page) => pages.find((item) => item.page === page)?.href || '#/'
export const sectionHref = (page, section) => pageHref(page) + '?seccio=' + section

export function readRoute(hash = window.location.hash) {
  const [rawPath, query = ''] = hash.split('?')
  const path = rawPath.replace(/\/$/, '') || '#'
  const canonical = legacyRoutes[path] || path
  const params = new URLSearchParams(query)
  const target = params.get('seccio') || params.get('vista') || ''

  if (canonical === projectBase + '/analisi' || (canonical === pageHref('proces') && target === 'preocupacions')) {
    return { page: 'proces', section: 'diagnostic', target: 'diagnostic' }
  }
  if (canonical === pageHref('millora') && target === 'tasques-erp') {
    return { page: 'requisits', section: 'tasques-erp', target: 'tasques-erp' }
  }

  const item = pages.find(({ href }) => href.replace(/\/$/, '') === canonical.replace(/\/$/, ''))
  const page = item?.page || 'notfound'
  const sections = item?.sections ?? []
  const defaultSection = sections[0]?.[0] || ''
  if (sections.some(([id]) => id === target)) return { page, section: target, target }
  if (page === 'proces' && /^activitat-[1-8]$/.test(target)) return { page, section: 'activitats', target }
  if (page === 'requisits' && (/^hu-(0[1-9]|1[01])$/.test(target) || ['planificacio', 'compres', 'recepcio', 'coordinacio'].includes(target))) {
    return { page, section: 'histories', target }
  }
  if (page === 'seleccio' && target === 'avaluacio-fitxers') return { page, section: 'comparativa', target }
  if (page === 'millora' && target === 'prioritats') return { page, section: 'canvis', target: 'canvis' }
  if (page === 'projecte' && target === 'abast') return { page, section: '', target }
  return { page, section: defaultSection, target: '' }
}
