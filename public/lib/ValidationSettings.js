/* global CustomEvent */

import { LitElement, html } from 'lit'
import style from './style.js'

class ValidationSettings extends LitElement {
  static get properties () {
    return {
      coverage: {
        type: Boolean
      },
      debug: {
        type: Boolean
      },
      dropdownVisible: {
        type: Boolean
      },
      details: {
        type: Boolean
      },
      trace: {
        type: Boolean
      }
    }
  }

  static get styles () {
    return style()
  }

  constructor () {
    super()

    this.dropdownVisible = false
  }

  changeCoverage (event) {
    this.coverage = event.currentTarget.checked

    if (this.coverage) {
      this.debug = true
      this.details = true
      this.trace = true
    } else {
      this.debug = false
      this.details = false
      this.trace = false
    }

    this.changeSettings()
  }

  changeDebug (event) {
    this.debug = event.currentTarget.checked

    if (!this.debug) {
      this.coverage = false
    }

    this.changeSettings()
  }

  changeDetails (event) {
    this.details = event.currentTarget.checked

    if (!this.details) {
      this.coverage = false
    }

    this.changeSettings()
  }

  changeTrace (event) {
    this.trace = event.currentTarget.checked

    if (!this.trace) {
      this.coverage = false
    }

    this.changeSettings()
  }

  changeSettings () {
    if (this.debug && this.details && this.trace) {
      this.coverage = true
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        coverage: this.coverage,
        debug: this.debug,
        details: this.details,
        trace: this.trace
      }
    }))
  }

  toggleDropdown () {
    this.dropdownVisible = !this.dropdownVisible
  }

  render () {
    return html`
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button"
          @click=${this.toggleDropdown}>
          Validation Settings  
        </button>
        <ul class=${`dropdown-menu ${this.dropdownVisible ? 'show' : ''}`}>
          <li class="dropdown-item">
            <input id="coverage-check" class="form-check-input" type="checkbox"
              .checked=${this.coverage}
              @change=${this.changeCoverage}>
            <label class="form-check-label" for="coverage-check"><strong>coverage</strong> (enable collecting covered quads. Will also enable debug details, and trace.)</label>
          </li>
          <li class="dropdown-item">
            <input id="debug-check" class="form-check-input" type="checkbox"
              .checked=${this.debug}
              @change=${event => this.changeDebug(event)}>
            <label class="form-check-label" for="debug-check"><strong>debug</strong> (generate results for successful validations)</label>
          </li>
          <li class="dropdown-item">
            <input id="details-check" class="form-check-input" type="checkbox"
              .checked=${this.details}
              @change=${event => this.changeDetails(event)}>
            <label class="form-check-label" for="details-check"><strong>details</strong> (generate nested result details)</label>
          </li>
          <li class="dropdown-item">
            <input id="trace-check" class="form-check-input" type="checkbox"
              .checked=${this.trace}
              @change=${event => this.changeTrace(event)}>
            <label class="form-check-label" for="trace-check"><strong>trace</strong> (generate results for path traversing)</label>
          </li>
        </ul>
      </div>
    `
  }
}

export default ValidationSettings
