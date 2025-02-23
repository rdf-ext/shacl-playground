import { documentStyle } from 'bs-elements'
import { html, render } from 'lit'
import { compressToBase64, decompressFromBase64 } from 'lz-string'
import RdfEditor from 'rdf-elements/RdfEditor.js'
import RdfFormatSelector from 'rdf-elements/RdfFormatSelector.js'
import RdfNetwork from 'rdf-elements/RdfNetwork.js'
import SparqlEditor from 'rdf-elements/SparqlEditor.js'
import rdf from 'rdf-ext'
import { validations as sparqlValidations } from 'shacl-engine/sparql.js'
import Validator from 'shacl-engine/Validator.js'
import coverageCompounds from './lib/coverageCompounds.js'
import CoverageNetwork from './lib/CoverageNetwork.js'
import * as example from './lib/example.js'
import * as ns from './lib/namespaces.js'
import RdfEditorPanel from './lib/RdfEditorPanel.js'
import RdfViewerPanel from './lib/RdfViewerPanel.js'
import ReportTreePanel from './lib/ReportTreePanel.js'
import ShapeTreePanel from './lib/ShapeTreePanel.js'
import State from './lib/State.js'
import { TreeView, TreeViewNode } from './lib/TreeView.js'
import ValidationSettings from './lib/ValidationSettings.js'

document.getElementById('version').innerHTML = `${__APP_NAME__} version: ${__APP_VERSION__}` // eslint-disable-line no-undef

documentStyle()

const reportPrefixes = new Map([
  ['sh', ns.sh('')],
  ['shn', ns.shn('')]
])

window.customElements.define('coverage-network', CoverageNetwork)
window.customElements.define('rdf-editor', RdfEditor)
window.customElements.define('rdf-editor-panel', RdfEditorPanel)
window.customElements.define('rdf-viewer-panel', RdfViewerPanel)
window.customElements.define('rdf-format-selector', RdfFormatSelector)
window.customElements.define('rdf-network', RdfNetwork)
window.customElements.define('report-tree-panel', ReportTreePanel)
window.customElements.define('shape-tree-panel', ShapeTreePanel)
window.customElements.define('sparql-editor', SparqlEditor)
window.customElements.define('tree-view', TreeView)
window.customElements.define('tree-view-node', TreeViewNode)
window.customElements.define('validation-settings', ValidationSettings)

class Playground {
  constructor () {
    this.state = new State({
      coverageNetworkEnabled: true,
      dataValue: example.data,
      shapeValue: example.shape,
      validationSettings: {
        coverage: true,
        debug: true,
        details: true,
        trace: true
      }
    })

    this.state.addEventListener('dataDatasetChange', () => this.updateReport())
    this.state.addEventListener('shapeDatasetChange', () => this.updateReport())
    this.state.addEventListener('validationSettingsChange', () => this.updateReport())

    this.state.addEventListener('coverageNetworkEnabledChange', () => this.toHistory())
    this.state.addEventListener('dataValueChange', () => this.toHistory())
    this.state.addEventListener('shapeValueChange', () => this.toHistory())
    this.state.addEventListener('validationSettingsChange', () => this.toHistory())

    this.fromHistory()
  }

  fromHistory () {
    const content = window.location.hash.slice(1)

    if (content) {
      const json = JSON.parse(decompressFromBase64(content))

      this.state.coverageNetworkEnabled = json.coverageNetworkEnabled
      this.state.dataValue = json.dataValue
      this.state.shapeValue = json.shapeValue
      this.state.validationSettings = json.validationSettings
    }
  }

  toHistory () {
    const json = {
      coverageNetworkEnabled: this.state.coverageNetworkEnabled,
      dataValue: this.state.dataValue,
      shapeValue: this.state.shapeValue,
      validationSettings: this.state.validationSettings
    }
    const string = compressToBase64(JSON.stringify(json))
    window.history.replaceState({}, '', `#${string}`)
  }

  async updateReport () {
    if (!this.state.data || !this.state.shape) {
      return
    }

    const engine = new Validator(this.state.shape, {
      ...this.state.validationSettings,
      factory: rdf,
      validations: sparqlValidations
    })

    const report = await engine.validate({ dataset: this.state.data })
    this.state.reportChange(report)

    let coverage = rdf.dataset()

    if (this.state.validationSettings.coverage) {
      coverage = rdf.dataset(report.coverage())
    }

    const { compoundLabels, compounds } = coverageCompounds(report.results)

    this.state.coverageChange(coverage, compounds, compoundLabels)
  }

  render () {
    render(
      html`
        <validation-settings
          .coverage=${this.state.validationSettings.coverage}
          .debug=${this.state.validationSettings.debug}
          .details=${this.state.validationSettings.details}
          .trace=${this.state.validationSettings.trace}
          @change=${event => this.state.validationSettingsChange(event.detail)}>
        </validation-settings>`,
      document.getElementById('validation-settings')
    )

    render(
      html`
        <rdf-editor-panel
          label="Shape"
          .value=${this.state.shapeValue}
          @change=${event => this.state.shapeChange(event.detail.dataset, event.detail.value)}>
        </rdf-editor-panel>`,
      document.getElementById('shape')
    )

    render(
      html`
        <shape-tree-panel
          label="Shape Tree"
          .updateHandler=${element => {
            this.state.addEventListener('shapeDatasetChange', () => {
            element.dataset = this.state.shape
          })
        }}>
      </shape-tree-panel>`,
      document.getElementById('shape-tree')
    )

    render(
      html`
        <rdf-viewer-panel
          label="Report"
          .prefixes=${reportPrefixes}
          .updateHandler=${element => {
            this.state.addEventListener('reportChange', () => {
              element.dataset = this.state.report.dataset
            })
          }}>
        </rdf-viewer-panel>`,
      document.getElementById('report')
    )

    render(
      html`
        <report-tree-panel
          label="Report Tree"
          .updateHandler=${element => {
            this.state.addEventListener('reportChange', () => {
            element.dataset = this.state.report.dataset
          })
        }}>
        </report-tree-panel>`,
      document.getElementById('report-tree')
    )

    render(
      html`
        <rdf-editor-panel
          label="Data"
          .value=${this.state.dataValue}
          @change=${event => this.state.dataChange(event.detail.dataset, event.detail.value)}>
        </rdf-editor-panel>`,
      document.getElementById('data')
    )

    render(
      html`
        <rdf-viewer-panel
          label="Coverage"
          .updateHandler=${element => {
            this.state.addEventListener('coverageChange', () => {
              element.dataset = this.state.coverage
            })
          }}>
        </rdf-viewer-panel>`,
      document.getElementById('coverage')
    )

    render(
      html`
        <coverage-network
          label="Coverage Network"
          .enabled=${this.state.coverageNetworkEnabled}
          .updateHandler=${element => this.state.addEventListener('coverageChange', () => {
            element.compoundLabels = this.state.compoundLabels
            element.compounds = this.state.compounds
            element.coverage = this.state.coverage
          })}
          @enabledChange=${event => this.state.coverageNetworkChange(event.detail.enabled)}>
        </coverage-network>`,
      document.getElementById('coverage-network')
    )
  }
}

const playground = new Playground()

playground.render()
