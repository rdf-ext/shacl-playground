/* global CustomEvent */

import { LitElement, html } from 'lit'
import style from './style.js'

class CoverageNetwork extends LitElement {
  static get properties () {
    return {
      compoundLabels: {
        type: Object
      },
      compounds: {
        type: Object
      },
      coverage: {
        type: Object
      },
      enabled: {
        type: Boolean
      },
      label: {
        type: String
      },
      updateHandler: {
        type: Function
      }
    }
  }

  static get styles () {
    return style()
  }

  firstUpdated () {
    super.firstUpdated()

    this.updateHandler(this)
  }

  toggleEnable () {
    this.enabled = !this.enabled

    this.dispatchEvent(new CustomEvent('enabledChange', {
      detail: {
        enabled: this.enabled
      }
    }))
  }

  render () {
    return html`
      <h2>${this.label}</h2>
      <div class="form-check">
        <input
          id="enabled-check"
          class="form-check-input"
          type="checkbox"
          ?checked=${this.enabled}
          @change=${this.toggleEnable}>
        <label class="form-check-label" for="enabled-check">enabled</label>
      </div>
      ${this.enabled
        ? html`
          <rdf-network
            height=800
            .compoundLabels=${this.compoundLabels}
            .compounds=${this.compounds}
            .dataset=${this.coverage}>
          </rdf-network>
        `
      : ''}
    `
  }
}

export default CoverageNetwork
