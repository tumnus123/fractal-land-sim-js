// fracutils_tests.js

/*
test("should equals", function() {
   ok(1===1);
});
 *
 */

test("fracutils should not be null", function() {
   var fu = createFracUtils();
   ok(null != fu);
});

test("index of middle vertex should always be odd", function() {
   var fu = createFracUtils();
   var i = fu.getMiddleVertexIndex([1,2,3,4]);
   var j = fu.getMiddleVertexIndex([1,2,3,4,5]);
   ok(i%2==1 && j%2==1);
});

test("vertex 0 should have 3 neighbors: E, SE, S", function() {
   var fu = createFracUtils();
   var nw = fu.getNeighborIndex(0, 10, "NW");
   var n = fu.getNeighborIndex(0, 10, "N");
   var ne = fu.getNeighborIndex(0, 10, "NE");
   var w = fu.getNeighborIndex(0, 10, "W");
   var e = fu.getNeighborIndex(0, 10, "E");
   var sw = fu.getNeighborIndex(0, 10, "SW");
   var s = fu.getNeighborIndex(0, 10, "S");
   var se = fu.getNeighborIndex(0, 10, "SE");
   ok(nw==null &&
      n==null &&
      ne==null &&
      w==null &&
      e==1 &&
      sw==null &&
      s==10 &&
      se==11);
});
