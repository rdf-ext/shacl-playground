import { LitElement, css, html } from 'lit'
import style from './style.js'

class TreeView extends LitElement {
  static get styles () {
    return [
      style,
      css`
        ul {
          padding-left: 1em;
        }
      `
    ]
  }

  render () {
    return html`
      <ul>
        <slot></slot>
      </ul>
    `
  }
}

class TreeViewNode extends LitElement {
  static get properties () {
    return {
      label: {
        type: String
      },
      expanded: {
        type: Boolean
      }
    }
  }

  static get styles () {
    return [
      style,
      css`
        li::marker {
          content: "";
        }
      `
    ]
  }

  constructor () {
    super()

    this.expanded = false
  }

  toggle () {
    this.expanded = !this.expanded
  }

  render () {
    return html`
      <li class=${this.expanded ? 'expanded' : ''}>
      <p @click=${() => this.toggle()}>${this.expanded ? '▼' : '►'} ${this.label}</p>
      ${this.expanded ? html`<slot></slot>` : ''}
      </li>
    `
  }
}

export {
  TreeView,
  TreeViewNode
}
