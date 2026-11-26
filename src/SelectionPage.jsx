import { PageIntro, SectionLinks } from './ProjectUI.jsx'
import { sectionHref } from './navigation.js'
import { costTotals, fit, parameters, result, resultRows, scenario, vendors } from './selectionContent.js'

const score = value => value === null ? 'Pendent' : new Intl.NumberFormat('ca', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
const euros = value => new Intl.NumberFormat('ca', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
const files = [
  ['RFP d’Odoo', 'Resposta simulada de l’empresa implantadora', [['RFP-Odoo.docx', 'Word'], ['RFP-Odoo.pdf', 'PDF']]],
  ['RFP de Business Central', 'Resposta simulada de l’empresa implantadora', [['RFP-Business-Central.docx', 'Word'], ['RFP-Business-Central.pdf?v=e81fa8d62ceb', 'PDF']]],
  ['Matriu d’avaluació ERP', 'Comparativa ponderada amb els huit criteris tecnològics', [['Matriu-avaluacio-ERP.xlsx', 'Excel']]],
  ['Matriu simplificada de criteris generals', 'Tres criteris per bloc amb pesos i valoracions', [['Matriu-simplificada-ERP.xlsx', 'Excel']]],
]

export function SelectionPage({ section }) {
  return <>
    <PageIntro label="Ceràmica Riu Sec" title="Selecció de l’ERP">
      Recomanem un pilot amb Odoo per gestionar les compres, l’estoc i la qualitat en el mateix sistema.
    </PageIntro>
    <SectionLinks page="seleccio" section={section} />
    {section === 'comparativa' && <section id="comparativa" className="section-space wrap">
      <div className="section-heading-row">
        <h2>Comparativa</h2>
        <p>Odoo 19 Enterprise Custom destaca en la comparació d’ofertes i el cost simulat. Els dos ERP obtenen la mateixa nota en els criteris tecnològics valorats.</p>
        <a className="text-link selection-shortcut" href={sectionHref('seleccio', 'avaluacio-fitxers')}>Descarregar les matrius i les RFP</a>
      </div>
      <dl className="selection-result">
        <div><dt>Odoo</dt><dd>{score(result.odoo)} <span>/ 5</span></dd><dd>{euros(costTotals(vendors.odoo.costs).tco)} a tres anys</dd></div>
        <div><dt>Business Central</dt><dd>{score(result.bc)} <span>/ 5</span></dd><dd>{euros(costTotals(vendors.bc.costs).tco)} a tres anys</dd></div>
      </dl>
      <p className="selection-note">Escenari de {scenario.users} usuaris sense IVA. Les notes són provisionals. Queden pendents de valorar el rendiment, l’accessibilitat i l’empresa implantadora.</p>
      <div className="selection-evaluation">
        <h3>Valoració per criteri</h3>
        <div className="table-scroll" tabIndex="0" role="region" aria-label="Puntuacions dels ERP per criteri">
          <table className="selection-table">
            <thead><tr><th scope="col">Criteri</th><th scope="col">Pes</th><th scope="col">Odoo</th><th scope="col">Business Central</th></tr></thead>
            <tbody>{resultRows.map(([label,weight,a,b]) => <tr key={label}><th scope="row">{label}</th><td>{weight}</td><td>{score(a)}</td><td>{score(b)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div id="avaluacio-fitxers" className="selection-evaluation">
        <h3>Matrius i RFP</h3>
        <ul className="download-list" role="list">{files.map(([title,description,links]) =>
          <li key={title}><div><h4>{title}</h4><p>{description}</p></div>
            <div className="selection-downloads">
              {links.map(([file,format]) => <a key={file} className="text-link" href={import.meta.env.BASE_URL + 'seleccio-erp/' + file} download aria-label={`Descarregar ${title} en format ${format}`}>{format}</a>)}
            </div>
          </li>
        )}</ul>
      </div>
    </section>}
    {section === 'gap' && <section id="gap" className="section-space wrap">
      <div className="section-heading-row"><h2>Anàlisi GAP</h2><p>Odoo cobreix amb configuració bona part del procés. Hi ha tres requisits que justifiquen una adaptació a mida.</p></div>
      <ul className="selection-list">{fit.filter(item => item.odoo[0] === 'CST').map(item =>
        <li key={item.id}>
          <h3>{item.label} <span>{item.id}</span></h3>
          <p>{item.resolution}</p>
        </li>
      )}</ul>
      <p className="selection-note">El dossier detalla la cobertura, les dades i una prova d’acceptació per a cadascuna de les onze històries.</p>
      <a className="text-link next-link" href={import.meta.env.BASE_URL + 'seleccio-erp/Informe-GAP-Ceramica-Riu-Sec.pdf'} download>
        Descarregar l’informe GAP de Ceràmica Riu Sec (PDF)
      </a>
    </section>}
    {section === 'parametritzacio' && <section id="parametritzacio" className="section-space wrap">
      <div className="section-heading-row"><h2>Parametrització bàsica</h2><p>La prova comença amb un magatzem i una mostra d’argiles i esmalts.</p></div>
      <ul className="selection-list">{parameters.map(([label,,setting]) =>
        <li key={label}><h3>{label}</h3><p>{setting}</p></li>
      )}</ul>
      <p className="selection-note">El pilot ha de validar la reposició, la recepció parcial, l’alliberament de lots i la resposta a retards abans de la implantació.</p>
      <a className="text-link next-link" href={sectionHref('seleccio', 'gap')}>Veure el GAP i l’informe del pilot</a>
    </section>}
  </>
}
