import { PageIntro, SectionLinks } from './ProjectUI.jsx'
import { costTotals, fit, parameters, result, resultRows, scenario, sources, vendors } from './selectionContent.js'

const score = value => value === null ? 'Pendent' : new Intl.NumberFormat('ca', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
const euros = value => new Intl.NumberFormat('ca', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
const files = [
  ['RFP-Odoo-i-Business-Central.xlsx', 'RFP i respostes dels dos proveïdors', 'Excel amb un full per ERP'],
  ['Matriu-avaluacio-ERP.xlsx', 'Matriu ponderada i criteris generals', 'Excel amb pesos, fórmules i justificacions'],
  ['Seleccio-GAP-Ceramica-Riu-Sec.pdf', 'Informe de selecció, GAP i parametrització', 'PDF amb les onze històries, proves i fonts'],
]

export function SelectionPage() {
  return <>
    <PageIntro label="Ceràmica Riu Sec" title="Selecció de l’ERP">
      Recomanem un pilot amb Odoo per gestionar les compres, l’estoc i la qualitat en el mateix sistema.
    </PageIntro>
    <SectionLinks page="seleccio" links={[
      ['comparativa', 'Comparativa'],
      ['gap', 'Anàlisi GAP'],
      ['parametritzacio', 'Parametrització'],
      ['avaluacio-fitxers', 'Fitxers'],
    ]} />
    <section id="comparativa" className="section-space wrap">
      <div className="section-heading-row">
        <h2>Comparativa</h2>
        <p>Odoo 19 Enterprise Custom destaca en la comparació d’ofertes i el cost simulat. Business Central Premium obté la millor nota tecnològica i també ofereix inspeccions de qualitat.</p>
      </div>
      <dl className="selection-result">
        <div><dt>Odoo</dt><dd>{score(result.odoo)} <span>/ 5</span></dd><dd>{euros(costTotals(vendors.odoo.costs).tco)} a tres anys</dd></div>
        <div><dt>Business Central</dt><dd>{score(result.bc)} <span>/ 5</span></dd><dd>{euros(costTotals(vendors.bc.costs).tco)} a tres anys</dd></div>
      </dl>
      <p className="selection-note">Escenari de {scenario.users} usuaris sense IVA. La valoració de l’implantador, les ofertes comercials i les proves del pilot estan pendents.</p>
      <details className="content-disclosure">
        <summary>Valoració per criteri <span aria-hidden="true">+</span></summary>
        <div className="table-scroll" tabIndex="0" role="region" aria-label="Puntuacions dels ERP per criteri">
          <table className="selection-table">
            <thead><tr><th scope="col">Criteri</th><th scope="col">Pes</th><th scope="col">Odoo</th><th scope="col">Business Central</th></tr></thead>
            <tbody>{resultRows.map(([label,weight,a,b]) => <tr key={label}><th scope="row">{label}</th><td>{weight}</td><td>{score(a)}</td><td>{score(b)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
    <section id="gap" className="section-space wrap selection-section">
      <div className="section-heading-row"><h2>Anàlisi GAP</h2><p>Odoo cobreix amb configuració bona part del procés. Hi ha tres requisits que justifiquen una adaptació a mida.</p></div>
      <ul className="selection-list">{fit.filter(item => item.odoo[0] === 'CST').map(item =>
        <li key={item.id}>
          <h3>{item.label} <span>{item.id}</span></h3>
          <p>{item.resolution}</p>
        </li>
      )}</ul>
      <p className="selection-note">El dossier detalla la cobertura, les dades i una prova d’acceptació per a cadascuna de les onze històries.</p>
    </section>
    <section id="parametritzacio" className="section-space wrap selection-section">
      <div className="section-heading-row"><h2>Parametrització bàsica</h2><p>La prova comença amb un magatzem i una mostra d’argiles i esmalts.</p></div>
      <ul className="selection-list">{parameters.map(([label,,setting]) =>
        <li key={label}><h3>{label}</h3><p>{setting}</p></li>
      )}</ul>
      <p className="selection-note">El pilot ha de validar la reposició, la recepció parcial, l’alliberament de lots i la resposta a retards abans de la implantació.</p>
    </section>
    <section id="avaluacio-fitxers" className="section-space wrap selection-section">
      <h2>Fitxers de l’avaluació</h2>
      <ul className="download-list">{files.map(([file,title,description]) =>
        <li key={file}><div><h3>{title}</h3><p>{description}</p></div>
          <a href={import.meta.env.BASE_URL + 'seleccio-erp/' + file} download aria-label={'Descarregar ' + title}>Descarregar ↓</a>
        </li>
      )}</ul>
      <details className="content-disclosure">
        <summary>Documentació oficial de producte <span aria-hidden="true">+</span></summary>
        <ul className="source-list">{['O2','O3','O4','B1','B4'].map(id =>
          <li key={id}><a href={sources[id][1]}>{sources[id][0]}</a></li>
        )}</ul>
      </details>
    </section>
  </>
}
