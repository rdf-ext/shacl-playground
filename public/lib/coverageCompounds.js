import rdf from 'rdf-ext'
import * as ns from './namespaces.js'

function coverageCompounds (results) {
  const compounds = rdf.termMap()
  const compoundLabels = rdf.termMap()

  const addMap = results => {
    for (const result of results) {
      for (const valuePath of result.valuePaths) {
        for (const quad of valuePath.quads()) {
          const shape = result.shape.ptr.term
          const label = rdf.grapoi(result.shape.ptr).out(ns.sh.name).value

          if (label) {
            compoundLabels.set(shape, label)
          }

          compounds.set(quad.subject, result.shape.ptr.term)

          if (!compounds.has(quad.object)) {
            compounds.set(quad.object, result.shape.ptr.term)
          }
        }
      }

      addMap(result.results)
    }
  }

  addMap(results)

  return {
    compounds,
    compoundLabels
  }
}

export default coverageCompounds
