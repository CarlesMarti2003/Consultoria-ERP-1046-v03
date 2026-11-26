const od = 'https://www.odoo.com/documentation/19.0/'
const bc = 'https://learn.microsoft.com/en-us/dynamics365/business-central/'

export const sources = {
  O1: ['Odoo · Regles de reposició', od + 'applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/reordering_rules.html'],
  O2: ['Odoo · Ofertes alternatives', od + 'applications/inventory_and_mrp/purchase/manage_deals/calls_for_tenders.html'],
  O3: ['Odoo · Recepció en tres passos', od + 'applications/inventory_and_mrp/inventory/shipping_receiving/daily_operations/receipts_three_steps.html'],
  O4: ['Odoo · Controls de qualitat', od + 'applications/inventory_and_mrp/quality/quality_management/quality_control_points.html'],
  O5: ['Odoo · Regles d’aprovació', od + 'applications/studio/approval_rules.html'],
  O6: ['Odoo · Regles d’automatització', od + 'applications/studio/automated_actions.html'],
  O7: ['Odoo · Mètodes de reserva', od + 'applications/inventory_and_mrp/inventory/shipping_receiving/reservation_methods.html'],
  O8: ['Odoo · Importació i exportació', od + 'applications/general/export_import_data.html'],
  O9: ['Odoo · API externa JSON-2', od + 'developer/reference/external_api.html'],
  O10: ['Odoo · Plans i allotjament', 'https://www.odoo.com/es_ES/pricing'],
  O11: ['Odoo · Ubicacions per a lots que fallen el control', od + 'applications/inventory_and_mrp/quality/quality_management/failure_locations.html'],
  O12: ['Odoo · Sol·licituds de pressupost', od + 'applications/inventory_and_mrp/purchase/manage_deals/rfq.html'],
  B1: ['Microsoft · Paràmetres de planificació', bc + 'setup-best-practices-planning-parameters'],
  B2: ['Microsoft · Full de demanda', bc + 'production-planning'],
  B3: ['Microsoft · Fluxos de treball', bc + 'across-workflow'],
  B4: ['Microsoft · Gestió de la qualitat', bc + 'qms-overview'],
  B5: ['Microsoft · Configuració de qualitat', bc + 'qms-setup'],
  B6: ['Microsoft · Recepcions de compra', bc + 'purchasing-how-record-purchases'],
  B7: ['Microsoft · Paquets de configuració', bc + 'dev-itpro/administration/set-up-standard-company-configuration-packages'],
  B8: ['Microsoft · Auditoria de canvis', bc + 'dev-itpro/security/security-auditing'],
  B9: ['Microsoft · Plans i preus', 'https://www.microsoft.com/es-es/dynamics-365/products/business-central/pricing'],
  B10: ['Microsoft · API de Business Central', bc + 'dev-itpro/api-reference/v2.0/'],
  B11: ['Microsoft · Aprovació de fulls de demanda', 'https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/smb/dynamics365-business-central/approve-requisition-worksheets-item-journals'],
  B12: ['Microsoft · Seguiment d’articles', bc + 'inventory-how-work-item-tracking'],
  B13: ['Microsoft · Pressupostos de compra', bc + 'purchasing-how-request-quotes'],
}

export const vendors = {
  odoo: {
    name: 'Odoo', edition: 'Odoo 19 Enterprise · Custom · Odoo.sh',
    costs: { monthly: 45, setup: 8500, migration: 2200, training: 1600, extension: 3400, hosting: 1200, support: 2700 },
    plan: 'Compres, Inventari, Fabricació i Qualitat, amb Studio per als camps i les aprovacions. Pilot en una base separada. Mòdul a mida si es confirma l’automatització dels avisos.',
  },
  bc: {
    name: 'Business Central', edition: 'Dynamics 365 Business Central Online · Premium',
    costs: { monthly: 105, setup: 10500, migration: 2500, training: 2000, extension: 5000, hosting: 0, support: 4200 },
    plan: 'Compres, inventari, planificació, fabricació i extensió Quality Management de Microsoft. Pilot en sandbox. Fluxos i extensió AL per a les relacions que no cobrisca la configuració.',
  },
}

export const scenario = { users: 10, years: 3, cap: 65000, targets: [6000, 17000, 4500] }
export function costTotals({ monthly, setup, migration, training, extension, hosting, support }) {
  const licenses = monthly * scenario.users * 12
  const startup = setup + migration + training + extension
  const operations = hosting + support
  return { licenses, startup, operations, tco: startup + scenario.years * (licenses + operations) }
}
export function costScore(cost, target) {
  const ratio = cost / target
  if (ratio <= 1) return 5
  if (ratio <= 1.15) return 4
  if (ratio <= 1.30) return 3
  if (ratio <= 1.50) return 2
  if (ratio <= 2) return 1
  return 0
}

// Each row keeps the requirement, importance, evidence, scores and proposed adaptation together.
const coverage = {
  'HU-01': ['Necessitat i versions del pla', 5, 'Ordre, material, quantitat, data, revisió i revisió anterior.',
    ['CST','Fabricació cobreix la demanda. L’històric immutable de les revisions s’ha d’afegir.','O1 O7'],
    ['CST','Les ordres i el full de planificació cobreixen la demanda. Cal una extensió per comparar revisions de la necessitat.','B1 B2'],
    'Desenvolupament a mida', 'Mantindre una revisió numerada amb quantitat i data anterior i nova. Vincular-la a l’ordre. En el pilot, adjuntar una còpia de cada revisió abans de modificar el pla.',
    'Canviar una data i comprovar que les dues revisions continuen consultables.'],
  'HU-02': ['Disponibilitat i reposició', 5, 'Existència, reserva, ubicació, entrada confirmada, mínim, màxim i termini.',
    ['MOD','Inventari permet configurar regles de reposició i limitar la reserva a estoc alliberat. Cal provar el pronòstic amb rutes i ubicacions.','O1 O3 O7'],
    ['MOD','Planificació i ubicacions permeten calcular la reposició. Cal provar conjuntament la política de punt de comanda i les reserves.','B1 B2 B5'],
    'Configuració bàsica', 'Calcular per magatzem i ruta. Separar físicament qualitat d’estoc utilitzable. Validar que el pronòstic no deduïsca la reserva dues vegades.',
    'Provar estoc lliure i en quarantena amb una entrada confirmada i demanda reservada.'],
  'HU-03': ['Aprovació, correcció i rebuig', 5, 'Petició, import, responsable, suplent, estat, motiu i data.',
    ['MOD','Studio permet aprovació per regles amb rebuig. Cal configurar el retorn a esborrany, el motiu i la substitució del responsable.','O5'],
    ['MOD','Els fluxos de compra i l’aprovació de lots de fulls de demanda cobreixen gran part del circuit. Cal verificar motiu i retorn en l’entorn ofert.','B3 B11'],
    'Canvi en l’execució', 'Usar estats Esborrany, En revisió, Retornada, Aprovada i Rebutjada. Registrar el motiu i exigir nova aprovació després de canvis. Si Studio no força la transició, afegir una regla del mòdul.',
    'Retornar una petició, corregir-la i impedir l’emissió fins a la nova aprovació.'],
  'HU-04': ['Comparació d’ofertes', 4, 'Proveïdor, preu, data promesa, especificació, oferta i motiu.',
    ['MOD','Compres permet enllaçar alternatives i comparar línies. Cal afegir motiu i referència tècnica a la decisió.','O2 O12'],
    ['CST','Hi ha pressupostos de compra i conversió a comanda. La comparació estructurada i comuna de diverses ofertes necessita adaptació en l’abast valorat.','B13'],
    'Configuració bàsica', 'Activar ofertes alternatives i recollir la referència de la fitxa i el motiu d’elecció en camps obligatoris abans d’aprovar.',
    'Comparar dues alternatives i rebutjar les dues si cap complix l’especificació.'],
  'HU-05': ['Impacte del retard o del lot bloquejat', 5, 'Comanda o lot, ordre afectada, material, quantitat, data requerida i causa.',
    ['CST','Compres i Qualitat aporten les dates i el bloqueig. Cal calcular les ordres afectades i generar l’avís per ordre.','O3 O4 O6 O7'],
    ['CST','Planificació i inspecció aporten dades. L’avís que creua les assignacions de fabricació amb lot o lliurament és una extensió.','B1 B4 B12'],
    'Desenvolupament a mida', 'Enllaçar el moviment i la necessitat de fabricació, calcular l’impacte per quantitat i data i crear un avís únic per ordre i incidència. En el pilot, llista revisada per producció.',
    'Retardar una compra i bloquejar un lot. Avisar només les ordres que en depenen.'],
  'HU-06': ['Recepcions parcials i incidències', 5, 'Comanda, albarà, lot, quantitat rebuda, saldo i incidència.',
    ['MOD','Inventari gestiona la recepció per fases. Cal provar el saldo pendent i configurar la quarantena en cas de diferència.','O3 O11'],
    ['MOD','La recepció parcial registra la quantitat rebuda. La quarantena i la inspecció requerixen configuració.','B4 B5 B6'],
    'Configuració bàsica', 'Registrar la quantitat real. Mantindre el saldo pendent amb un lliurament posterior. Aïllar el material incorrecte i associar una incidència a la recepció.',
    'Rebre 60 de 100 unitats i confirmar que 40 queden pendents i només 60 passen a qualitat.'],
  'HU-07': ['Inspecció del lot amb fitxa vigent', 5, 'Material, lot, revisió, vigència, criteri, unitat, límits, mesura, evidència i decisió.',
    ['CST','Qualitat cobreix el control en recepció, les plantilles i les mesures. Cal garantir una còpia immutable dels criteris vigents per lot.','O4 O11'],
    ['CST','L’extensió de Microsoft crea inspeccions a partir de plantilles. Cal verificar la versió immutable de la fitxa i ampliar-la si no queda garantida.','B4 B5'],
    'Desenvolupament a mida', 'Versionar fitxes per material. Copiar els criteris a la inspecció al crear-la i registrar mesures, evidència i responsable. Bloquejar el lot fins a decisió. El pilot pot conservar la fitxa signada com a annex identificat.',
    'Canviar un límit després de la inspecció i comprovar que el lot anterior conserva el límit original.'],
  'HU-08': ['Alliberament i avís a producció', 4, 'Lot, quantitat acceptada, ubicació final, usuari i identificador de l’avís.',
    ['MOD','El trasllat a estoc completa l’entrada. Una activitat de Studio amb marca d’enviament permet preparar l’avís.','O3 O6'],
    ['MOD','El trasllat o la recepció registra estoc. El flux d’avís s’ha de configurar amb la condició d’alliberament.','B3 B4 B6'],
    'Canvi en l’execució', 'Activar l’avís només en validar el trasllat a estoc lliure. Marcar l’identificador del moviment per evitar avisos repetits.',
    'Validar el mateix lot i reintentar l’avís. Verificar una entrada i una notificació.'],
  'HU-09': ['Reserva per necessitat', 4, 'Ordre, moviment, lot, quantitat reservada i data.',
    ['MOD','Les reserves d’Inventari també s’apliquen a fabricació. Cal ajustar el moment de reserva.','O1 O7'],
    ['MOD','Business Central permet reserves. Cal validar la convivència amb el punt de comanda i la política de planificació elegida.','B1 B12'],
    'Configuració bàsica', 'Reservar només quantitat disponible en estoc alliberat i identificar l’ordre. Revisar la reposició independentment de la reserva.',
    'Usar dues ordres que competixen pel mateix estoc i comprovar que no es duplica la reserva.'],
  'HU-10': ['Comanda vinculada a l’oferta i a l’aprovació', 4, 'Petició aprovada, oferta, preu, data, comanda i data d’emissió.',
    ['MOD','La sol·licitud de pressupost es transforma en comanda. Cal condicionar el botó de confirmació a l’aprovació i conservar els enllaços.','O2 O5 O12'],
    ['MOD','Un pressupost de compra es pot convertir en comanda. Cal activar l’aprovació i provar la traça amb la petició inicial.','B3 B13'],
    'Configuració bàsica', 'Configurar l’aprovació del document de compra i usar la confirmació del document seleccionat. Desactivar la reutilització d’una petició tramitada.',
    'Intentar confirmar un pressupost sense aprovar i comprovar després l’enllaç de la comanda aprovada.'],
  'HU-11': ['Resposta a retards i substitució de proveïdor', 4, 'Comanda inicial, saldo, acció, motiu, alternativa i nova data.',
    ['MOD','Les ofertes alternatives i les activitats permeten dur el seguiment. El tancament del saldo necessita una revisió operativa.','O2 O6'],
    ['MOD','Els documents de compra i els fluxos permeten reprogramar i tramitar el reemplaçament amb control operatiu del saldo.','B3 B6 B13'],
    'Canvi en l’execució', 'Registrar reclamació, replanificació o canvi. Bloquejar l’emissió de la compra de substitució fins que compres valide el saldo cancel·lat o reduït.',
    'Canviar de proveïdor després d’una recepció parcial i comprovar que només es reemplaça el saldo.'],
}
export const fit = Object.entries(coverage).map(([id, row]) => {
  const [label, weight, data, odoo, bc, adaptation, resolution, test] = row
  return { id, label, weight, data, odoo, bc, adaptation, resolution, test }
})
export const points = { SUP: 5, MOD: 4, '3RD': 3, CST: 2, FUT: 1, NS: 0 }

export const groups = [
  { id:'economia', name:'Costos', weight:5, sheet:'Criteris Econòmics', rows:[
    ['Llicències anuals',5,'O10 B9','Assumpció de 10 usuaris complets. Preu unitari simulat, subjecte a oferta.'],
    ['Posada en marxa',5,'','Configuració, migració, formació i adaptacions pressupostades.'],
    ['Allotjament i suport anual',4,'O10 B9','Inclou suport i allotjament incremental. El SaaS de BC es computa en llicències.'],
  ]},
  { id:'producte', name:'Producte', weight:3, sheet:'CriterisGeneralProducte', rows:[
    ['Encaix de mòduls amb una sola planta',5,5,5,'Compres, inventari, fabricació i qualitat en les edicions comparades.','O3 O4 B4 B9'],
    ['Flexibilitat sense canviar el nucli',4,5,4,'Odoo combina Studio i mòduls en Odoo.sh. BC combina fluxos i extensions; cal comprovar les personalitzacions en actualitzacions.','O5 O10 B3'],
    ['Opcions de desplegament',3,5,4,'Odoo Custom admet modalitats diferents. La comparació de BC se centra en Online i el desplegament del pilot en sandbox.','O10 B9'],
  ]},
  { id:'tecnologia', name:'Tecnologia', weight:4, sheet:'CriterisTecnològics', rows:[
    ['API per a integracions',4,4,5,'Odoo ofereix JSON-2 amb Custom. BC disposa d’API v2.0. Cal comprovar els camps que exposa cada entorn.','O9 B10'],
    ['Identitat i mínim privilegi',5,4,5,'Es proposen perfils per funció en els dos productes. L’entorn Microsoft aporta auditoria i encaix amb el seu ecosistema d’identitat.','O9 B8'],
    ['Entorn separat per al pilot',4,5,5,'Proves a Odoo.sh o sandbox de BC abans d’implantar.','O10 B9'],
  ]},
  { id:'funcional', name:'Cobertura funcional', weight:5, sheet:'Requisits', rows:[] },
  { id:'entrada', name:'Dades d’entrada', weight:3, sheet:'Requisits', rows:[
    ['RD-01 · Articles i proveïdors',5,5,5,'Importació amb identificador estable, unitat de mesura i referència de proveïdor.','O8 B7'],
    ['RD-02 · Lots i recepcions',5,4,4,'Captura de lot, albarà i quantitat per línia de comanda amb seguiment activat.','O3 O4 B6 B12'],
    ['RD-03 · Fitxa i mesures',5,2,2,'Controls de qualitat disponibles. Cal garantir la versió immutable i els resultats per criteri.','O4 B4 B5'],
  ]},
  { id:'eixida', name:'Informació d’eixida', weight:3, sheet:'Requisits', rows:[
    ['RE-01 · Estoc i recepcions pendents',5,4,4,'Informació de reposició i saldo pendent amb la configuració de magatzem.','O1 B1 B6'],
    ['RE-02 · Informe de traçabilitat',4,4,4,'Traçar material i recepció per lot. Verificar l’enllaç amb la decisió de qualitat en el pilot.','O4 O8 B4 B12'],
    ['RE-03 · Avís per ordre afectada',5,2,2,'Els fluxos estàndard no es donen per suficients per calcular l’impacte per ordre.','O6 B3 B4'],
  ]},
  { id:'implantador', name:'Implantador', weight:4, sheet:'Consultor', rows:[
    ['Suport regional i SLA',5,null,null,'Demanar personal de suport, cobertura i escalat. Objectiu: primera resposta crítica en quatre hores laborables.',''],
    ['Experiència i equip',5,null,null,'Demanar dos projectes industrials comparables i els perfils assignats.',''],
    ['Formació i transferència',4,null,null,'Demanar pla per als quatre perfils, manuals i una prova de recuperació amb l’equip.',''],
  ]},
]

export function scoredRows(group) {
  if (group.id === 'economia') {
    const a = costTotals(vendors.odoo.costs)
    const b = costTotals(vendors.bc.costs)
    return group.rows.map(([label, weight, refs, detail], i) => {
      const key = ['licenses', 'startup', 'operations'][i]
      return [label, weight, costScore(a[key], scenario.targets[i]), costScore(b[key], scenario.targets[i]), detail, refs]
    })
  }
  if (group.id === 'funcional') return fit.map(item => [
    item.id + ' · ' + item.label, item.weight, points[item.odoo[0]], points[item.bc[0]],
    item.odoo[1] + ' / BC: ' + item.bc[1], item.odoo[2] + ' ' + item.bc[2],
  ])
  return group.rows
}

function weighted(rows, valueCol) {
  const evaluated = rows.filter(row => typeof row[valueCol] === 'number')
  const weight = evaluated.reduce((total, row) => total + row[1], 0)
  return weight ? evaluated.reduce((total, row) => total + row[1] * row[valueCol], 0) / weight : null
}

export const resultRows = groups.map(group => {
  const rows = scoredRows(group)
  return [group.name, group.weight, weighted(rows, 2), weighted(rows, 3)]
})
export const result = { odoo: weighted(resultRows, 2), bc: weighted(resultRows, 3) }

export const parameters = [
  ['Mestres', 'Inventari i Compres', 'Producte, referència interna, unitat kg, control per lots, proveïdor i termini.', 'Depurar el full. Importar primer en pilot i quadrar les quantitats per article, ubicació i lot.'],
  ['Reposició', 'Inventari · Reposició', 'Ruta Comprar. Revisió manual. Mínim, màxim i múltiple per article.', 'Exemple de prova: mínim 500 kg, màxim 1.200 kg i múltiple 100 kg. Ajustar amb consum i termini reals.'],
  ['Compres', 'Compres i Studio', 'Alternatives de compra, fitxa aplicable, motiu de selecció, aprovador i suplent.', 'Llindar de pilot de 2.000 € per a una segona aprovació. Direcció ha de validar-lo.'],
  ['Recepció', 'Inventari · Magatzems', 'Entrada → Qualitat → Estoc. Quarantena separada. Lliurament posterior per al saldo.', 'Permetre reservar des d’Estoc. Provar que la ruta i els permisos impedixen alliberar lots pendents.'],
  ['Qualitat', 'Qualitat · Punts de control', 'Control en cada recepció amb els criteris de la fitxa vigent, mesures i evidència.', 'Qualitat fixa els límits. El mòdul desa la revisió i els criteris aplicats al lot.'],
  ['Rols i avisos', 'Configuració i Studio', 'Producció planifica, compres tramita, magatzem rep i qualitat accepta o rebutja.', 'Activar avisos en alliberament. Provar l’avís de risc per ordre amb identificador únic de la incidència.'],
]

export const pilot = [
  ['Reposició', 'Amb estoc lliure de 800 kg, una entrada confirmada de 100 kg i una demanda total de 600 kg (200 kg reservats), queden 300 kg previstos. Amb els valors proposats, la compra suggerida és de 900 kg. El material en quarantena queda fora.'],
  ['Recepció i qualitat', 'Rebre 60 de 100 unitats. Mantindre 40 pendents. Inspeccionar el lot rebut amb la fitxa vigent i provar els tres estats: pendent, rebutjat i acceptat.'],
  ['Retard i reemplaçament', 'Simular un retard, comprovar l’avís per ordre i substituir només el saldo de la compra original amb autorització.'],
  ['Acceptació del pilot', 'Producció, compres, magatzem i qualitat validen les proves. Comparar estoc inicial i final per lot i revisar el registre d’aprovacions.'],
]
