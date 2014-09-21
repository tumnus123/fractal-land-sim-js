// fracutils.js

function createFracUtils() {
   var me = {};
   
   me.fracutils = function() {
      
   };
   
   me.fracutils.getMiddleVertexIndex = function(arrVertices) {
      var i;
      if (arrVertices.length % 2 == 0) {
         i = arrVertices.length / 2;
      } else {
         i = (arrVertices.length - 1) / 2;
      }
      return i+1;
   };
   
   me.fracutils.getIter =
      /*
   	 * Mandelbrot calculation equation
   	 * Derived from: 
   	 *    The Mandelbrot Set, in HTML5 canvas and javascript.
   	 *    https://github.com/cslarsen/mandelbrot-js
   	 *    Copyright (C) 2012 Christian Stigen Larsen
   	 *    Licensed under the Apache License, Version 2.0 (the "License"); you may
   	 *    not use this file except in compliance with the License.  You may obtain
   	 *    a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   	 *    Unless required by applicable law or agreed to in writing, software
   	 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
   	 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
   	 *    License for the specific language governing permissions and limitations
   	 *    under the License.
   	 *
   	 * Returns number of iterations and values of Z_{n}^2 = Tr + Ti at the time
   	 * we either converged (n == iterations) or diverged.  We use these to
   	 * determined the color at the current pixel.
   	 *
   	 * The Mandelbrot set is rendered taking
   	 *
   	 *     Z_{n+1} = Z_{n} + C
   	 *
   	 * with C = x + iy, based on the "look at" coordinates.
   	 *
   	 * The Julia set can be rendered by taking
   	 *
   	 *     Z_{0} = C = x + iy
   	 *     Z_{n+1} = Z_{n} + K
   	 *
   	 * for some arbitrary constant K.  The point C for Z_{0} must be the
   	 * current pixel we're rendering, but K could be based on the "look at"
   	 * coordinate, or by letting the user select a point on the screen.
   	 */
   	function(Cr, Ci, escapeRadius, maxIter)
   	{
   	  var Zr = 0;
   	  var Zi = 0;
   	  var Tr = 0;
   	  var Ti = 0;
   	  var n  = 0;
   	
   	  for ( ; n<maxIter && (Tr+Ti)<=escapeRadius; ++n ) {
   	    Zi = 2 * Zr * Zi + Ci;
   	    Zr = Tr - Ti + Cr;
   	    Tr = Zr * Zr;
   	    Ti = Zi * Zi;
   	  }
   	
   	  /*
   	   * Four more iterations to decrease error term;
   	   * see http://linas.org/art-gallery/escape/escape.html
   	   */
   	  for ( var e=0; e<4; ++e ) {
   	    Zi = 2 * Zr * Zi + Ci;
   	    Zr = Tr - Ti + Cr;
   	    Tr = Zr * Zr;
   	    Ti = Zi * Zi;
   	  }
   	
   		// smooth coloring algorithm from linas.org
   		//var modulus = Math.sqrt(Tr*Tr+Ti*Ti);
   		//var mu = (n - (Math.log(Math.log(modulus))) / Math.log(2.0)) / maxIter;
   	
   	  if ( n < maxIter ) {
   	    var zn = Math.sqrt( Tr*Tr + Ti*Ti );
   	    var nu = Math.log( Math.log(zn) / Math.log(2) ) / Math.log(2);
   	    // Rearranging the potential function.
   	    // Could remove the sqrt and multiply log(zn) by 1/2, but less clear.
   	    // Dividing log(zn) by log(2) instead of log(N = 1<<8)
   	    // because we want the entire palette to range from the
   	    // center to radius 2, NOT our bailout radius.
   	    n = n + 1 - nu;
   	  }
   	
   	  return [n, Tr, Ti];
   	};

   me.fracutils.calcVertexColors = function(geometry) {
		// calculate vertex colors based on Y (height) values
		geometry.computeBoundingBox();
		var yMin = geometry.boundingBox.min.y;
		var yMax = geometry.boundingBox.max.y;
		var yRange = yMax - yMin;
		var color, point, face, numberOfSides, vertexIndex;
		// faces are indexed using characters
		var faceIndices = [ 'a', 'b', 'c', 'd' ];
		// first, assign colors to vertices as desired
		for ( var i = 0; i < geometry.vertices.length; i++ ) 
		{
			point = geometry.vertices[ i ];
			color = new THREE.Color( 0x0000ff );
			color.setHSL( 0.7 * (yMax - point.y) / yRange, 0.5, 0.3 );
			geometry.colors[i] = color; // use this array for convenience
		}
		// copy the colors as necessary to the face's vertexColors array.
		for ( var i = 0; i < geometry.faces.length; i++ ) 
		{
			face = geometry.faces[ i ];
			numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
			for( var j = 0; j < numberOfSides; j++ ) 
			{
				vertexIndex = face[ faceIndices[ j ] ];
				face.vertexColors[ j ] = geometry.colors[ vertexIndex ];
			}
		}
		return geometry;
	};
   
   me.fracutils.erodeHeight = function(i, hi, hnN, hnW, hnE, hnS, iSideSize) {
		// hi is the height of the current cell, i
		// hnX is the height of the neightbor to the X direction
		var maxHeightDiff = 0;
		var testHeightDiff;
		var neighbor = "";
		var tallShort = "";
		
		var talusAngle = 5; // 4/width of map
		
		if (hnN!=null) {
			testHeightDiff = hi - hnN;
			if (testHeightDiff > maxHeightDiff) {
				maxHeightDiff = testHeightDiff;
				neighbor = "hnN";
				if (hi > hnN) {tallShort = "taller";} else {tallShort = "shorter";}
			}
		}
		if (hnW!=null) {
			testHeightDiff = hi - hnW;
			if (testHeightDiff > maxHeightDiff) {
				maxHeightDiff = testHeightDiff;
				neighbor = "hnW";
				if (hi > hnW) {tallShort = "taller";} else {tallShort = "shorter";}
			}
		}
		if (hnE!=null) {
			testHeightDiff = hi - hnE;
			if (testHeightDiff > maxHeightDiff) {
				maxHeightDiff = testHeightDiff;
				neighbor = "hnE";
				if (hi > hnE) {tallShort = "taller";} else {tallShort = "shorter";}
			}
		}
		if (hnS!=null) {
			testHeightDiff = hi - hnS;
			if (testHeightDiff > maxHeightDiff) {
				maxHeightDiff = testHeightDiff;
				neighbor = "hnS";
				if (hi > hnS) {tallShort = "taller";} else {tallShort = "shorter";}
			}
		}
		// calculate slope
		var slope = maxHeightDiff; // assumes "run" is 1.0
		
		// if slope exceeds talus angle, erode
		var deltaHeight = 0;
		var iTarget = i;				
		if (slope > talusAngle) {
			// erosion factor
			deltaHeight = maxHeightDiff / 2;
			
			// determine which index the eroded material flows to
			if (neighbor=="hnW") { iTarget -= 1; }
			if (neighbor=="hnE") { iTarget += 1; }
			if (neighbor=="hnN") { iTarget -= iSideSize; }
			if (neighbor=="hnS") { iTarget += iSideSize; }
			
			// perform the erosion
			if (tallShort=="taller") {
				hi -= deltaHeight;
			} else {
				hi += deltaHeight;
				deltaHeight *= -1;
			}
		}
		
		var arrReturn = [];
		arrReturn.push(hi);
		arrReturn.push(iTarget);
		arrReturn.push(deltaHeight);
		
		return arrReturn;
	};
   
   me.fracutils.getNeighborIndex = function(i, iSideSize, strDirection) {
		// Assumes (0,0) is in NW corner.
		// Returns null if no neighbor in the specified direction
		
		var neighborExistsNorth = function(i, iSideSize) {
			if(i>=iSideSize) { return true; } else { return false;}
		}
		var neighborExistsWest = function(i, iSideSize) {
			if(i%iSideSize!=0) { return true; } else { return false;}
		}
		var neighborExistsEast = function(i, iSideSize) {
			if((i+1)%iSideSize!=0) { return true; } else { return false;}
		}
		var neighborExistsSouth = function(i, iSideSize) {
			if(i<(iSideSize*iSideSize-iSideSize)) { return true; } else { return false;}
		}
		
		var returnVal = null;
		switch (strDirection.toUpperCase()) {
			case 'NW':
				if(neighborExistsNorth(i,iSideSize) && neighborExistsWest(i,iSideSize)) {
					returnVal = i-iSideSize-1;
				}
				break;
			case 'N':
				if(neighborExistsNorth(i,iSideSize)) {
					returnVal = i-iSideSize;
				}
				break;
			case 'NE':
				if(neighborExistsNorth(i,iSideSize) && neighborExistsEast(i,iSideSize)) {
					returnVal = i-iSideSize+1;
				}
				break;
			case 'W':
				if(neighborExistsWest(i,iSideSize)) {
					returnVal = i-1;
				}
				break;
			case 'E':
				if(neighborExistsEast(i,iSideSize)) {
					returnVal = i+1;
				}
				break;
			case 'SW':
				if(neighborExistsSouth(i,iSideSize) && neighborExistsWest(i,iSideSize)) {
					returnVal = i+iSideSize-1;
				}
				break;
			case 'S':
				if(neighborExistsSouth(i,iSideSize)) {
					returnVal = i+iSideSize;
				}
				break;
			case 'SE':
				if(neighborExistsSouth(i,iSideSize) && neighborExistsEast(i,iSideSize)) {
					returnVal = i+iSideSize+1;
				}
				break;
			default:
				break;
		}
		return returnVal;
	};
   
   
   return me.fracutils;
}