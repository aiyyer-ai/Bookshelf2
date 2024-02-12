var trait1Name = `A`;
var trait2Name = `B`;
var trait3Name = `C`;
var allInputs = document.getElementsByClassName('inputs');
var snapToWidth = [];
var bookPositions = {};
var gameScreen = document.getElementById("game");
var totalBooks, correctAnswer;

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
        elmnt.style.top = `${gameScreen.offsetTop + 30}px`;
        let placeLocation = closest(e.clientX,snapToWidth);
        let oldLocation = bookPositions[elmnt.id];
        let newLocationBookID = getKeyByValue(bookPositions, placeLocation);
        let newLocationBook = document.getElementById(newLocationBookID);
        newLocationBook.style.left = oldLocation + "px";
        bookPositions[newLocationBookID] = oldLocation;
        bookPositions[elmnt.id] = placeLocation;
        elmnt.style.left = placeLocation + "px";
        if(checkOrder()) {
			document.querySelectorAll('.books').forEach(item => {
			    item.style.backgroundColor = "#186132";
			})
        }
    }
}

function checkOrder() {
	let letterArray = [0, 0, 0];
	for (let i = 0; i < totalBooks; i++) {
		let bookLocationID = getKeyByValue(bookPositions, snapToWidth[i]);
		let bookDiv = document.getElementById(bookLocationID);
		if (correctAnswer[0].charAt(i) == `A`) {
			letterArray[0]++;
			if(bookDiv.innerHTML.slice(0,2) != `${correctAnswer[0].charAt(i)}${letterArray[0]}`) {
				return false;
			}
		} else if (correctAnswer[0].charAt(i) == `B`) {
			letterArray[1]++;
			if(bookDiv.innerHTML.slice(0,2) != `${correctAnswer[0].charAt(i)}${letterArray[1]}`) {
				return false;
			}
		} else {
			letterArray[2]++;
			if(bookDiv.innerHTML.slice(0,2) != `${correctAnswer[0].charAt(i)}${letterArray[2]}`) {
				return false;
			}
		}
	}
	return true;
}

function closest(val,arr){
    return Math.max.apply(null, arr.filter(function(v){return v <= val}))
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function startGame(permutationArray, startData) {
	correctAnswer = permutationArray;
	var allTraits = startData.pop();
	totalBooks = startData.reduce((accumulator, currentValue) => {
  		return accumulator + currentValue
	},0);
	gameScreen.style.height = `40vh`;
	gameScreen.style.width = `90vw`;
	let bookNum = 1;
	for (let i = 0; i < totalBooks; i++) {
		let bookDiv = document.createElement("div");
		bookDiv.classList.add(`books`);
		if(allTraits.charAt(i) == allTraits.charAt(i-1)) {
			bookNum++;
		} else {
			bookNum = 1;
		}
		bookDiv.innerHTML = `${allTraits.charAt(i)}${bookNum}`;
		bookDiv.id = `bookDiv${i}`;
		bookDiv.style.height = `35vh`;
		bookDiv.style.width = `${(80 / totalBooks)}vw`;
		dragElement(bookDiv);
		gameScreen.appendChild(bookDiv);
		for (let i = 0; i < 5; i++) {
			let lightDiv = document.createElement("div");
			lightDiv.classList.add(`lights`);
			lightDiv.style.display = `block`;
			lightDiv.style.width = `35px`;
			lightDiv.style.height = `35px`;
			lightDiv.addEventListener('click', function() {
				if(lightDiv.style.backgroundColor == `rgb(195, 144, 84)`) {
					lightDiv.style.backgroundColor = `rgb(236, 207, 162)`;	
				} else {
					lightDiv.style.backgroundColor = `rgb(139, 73, 55)`;					
				}
			});
			bookDiv.appendChild(lightDiv);
		}
		let snapToDistance = gameScreen.clientWidth / totalBooks;
		snapToWidth.push(Math.ceil(i * snapToDistance) + gameScreen.offsetLeft + 8);
		bookDiv.style.left = `${snapToWidth[snapToWidth.length - 1]}px`;
		bookDiv.style.top = `${gameScreen.offsetTop + 30}px`;
		bookPositions[bookDiv.id] = snapToWidth[snapToWidth.length - 1];
	}
}