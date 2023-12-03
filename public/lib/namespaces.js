import rdf from 'rdf-ext'

const rdfns = rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const sh = rdf.namespace('http://www.w3.org/ns/shacl#')
const shn = rdf.namespace('https://schemas.link/shacl-next#')

export {
  rdfns as rdf,
  sh,
  shn
}
