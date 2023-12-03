import { LitElement, html } from 'lit'
import { hasChangedDataset } from 'rdf-elements/hasChanged.js'
import rdf from 'rdf-ext'
import style from './style.js'

class RdfViewerPanel extends LitElement {
  static get properties () {
    return {
      dataset: {
        type: Object,
        hasChanged: hasChangedDataset
      },
      label: {
        type: String
      },
      mediaType: {
        type: String
      },
      prefixes: {
        type: Object
      },
      updateHandler: {
        type: Function
      }
    }
  }

  static get styles () {
    return style()
  }

  constructor () {
    super()

    this.prefixes = []
    this.mediaType = 'text/turtle'
  }

  firstUpdated () {
    super.firstUpdated()

    this.updateHandler(this)
  }

  render () {
    return html`
      <h2>${this.label}</h2>
      <rdf-format-selector
        size="small"
        .mediaType=${this.mediaType}
        @change=${event => {
          this.mediaType = event.detail.mediaType
        }}>
      </rdf-format-selector>
      <rdf-editor
        height=400
        .dataset=${this.dataset}
        .factory=${rdf}
        .mediaType=${this.mediaType}
        .prefixes=${this.prefixes}>
      </rdf-editor>
    `
  }
}

export default RdfViewerPanel
