// fractaland_tests.js

/*
test("should equals", function() {
   ok(1===1);
});
 *
 */
 
 test("fractaland should not be null", function() {
    var fractaland = createFractaland();
   ok(null != fractaland);
});