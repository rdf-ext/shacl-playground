/* global CustomEvent */

import { LitElement, html } from 'lit'
import { hasChangedDataset } from 'rdf-elements/hasChanged.js'
import rdf from 'rdf-ext'
import style from './style.js'

class RdfEditorPanel extends LitElement {
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
      value: {
        type: String
      }
    }
  }

  static get styles () {
    return style()
  }

  constructor () {
    super()

    this.mediaType = 'text/turtle'
  }

  onChange (event) {
    this.dispatchEvent(new CustomEvent('change', event))
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
        .factory=${rdf}
        .mediaType=${this.mediaType}
        .value=${this.value}
        @change=${this.onChange}>
      </rdf-editor>
    `
  }
}

export default RdfEditorPanel
