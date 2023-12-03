import { LitElement, html } from 'lit'
import { hasChangedDataset } from 'rdf-elements/hasChanged.js'
import getLabel from 'rdf-elements/src/getLabel.js'
import rdf from 'rdf-ext'
import * as ns from './namespaces.js'
import style from './style.js'

class ShapeTreePanel extends LitElement {
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
    return style()
  }

  firstUpdated () {
    super.firstUpdated()

    this.updateHandler(this)
  }

  buildTree () {
    if (!this.dataset) {
      return
    }

    const ptr = rdf.grapoi({ dataset: this.dataset })

    const shapes = rdf.termSet([
      ...ptr.hasOut(ns.rdf.type, ns.sh.NodeShape).terms,
      ...ptr.out([ns.sh.node, ns.sh.not, ns.sh.qualifiedValueShape]).terms,
      ...ptr.hasOut(ns.rdf.type, ns.sh.PropertyShape),
      ...ptr.out([ns.sh.property]).terms
    ])

    for (const listPtr of ptr.out([ns.sh.and, ns.sh.or, ns.sh.xone])) {
      for (const itemPtr of listPtr.list()) {
        shapes.add(itemPtr.term)
      }
    }

    this.shapes = [...shapes].map(shape => ptr.node(shape))
  }

  getLabel (term) {
    if (!term) {
      return ''
    }

    return getLabel(term)
  }

  renderShape (shape) {
    const rows = []

    const properties = [{
      term: ns.sh.and,
      name: 'and'
    }, {
      term: ns.sh.class,
      name: 'class'
    }, {
      term: ns.sh.closed,
      name: 'closed'
    }, {
      term: ns.sh.datatype,
      name: 'datatype'
    }, {
      term: ns.sh.disjoint,
      name: 'disjoint'
    }, {
      term: ns.sh.equals,
      name: 'equals'
    }, {
      term: ns.sh.hasValue,
      name: 'has value'
    }, {
      term: ns.sh.ignoredProperties,
      name: 'ignored properties'
    }, {
      term: ns.sh.in,
      name: 'in'
    }, {
      term: ns.sh.languageIn,
      name: 'language in'
    }, {
      term: ns.sh.lessThan,
      name: 'less than'
    }, {
      term: ns.sh.lessThanOrEquals,
      name: 'less than or equals'
    }, {
      term: ns.sh.maxCount,
      name: 'max count'
    }, {
      term: ns.sh.maxExclusive,
      name: 'max exclusive'
    }, {
      term: ns.sh.maxInclusive,
      name: 'max inclusive'
    }, {
      term: ns.sh.maxLength,
      name: 'max length'
    }, {
      term: ns.sh.minCount,
      name: 'min count'
    }, {
      term: ns.sh.minExclusive,
      name: 'min exclusive'
    }, {
      term: ns.sh.minInclusive,
      name: 'min inclusive'
    }, {
      term: ns.sh.minLength,
      name: 'min length'
    }, {
      term: ns.sh.node,
      name: 'node'
    }, {
      term: ns.sh.nodeKind,
      name: 'node kind'
    }, {
      term: ns.sh.not,
      name: 'not'
    }, {
      term: ns.sh.or,
      name: 'or'
    }, {
      term: ns.sh.path,
      name: 'path'
    }, {
      term: ns.sh.pattern,
      name: 'pattern'
    }, {
      term: ns.sh.property,
      name: 'property'
    }, {
      term: ns.sh.qualifiedMaxCount,
      name: 'qualified max count'
    }, {
      term: ns.sh.qualifiedMinCount,
      name: 'qualified min count'
    }, {
      term: ns.sh.qualifiedValueShape,
      name: 'qualified value shape'
    }, {
      term: ns.sh.qualifiedValueShapesDisjoint,
      name: 'qualified value shapes disjoint'
    }, {
      term: ns.sh.targetClass,
      name: 'target class'
    }, {
      term: ns.sh.targetNode,
      name: 'target node'
    }, {
      term: ns.sh.targetObjectsOf,
      name: 'target objects of'
    }, {
      term: ns.sh.targetSubjectsOf,
      name: 'target subjects of'
    }, {
      term: ns.sh.uniqueLang,
      name: 'unique lang'
    }, {
      term: ns.sh.xone,
      name: 'xone'
    }]

    for (const property of properties) {
      const result = shape.out(property.term)

      if (result.isList()) {
        rows.push(html`
          <th>${property.name}</th>
          <td>${[...result.list()].map(item => this.renderTerm(item))}</td>
        `)
      } else if (result.terms.length > 0) {
        rows.push(html`
          <th>${property.name}</th>
          <td>${this.renderTerms(result.terms)}</td>
        `)
      }
    }

    return html`
      <table class="table col-6">
        <tbody>
          ${rows.map(row => html`<tr>${row}</tr>`)}
        </tbody>
      </table>
    `
  }

  renderNodeShapes () {
    if (!this.shapes) {
      return
    }

    return html`
      <tree-view>
        ${this.shapes.map(shape => {
          return html`
            <tree-view-node label=${`${this.getLabel(shape.out(ns.sh.name).term) || this.getLabel(shape.term)}`}>
              ${this.renderShape(shape)}
            </tree-view-node>
          `
        })}
      </tree-view>`
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

  renderTerms (terms) {
    return (terms || []).map(term => this.renderTerm(term))
  }

  render () {
    this.buildTree()

    return html`
      <h2>${this.label}</h2>
      <div style="height: 430px; overflow: scroll;">
        <h5>Node Shapes</h5>
        ${this.renderNodeShapes()}    
      </div>
    `
  }
}

export default ShapeTreePanel
