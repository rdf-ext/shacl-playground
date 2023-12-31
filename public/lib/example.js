const data = `@prefix ex: <http://example.org/>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.

ex:ValidResource1 a rdfs:Resource;
  ex:property ("a" "b").
`

const shape = `@prefix ex: <http://example.org/>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix shsh: <http://www.w3.org/ns/shacl-shacl#> .
@prefix sht: <http://www.w3.org/ns/shacl-test#>.

shsh:ListShape a sh:NodeShape;
  sh:name "List";
  sh:property shsh:ListRootShape.

shsh:ListRootShape
  sh:name "ListRoot";
  sh:path [ sh:zeroOrMorePath rdf:rest ];
  sh:hasValue rdf:nil;
  sh:node shsh:ListNodeShape.

shsh:ListNodeShape a sh:NodeShape;
  sh:name "ListNode";
  sh:or (shsh:ListItemShape shsh:ListItemLastShape).

shsh:ListItemShape
  sh:name "Item";
  sh:not [
    sh:name "ListItemShape not nil";
    sh:hasValue rdf:nil
  ];
  sh:property [
    sh:name "ListItemShape first";
    sh:path rdf:first;
    sh:maxCount 1;
    sh:minCount 1
  ];
  sh:property [
    sh:name "ListItemShape rest";
    sh:path rdf:rest;
    sh:maxCount 1;
    sh:minCount 1
  ].

shsh:ListItemLastShape
  sh:name "ListItemLastShape";
  sh:hasValue rdf:nil;
  sh:property [
    sh:name "ListItemLastShape first";
    sh:path rdf:first;
    sh:maxCount 0
  ];
  sh:property [
    sh:name "ListItemLastShape rest";
    sh:path rdf:rest;
    sh:maxCount 0
  ].

ex:TestShape a sh:NodeShape;
  sh:name "TestShape";
  sh:targetNode ex:ValidResource1;
  sh:property [
    sh:name "TestShape property";
    sh:path ex:property;
    sh:node shsh:ListShape
  ].
`

export {
  data,
  shape
}
