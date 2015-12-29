(function($){
$.fn.dotGrid = function(options) {

	// Default Settings
	//--------------------------------------------
	var settings = $.extend({
		mode: 'shift',
		columns: 4,				// columns in grid
		rows: 5,				// rows in grid
		size: 60, 				// pixel size of grid squares
		speed: 200,				// length in milleseconds between loops
		shapeSetup: [
			[3,0,'#ffffff'],
			[0,0,'#008ff1'],
			[0,1,'#008ff1'],
			[0,2,'#008ff1'],
			[0,3,'#008ff1'],
			[0,4,'#008ff1'],
			[1,2,'#008ff1'],
			[2,2,'#008ff1'],
			[3,2,'#008ff1'],
			[3,3,'#008ff1'],
			[3,4,'#008ff1']
		]
	}, options);

	//--------------------------------------------
	// For Each Instance of Grid
	//--------------------------------------------
	this.each(function() {
        var gridElement = $(this),
        	columns = settings.columns,
        	rows = settings.rows,
        	remSize = getRemSize(),
        	size = settings.size * getRemSize(),
        	speed = settings.speed,
        	shapeSetup = settings.shapeSetup,
        	shape = [],
        	nextColor = null;

        init();

        function init() {
        	// make an array of objects out of shapeSetup array
			for (var i = 0; i < shapeSetup.length; i++) {
				shape.push({
					x: shapeSetup[i][0],
					y: shapeSetup[i][1],
					color: shapeSetup[i][2],
					name: 'square'+i
				});
			}

			createGrid();
			drawShape();
        }

		function createGrid() {
			var width = columns * size,
				height = rows * size;
			gridElement.css({
				'position': 'absolute',
				'top': '50%',
				'left': '50%',
				'transform': 'translate(-50%,-50%)',
				'width': width,
				'height': height
			});
		}

		function drawShape() {
			for (var i = 0; i < shape.length; i++) {
				var x = shape[i].x,
					y = shape[i].y,
					color = shape[i].color,
					name = shape[i].name;
					addSquare(i,x,y,color,name, gridElement);					
			}
		}
	
		function addSquare(i,x,y,color,name, gridElement) {
			var element = '.'+name,
				markup = '<div class="square '+name+'"></div>';
			gridElement.append(markup);
			gridElement.find(element).css({
				'background': color,
				'position': 'absolute',
				'top': (y * size) + 'px',
				'left': (x * size) + 'px',
				'width': size - 3 + 'px', // plus 1 fixes gap on non-retina screens
				'height': size - 3 + 'px',
				'transition': 'top .5s, left .5s, background .5s'
			});
		}

		// LOOP
		(function loop() {
			var random = Math.round(Math.random() * 400 + 300);
			setTimeout(function() {
				if (settings.mode == 'shift'){
					shiftShape();
				}
				if (settings.mode == 'evolve'){
					evolveShape();
				}
				loop();  
			}, random);
		}());

        // SHUFFLE SHAPE
		// 1. Shuffle directions to add randomness    
		// 2. Select first item in shape array
		// 3. Test a direction to move - it if fails move on to next direction
		// 4. if all directions fail move on to next item in shape array
		// 5. if a direction passes update shape array and position and then exit function
		function shiftShape(){
			var directions = ['up','right','down','left'],
				futureCoordinates = null,
				futureX = null,
				futureY = null;

			directions = shuffleArray(directions);
			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < directions.length; j++) {
					futureCoordinates = getFutureCoordinates(shape[i].x, shape[i].y, directions[j]);
					futureX = futureCoordinates[0];
					futureY = futureCoordinates[1];

					movePossible = testMove(futureX, futureY);
					if (movePossible) {
						shape[i].x = futureX;
						shape[i].y = futureY;
						moveSquare(i);
						updateShapeArray(i);
						
						return false; 
					}
				}
			}
		}

		// EVOLVE SHAPE
		// 1. Shuffle directions to add randomness    
		// 2. Select first item in shape array
		// 3. Test a direction to move - it if fails move on to next direction
		// 4. if all directions fail move on to next item in shape array
		// 5. if a direction passes update shape array and position and then exit function
		function evolveShape(){
			var directions = ['up','right','down','left'],
				futureCoordinates = null,
				futureX = null,
				futureY = null;

			directions = shuffleArray(directions);

			// Colorize white pixels from last loop
			for (var i = 0; i < shape.length; i++) {
				if (shape[i].color == '#ffffff') {
					shape[i].color = nextColor;
					colorSquare(i, nextColor);
				}
			}

			// Set direction
			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < directions.length; j++) {
					futureCoordinates = getFutureCoordinates(shape[i].x, shape[i].y, directions[j]);
					futureX = futureCoordinates[0];
					futureY = futureCoordinates[1];
					inBounds = testBoundaries(futureX, futureY);
					overlapped = testOverlap(futureX, futureY);

					if (inBounds && overlapped) {
						nextColor = shape[i].color;
						shape[i].x = futureX;
						shape[i].y = futureY;
						shape[i].color = '#ffffff';
						colorSquare(i, '#ffffff');
						shape[overlapped].color = '#ffffff';
						colorSquare(overlapped, '#ffffff');
						moveSquare(i);
						return false;
					} else if (inBounds) {
						shape[i].x = futureX;
						shape[i].y = futureY;
						moveSquare(i);
						updateShapeArray(i);

						return false;
					}
				}
			}
		}

		// GET FUTURE COORDINATES
		function getFutureCoordinates(x,y,direction) {
			var coordinates = [];
			switch(direction) {
				case 'up':
					coordinates[0] = x;
					coordinates[1] = y-1;
					break;
				case 'right':
					coordinates[0] = x+1;
					coordinates[1] = y;
					break;
				case 'down':
					coordinates[0] = x;
					coordinates[1] = y+1;
					break;
				case 'left':
					coordinates[0] = x-1;
					coordinates[1] = y;
					break;
			}
			return coordinates;
		}
	
		// TEST MOVE
		function testMove(futureX, futureY) {
			// Test if out of bounds
			if (futureX < 0 || futureX >= columns || futureY < 0 || futureY >= rows) {
				return false;
			}
			// Test if occupied - check if coordinates in shape array for match
			for (var i = 0; i < shape.length; i++) {
				xToTest = shape[i].x;
				yToTest = shape[i].y;
				if (futureX == xToTest && futureY == yToTest) {
					return false;
				}
			}
			return true;
		}

		// TEST IF SQUARE WILL LEAVE BOUNDARIES
		function testBoundaries(futureX, futureY) {
			// Test if out of bounds
			if (futureX < 0 || futureX >= columns || futureY < 0 || futureY >= rows) {
				return false;
			}
			return true;
		}
	
		// TEST IF SQUARE WILL OVERLAP
		function testOverlap(futureX, futureY) {
			for (var i = 0; i < shape.length; i++) {
				xToTest = shape[i].x;
				yToTest = shape[i].y;
				if (futureX == xToTest && futureY == yToTest) {
					return i;
				}
			}
			return false;
		}

		// MOVE SQUARE
		// Update the on screen location of square in i position of shape array
		function moveSquare(i) {
			var elementClass = '.'+shape[i].name,
				x = shape[i].x,
				y = shape[i].y;
			gridElement.find(elementClass).css({
				'top': (y * size) + 'px',
				'left': (x * size) + 'px',
			});
		}

		// COLOR SQUARE
		// Update the on screen color of square in i position of shape array
		function colorSquare(i, color) {
			var elementClass = '.'+shape[i].name;

			gridElement.find(elementClass).css({
				'background': color
			});
		}
		
		// UPDATE SHAPE ARRAY
		function updateShapeArray(i) {
			var deletedItem = shape.splice(i, 1),
				randomNumber = randomInt(1,8);
			shape.push({
				x: deletedItem[0].x,
				y: deletedItem[0].y,
				color: deletedItem[0].color,
				name: deletedItem[0].name
			});
			if (randomNumber == 1) {
				shape = shuffleArray(shape);
			}
		}

    }); // END FOR EACH



	//--------------------------------------------
	// UTILITIES
	//--------------------------------------------

	// SHUFFLE AN ARRAY
	function shuffleArray(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

	// RETURN A RANDOM INTERGER
	function randomInt(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	// RETURN CURRENT REM SIZE IN PIXELS
	function getRemSize() {
		remSize = 10; // sensible default

		fontSize = $('html').css('font-size');
		fontSize = parseInt(fontSize, 10);
		if (fontSize) {
			remSize = fontSize;
		}

		return remSize;
	}


	return this;
};
}(jQuery));