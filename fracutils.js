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