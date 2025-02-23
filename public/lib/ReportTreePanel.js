import { LitElement, html } from 'lit'
import { hasChangedDataset } from 'rdf-elements/hasChanged.js'
import getLabel from 'rdf-elements/src/getLabel.js'
import rdf from 'rdf-ext'
import * as ns from './namespaces.js'
import style from './style.js'

class ReportTreePanel extends LitElement {
  static get properties () {
    return {
      dataset: {
        type: Object,
        hasChanged: hasChangedDataset
      },
      label: {
        type: String
      },
      tree: {
        type: Object
      },
      updateHandler: {
        type: Function
      }
    }
  }

  static get styles () {
    return [style]
  }

  firstUpdated () {
    super.firstUpdated()

    this.updateHandler(this)
  }

  buildTree () {
    if (!this.dataset) {
      return
    }

    const root = {}

    const report = rdf.grapoi({ dataset: this.dataset }).hasOut(ns.rdf.type, ns.sh.ValidationReport)
    root.conforms = report.out(ns.sh.conforms)

    const buildResults = (results, node) => {
      node.results = []

      for (const result of results) {
        node.results = node.results || []

        const current = {
          focusNode: result.out(ns.sh.focusNode).term,
          resultMessage: result.out(ns.sh.resultMessage).term,
          resultPath: result.out(ns.sh.resultPath).term,
          resultSeverity: result.out(ns.sh.resultSeverity).term,
          sourceConstraintComponent: result.out(ns.sh.sourceConstraintComponent).term,
          sourceShape: result.out(ns.sh.sourceShape).term,
          value: result.out(ns.sh.value).term
        }

        buildResults(result.out(ns.sh.detail), current)

        node.results.push(current)
      }
    }

    buildResults(report.out(ns.sh.result), root)

    this.tree = root
  }

  getLabel (term) {
    return getLabel(term)
  }

  renderReport () {
    if (!this.tree) {
      return
    }

    return html`
      <table class="table col-6">
        <tbody>
          <tr>
            <th>conforms</th>
            <td>${this.tree.conforms.value}</td>
          </tr>
        </tbody>
      </table>
      <tree-view>
        ${this.renderResults(this.tree.results)}    
      </tree-view>`
  }

  renderResult (result) {
    return html`
      <tree-view-node label=${`${this.getLabel(result.focusNode)} - ${this.getLabel(result.sourceShape)}`}>
        <table class="table col-6">
          <tbody>
            <tr>
              <th>focusNode</th>
              <td>${this.renderTerm(result.focusNode)}</td>
            </tr>
            <tr>
              <th>resultMessage</th>
              <td>${this.renderTerm(result.resultMessage)}</td>
            </tr>
            <tr>
              <th>resultPath</th>
              <td>${this.renderTerm(result.resultPath)}</td>
            </tr>
            <tr>
              <th>resultSeverity</th>
              <td>${this.renderTerm(result.resultSeverity)}</td>
            </tr>
            <tr>
              <th>sourceConstraintComponent</th>
              <td>${this.renderTerm(result.sourceConstraintComponent)}</td>
            </tr>
            <tr>
              <th>sourceShape</th>
              <td>${this.renderTerm(result.sourceShape)}</td>
            </tr>
            <tr>
              <th>value</th>
              <td>${this.renderTerm(result.value)}</td>
            </tr>
          </tbody>
        </table>
        <tree-view>
          ${this.renderResults(result.results)}
        </tree-view>
      </tree-view-node>
    `
  }

  renderResults (results) {
    if (!results) {
      return
    }

    return results.map(result => this.renderResult(result))
  }

  renderTerm (term) {
    if (!term) {
      return ''
    }

    if (term.termType === 'NamedNode') {
      return html`<a href=${term.value}>${this.getLabel(term)}</a>`
    }

    return this.getLabel(term)
  }

  render () {
    this.buildTree()

    return html`
      <h2>${this.label}</h2>
      <div style="height: 430px; overflow: scroll;">
        ${this.renderReport()}    
      </div>
    `
  }
}

export default ReportTreePanel
