var trait1Name = `A`;
var trait2Name = `B`;
var trait3Name = `C`;
var historyTitles = [`America's Beginnings: <br>1700s`, `The Age of Revolution: <br>1800s`, `The Mechanical Era: <br>1900s`, `The Information Age: <br>2000s`];
var mathTitles = [`Algebra`, `Calculus`];
var artTitles = [`Modern Art`];
var clue1Titles1 = [`Roman Empire <br> 220 AD - 476 AD`, `Roman Empire <br> 625 BC - 120 BC`, `Roman Empire <br> 1 AD - 220 AD`, `Roman Empire <br> 120 BC - 1 AD`];
var clue1Titles2 = [`Intermediate Economics`, `Introduction to Economics`];
var clue1Titles3 = [`Music Theory`];
var clue2Titles1 = [`Encyclopedia Volume I`, `Encyclopedia Volume II`, `Encyclopedia Volume III`, `Encyclopedia Volume IV`];
var clue2Titles2 = [`Basic Spanish Dictionary`, `Advanced Spanish Dictionary`];
var clue2Titles3 = [`Animal Crossing: City Folk Game Guide`];
var allInputs = document.getElementsByClassName('inputs');
var snapToWidth = [];
var snapToWidthClue1 = [];
var snapToWidthClue2 = [];
var bookPositions = {};
var gameScreen = document.getElementById("game");
var totalBooks, correctAnswer;
var rule1TraitOrder = `ABABACA`;
var rule1LightsOn = [true, false, false];
var rule2TraitOrder = `AABAACB`;
var rule2LightsOn = [false, true, false];
var bookHeights = `${100/3*4.9/7.5}vw`;

Array.from(allInputs).forEach(function(singleInput){
  singleInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13 || singleInput.value.length == 1) {
      // Focus on the next sibling
      singleInput.nextElementSibling.focus();
      singleInput.nextElementSibling.select();
    }
  });
})

window.onload = (event) => {
	startGame(["ABACABA"], [4,2,1, "AAAABBC"]);
}

function tryValues() {
	var trait1 = document.getElementById("trait1A").value;
	var trait2 = document.getElementById("trait1B").value;
	var trait3 = document.getElementById("trait1C").value;
	var allTraits = `${trait1Name.repeat(trait1)}${trait2Name.repeat(trait2)}${trait3Name.repeat(trait3)}`;
	var allPermutations = allPerms(allTraits);
	//apply the rules
	allPermutations = applyRules(allPermutations);

	var results = `${allPermutations.length}`;

	for (permutation of allPermutations) {
		results = results.concat(`<br>`, permutation);
	}
	let resultDiv = document.getElementById("results");
	resultDiv.innerHTML = results;
	
	if(allPermutations.length == 1) {
		var gameData = [Number(trait1), Number(trait2), Number(trait3), allTraits];
		var tryThis = document.getElementById("tryThis");
		tryThis.style.display = "inline";
		tryThis.style.fontSize = "18px";
		tryThis.style.padding = "6px 10px";
		tryThis.onclick = function() {startGame(allPermutations, gameData);};
	} else {
		var tryThis = document.getElementById("tryThis");
		tryThis.style.display = "none";
	}
}

function applyRules(allPermsArray) {
	//must be in series order
	if(document.getElementById("rule2").checked) {
		allPermsArray = allPermsArray.filter((value, index) => allPermsArray.indexOf(value) === index);		
	}

	//must be palindromic
	if(document.getElementById("rule3").checked) {
		allPermsArray = allPermsArray.filter((value, index) => {
		  let re = /[\W_]/g;
		  let lowRegStr = value.toLowerCase().replace(re, '');
		  let reverseStr = lowRegStr.split('').reverse().join(''); 
		  return reverseStr === lowRegStr;
		});	
	}

	return allPermsArray;
}

const allPerms = (string) => {
  if (typeof string !== 'string') {
    throw new Error('Parameter must be a string.');
  }

  if (string === '') {
    throw new Error('Parameter cannot be an empty string.');
  }


  const perms = (str) => {
    const result = [];
    if (str.length < 2) return [str];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const otherChars = str.substring(0, i) + str.substring(i + 1);
      const otherPerms = perms(otherChars);
      otherPerms.forEach(x => {
        result.push(char + x)
      });
    }
    return result;
  }

  const permutations = perms(string);
	if(document.getElementById("rule1").checked) {
	  const hasRepeat = (str) => {
	    let prevChar = str[0];
	    for (let i = 1; i < str.length; i++) {
	      if (prevChar === str[i]) return true;
	      prevChar = str[i];
	    }
	    return false;
	  }

	  const noRepeatPerms = [];
	  for (const str of permutations) {
	    if (!hasRepeat(str)) {
	      noRepeatPerms.push(str);
	    }
	  }

	  return noRepeatPerms;
	} else {
		return permutations;
	}
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        elmnt.style.zIndex = `1`;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        return false;
    }

    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - parseInt(e.clientX);
        pos2 = pos4 - parseInt(e.clientY);
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.style.zIndex = `0`;
        elmnt.style.top = `${gameScreen.offsetTop}px`;
        let placeLocation = closest(e.clientX - gameScreen.clientWidth - 20,snapToWidth);
        if(!Number.isFinite(placeLocation)){
        	elmnt.style.left = bookPositions[elmnt.id] + "px"; 
        	return false;
        }
        let oldLocation = bookPositions[elmnt.id];
        let newLocationBookID = getKeyByValue(bookPositions, placeLocation);
        let newLocationBook = document.getElementById(newLocationBookID);
        newLocationBook.style.left = oldLocation + "px";
     // THIS WILL BE CODE THAT SHIFTS THINGS OVER
        if(placeLocation < oldLocation) {
        	let shiftSnaps = snapToWidth.slice(snapToWidth.indexOf(placeLocation), snapToWidth.indexOf(oldLocation)+1);
        	let moveNum = 0;
        	let bookNewPositions = {};
        	for (const i of shiftSnaps) {
        		moveNum++;
        		if(i != shiftSnaps[shiftSnaps.length-1]) {
			        let newLocationBookID = getKeyByValue(bookPositions, i);
			        let newLocationBook = document.getElementById(newLocationBookID);
			        newLocationBook.style.left = `${shiftSnaps[moveNum]}px`;
			        bookNewPositions[newLocationBookID] = shiftSnaps[moveNum];
        		}
        	}
        	for (const swapper in bookNewPositions) {
        		bookPositions[swapper] = bookNewPositions[swapper];
        	}
        } else if (placeLocation > oldLocation) {
        	let shiftSnaps = snapToWidth.slice( snapToWidth.indexOf(oldLocation),snapToWidth.indexOf(placeLocation)+1);
        	let moveNum = 0;
        	let bookNewPositions = {};
        	shiftSnaps = shiftSnaps.reverse();
        	for (const i of shiftSnaps) {
        		moveNum++;
        		if(i != shiftSnaps[shiftSnaps.length-1]) {
			        let newLocationBookID = getKeyByValue(bookPositions, i);
			        let newLocationBook = document.getElementById(newLocationBookID);
			        newLocationBook.style.left = `${shiftSnaps[moveNum]}px`;
			        bookNewPositions[newLocationBookID] = shiftSnaps[moveNum];
        		}
        	}
        	for (const swapper in bookNewPositions) {
        		bookPositions[swapper] = bookNewPositions[swapper];
        	}
        }
        bookPositions[elmnt.id] = placeLocation;
        elmnt.style.left = placeLocation + "px"; 
        let firstCheck = checkFirstIndicator();
        let secondCheck = checkSecondIndicator();
        let thirdCheck = checkThirdIndicator();     
     //    if(firstCheck && secondCheck && thirdCheck) {
					// document.querySelectorAll('.books').forEach(item => {
					//     item.style.backgroundColor = "#186132";
					// })
     //    }
    }
}

function checkFirstIndicator() {
	//traits cannot touch another of the same trait
	let lastBookTrait = ``;
	let firstIndicator = document.getElementById(`rule1Indicator`);
	for (const spot of snapToWidth) {
		let currentBookTrait = document.getElementById(getKeyByValue(bookPositions, spot)).altID.slice(0,1);
		if(currentBookTrait == lastBookTrait) {
			firstIndicator.style.backgroundColor = `#186132`;
			return false;
		} else {
			lastBookTrait = currentBookTrait;
		}
	}
	firstIndicator.style.backgroundColor = `#b0e476`;
	return true;
}

function checkSecondIndicator() {
	//traits must be in series order
	let letterArrayIndicator = [0, 0, 0];
	let secondIndicator = document.getElementById(`rule2Indicator`);
	for (const spot of snapToWidth) {
		let currentBookTrait = document.getElementById(getKeyByValue(bookPositions, spot)).altID.slice(0,2);
		if (currentBookTrait.charAt(0) == `A`) {
			letterArrayIndicator[0]++;
			if(currentBookTrait.charAt(1) != letterArrayIndicator[0]) {
				secondIndicator.style.backgroundColor = `#186132`;
				return false;
			}
		} else if (currentBookTrait.charAt(0) == `B`) {
			letterArrayIndicator[1]++;
			if(currentBookTrait.charAt(1) != letterArrayIndicator[1]) {
				secondIndicator.style.backgroundColor = `#186132`;
				return false;
			}
		} else {
			letterArrayIndicator[2]++;
			if(currentBookTrait.charAt(1) != letterArrayIndicator[2]) {
				secondIndicator.style.backgroundColor = `#186132`;
				return false;	
			}
		}
	}
		secondIndicator.style.backgroundColor = `#b0e476`;
		return true;
}

function checkThirdIndicator() {
	//traits must be palindromic
	let thirdIndicator = document.getElementById(`rule3Indicator`);
	let positionalString = [];
	for (const spot of snapToWidth) {
		let currentBookTrait = document.getElementById(getKeyByValue(bookPositions, spot)).altID.slice(0,1);
		positionalString.push(currentBookTrait);
	}
	if(positionalString.join(``) != positionalString.reverse().join(``)) {
		thirdIndicator.style.backgroundColor = `#186132`;
		return false;	
	}
	thirdIndicator.style.backgroundColor = `#b0e476`;
	return true;
}

function closest(val,arr){
    return Math.max.apply(null, arr.filter(function(v){return v <= val}))
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function startGame(permutationArray, startData) {
	var inputSelector = document.getElementById('allData');
	inputSelector.style.display = `none`;
	correctAnswer = permutationArray;
	var allTraits = startData.pop();
	totalBooks = startData.reduce((accumulator, currentValue) => {
  		return accumulator + currentValue
	},0);
	let indicatorLights = document.getElementsByClassName(`indicators`);
	let allCheckboxes = document.getElementsByClassName('checkboxes');
	Array.from(indicatorLights).forEach(function(singleIndicator){
		singleIndicator.style.height = `7vh`;
		singleIndicator.style.width = `20vw`;
		Array.from(allCheckboxes).forEach(function(singleInput){
			let indicatorLight = document.createElement("div");
			indicatorLight.classList.add(`indicator`);
			if(singleIndicator.id == indicatorLights[1].id) {
				indicatorLight.id = `${singleInput.id}Indicator`;		
			} else{
				indicatorLight.id = `${singleInput.id}Indicator${Array.from(indicatorLights).indexOf(singleIndicator)}`;
				//console.log(indicatorLight);
				if(indicatorLight.id == `rule1Indicator0` || indicatorLight.id == `rule2Indicator2`) {
					indicatorLight.style.backgroundColor = `#b0e476`;
				}
			}

			indicatorLight.style.width = `4vh`;
			indicatorLight.style.height = `4vh`;
			singleIndicator.appendChild(indicatorLight);
		});
	});
	gameScreen.style.height = bookHeights;
	//gameScreen.style.width = `${(gameScreen.style.height.replace(/\D/g,'')/4.9)*7.5}vh`;
	// let allClues = document.getElementById(`allClues`);
	// allClues.style.height = `40vh`;
	// allClues.style.width = `90vw`;

	let bookNum = 1;
	let actualSizes = [];
	for (let i = 0; i < totalBooks; i++) {
		let bookDivHole = document.createElement("div");
		bookDivHole.classList.add(`bookHoles`);
		let bookDiv = document.createElement("div");
		bookDiv.classList.add(`books`);
		if(allTraits.charAt(i) == allTraits.charAt(i-1)) {
			bookNum++;
		} else {
			bookNum = 1;
		}
		if (allTraits.charAt(i) == `A`) {
			//bookDiv.innerHTML = `${historyTitles[bookNum-1]}`;
			bookDiv.altID = `${allTraits.charAt(i)}${bookNum}`;
		} else if (allTraits.charAt(i) == `B`) {
			//bookDiv.innerHTML = `${mathTitles[bookNum-1]}`;
			bookDiv.altID = `${allTraits.charAt(i)}${bookNum}`;
		} else {
			//bookDiv.innerHTML = `${artTitles[bookNum-1]}`;
			bookDiv.altID = `${allTraits.charAt(i)}${bookNum}`;
		}
		bookDiv.id = `bookDiv${i}`;
		bookDiv.style.backgroundImage = `url("./allbooks/book${i+1}.png")`; 
		dragElement(bookDiv);
		gameScreen.appendChild(bookDivHole);
		actualSizes[0] = `${bookDivHole.clientHeight}px`;
		actualSizes[1] = `${bookDivHole.clientWidth}px`;
		bookDivHole.appendChild(bookDiv);
		// for (let i = 0; i < 5; i++) {
		// 	let lightDiv = document.createElement("div");
		// 	lightDiv.classList.add(`lights`);
		// 	lightDiv.style.display = `block`;
		// 	lightDiv.style.width = `3.5vh`;
		// 	lightDiv.style.height = `3.5vh`;
		// 	lightDiv.addEventListener('click', function() {
		// 		if(lightDiv.style.backgroundColor == `rgb(195, 144, 84)`) {
		// 			lightDiv.style.backgroundColor = `rgb(236, 207, 162)`;	
		// 		} else {
		// 			lightDiv.style.backgroundColor = `rgb(139, 73, 55)`;					
		// 		}
		// 	});
		// 	bookDiv.appendChild(lightDiv);
		// }
		let snapToDistance = gameScreen.clientWidth / totalBooks;
		snapToWidth.push(Math.ceil(i * snapToDistance) + gameScreen.offsetLeft + 3);
		bookDiv.style.left = `${snapToWidth[snapToWidth.length - 1]}px`;
		bookDiv.style.top = `${gameScreen.offsetTop}px`;
		bookPositions[bookDiv.id] = snapToWidth[snapToWidth.length - 1];
	}
	let allBooks = document.getElementsByClassName('books');
	Array.from(allBooks).forEach(function(singleBooks){
		singleBooks.style.height = gameScreen.style.height;
		singleBooks.style.width = actualSizes[1];
		//singleBooks.style.width = `${singleBooks.style.height.replace(/\D/g,'')/4.9}vh`;
		singleBooks.style.backgroundSize = `${singleBooks.style.width} ${singleBooks.style.height}`;
	});
	let snapPointArray = Object.values(bookPositions);
	let idArray = Object.keys(bookPositions);

	shuffle(idArray);
	
	for (const id of idArray) {
		let idDiv = document.getElementById(id);
		idDiv.style.left = `${snapToWidth[idArray.indexOf(id)]}px`;
		bookPositions[id] = snapToWidth[idArray.indexOf(id)];
	}
	let clue1Books = document.getElementById(`clue1Books`);
	clue1Books.style.height = bookHeights;
	//clue1Books.style.width = `${(clue1Books.style.height.replace(/\D/g,'')/4.9)*7.5}vh`;
	let letterArraySideBooks = [0, 0, 0];
	for (let i = 0; i < totalBooks; i++) {
		let bookDivHole = document.createElement("div");
		bookDivHole.classList.add(`bookHoles`);
		let bookDiv = document.createElement("div");
		bookDiv.classList.add(`books2`);
		bookDiv.classList.add(`books`);
		if (rule1TraitOrder.charAt(i) == `A`) {
			letterArraySideBooks[0]++;
			// bookDiv.innerHTML = `${clue1Titles1[letterArraySideBooks[0]-1]}`;
			bookDiv.altID = `${rule1TraitOrder.charAt(i)}${letterArraySideBooks[0]}`;
		} else if (rule1TraitOrder.charAt(i) == `B`) {
			letterArraySideBooks[1]++;
			// bookDiv.innerHTML = `${clue1Titles2[letterArraySideBooks[1]-1]}`;
			bookDiv.altID = `${rule1TraitOrder.charAt(i)}${letterArraySideBooks[1]}`;
		} else {
			letterArraySideBooks[2]++;
			// bookDiv.innerHTML = `${clue1Titles3[letterArraySideBooks[2]-1]}`;
			bookDiv.altID = `${rule1TraitOrder.charAt(i)}${letterArraySideBooks[2]}`;
		}
		bookDiv.id = `bookDiv${i}Clue1`;
		bookDiv.style.backgroundImage = `url("./allbooks/clue1book${i+1}.png")`;

		clue1Books.appendChild(bookDivHole);
		bookDivHole.style.height = actualSizes[0];
		bookDivHole.style.width = actualSizes[1];
		bookDivHole.appendChild(bookDiv);
		let snapToDistance = clue1Books.clientWidth / totalBooks;
		snapToWidthClue1.push(Math.ceil(i * snapToDistance) + clue1Books.offsetLeft + 3);
		bookDiv.style.left = `${snapToWidthClue1[snapToWidthClue1.length - 1]}px`;
		bookDiv.style.top = `${clue1Books.offsetTop}px`;
		bookDiv.style.fontSize = `${bookDivHole.clientHeight/1.5}%`;
		bookPositions[bookDiv.id] = snapToWidthClue1[snapToWidthClue1.length - 1];
	}
	let clue2Books = document.getElementById(`clue2Books`);
	clue2Books.style.height = bookHeights;
	//clue2Books.style.width = `${(clue2Books.style.height.replace(/\D/g,'')/4.9)*7.5}vh`;
	letterArraySideBooks = [0, 0, 0];
	for (let i = 0; i < totalBooks; i++) {
		let bookDivHole = document.createElement("div");
		bookDivHole.classList.add(`bookHoles`);
		let bookDiv = document.createElement("div");
		bookDiv.classList.add(`books2`);
		bookDiv.classList.add(`books`);
		if (rule2TraitOrder.charAt(i) == `A`) {
			letterArraySideBooks[0]++;
			// bookDiv.innerHTML = `${clue2Titles1[letterArraySideBooks[0]-1]}`;
			bookDiv.altID = `${rule2TraitOrder.charAt(i)}${letterArraySideBooks[0]}`;
		} else if (rule2TraitOrder.charAt(i) == `B`) {
			letterArraySideBooks[1]++;
			// bookDiv.innerHTML = `${clue2Titles2[letterArraySideBooks[1]-1]}`;
			bookDiv.altID = `${rule2TraitOrder.charAt(i)}${letterArraySideBooks[1]}`;
		} else {
			letterArraySideBooks[2]++;
			// bookDiv.innerHTML = `${clue2Titles3[letterArraySideBooks[2]-1]}`;
			bookDiv.altID = `${rule2TraitOrder.charAt(i)}${letterArraySideBooks[2]}`;
		}
		bookDiv.id = `bookDiv${i}Clue2`;
		bookDiv.style.backgroundImage = `url("./allbooks/clue2book${i+1}.png")`;
		clue2Books.appendChild(bookDivHole);
		bookDivHole.style.height = actualSizes[0];
		bookDivHole.style.width = actualSizes[1];
		bookDivHole.appendChild(bookDiv);
		let snapToDistance = clue2Books.clientWidth / totalBooks;
		snapToWidthClue2.push(Math.ceil(i * snapToDistance) + clue2Books.offsetLeft + 3);
		bookDiv.style.left = `${snapToWidthClue2[snapToWidthClue2.length - 1]}px`;
		bookDiv.style.top = `${clue2Books.offsetTop}px`;
		bookDiv.style.fontSize = `${bookDivHole.clientHeight/1.5}%`;
		bookPositions[bookDiv.id] = snapToWidthClue2[snapToWidthClue2.length - 1];
	}
	allBooks = document.getElementsByClassName('books2');
	Array.from(allBooks).forEach(function(singleBooks){
		singleBooks.style.height = actualSizes[0];
		singleBooks.style.width = actualSizes[1];
		singleBooks.style.backgroundSize = `${singleBooks.style.width} ${singleBooks.style.height}`;
	});
  checkFirstIndicator();
  checkSecondIndicator();
	checkThirdIndicator();  
}