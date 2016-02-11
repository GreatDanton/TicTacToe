$(document).ready(function() {

// ##################   VARIABLES #####################
  var imgO = 'o.svg';
  var imgX = 'x.svg';
  var selected;
  var comp;
  var userMoves = [];
  var computerMoves = [];
  var allMoves = [1,2,3,4,5,6,7,8,9];
  var choices;
  var notAllowedMoves = [];
  var corners = [1,3,7,9];
  var winningMoves = [[2,5,8], [4,5,6], [1,2,3], [7,8,9], [1, 4, 7], [3,6,9], [1,5,9], [3, 5, 7]];


// ################# FUNCTIONS ########################
// AI move
function play2() {
  // filter choices to those numbers that are not in userMoves
  choices = allMoves.filter(function(el) {
    return notAllowedMoves.indexOf(el) < 0;
  });
  // pick random number from choices == AI move
  var number = Math.floor(Math.random() * choices.length );
  var currentCompMove = choices[number];
  // push current AI move to computerMoves + notAllowedMoves a
  computerMoves.push(currentCompMove);
  notAllowedMoves.push(currentCompMove);
  // append picture to the right button + add class disabled;
  $('#btn' + currentCompMove).append('<img class="no-select" src="'+ comp + '"/>');
  $('#btn' + currentCompMove).addClass('disabled');
  console.log('comp moves: ' + computerMoves);
  console.log('user moves: ' + userMoves);
}

// function for displaying moves.
function move(currentCompMove) {
  computerMoves.push(parseInt(currentCompMove));
  notAllowedMoves.push(parseInt(currentCompMove));
  $('#btn' + currentCompMove).append('<img class="no-select" src="'+ comp + '"/>');
  $('#btn' + currentCompMove).addClass('disabled');
}

function filter(tempArr, i) {
    var arr = winningMoves[i].filter(function(item){
      return tempArr.indexOf(item) === -1;
    });
    return arr;
}

// ############### PLAY FUNCTION ##############
function play() {
  var tempMove;
    // which choices AI has
    choices = allMoves.filter(function(el) {
      return notAllowedMoves.indexOf(el) < 0;
    });
    var check = notAllowedMoves.join('');
    switch (true) {

      case computerMoves.length === 0 && selected === imgO:
        var options = [1,3,7,9,5];
        options = options.filter(function(el) {
          return notAllowedMoves.indexOf(el) < 0;
        });
        aiMove = options[Math.floor(Math.random() * options.length)];
        move(aiMove);
      break;

      case computerMoves.length === 0:
          if ('5'.indexOf(userMoves[0]) == -1) {
            aiMove = 5;
          } else {
            aiMove = corners[Math.floor(Math.random() * 4)];
          }
          move(aiMove);
      break;

      case computerMoves.length == 1:
      // loop through winning Moves => block it or prevent bla bla;
      // if user got two in a row
      aiMove = 0; // resets aiMove
      for (i = 0; i < winningMoves.length; i++) {
        tempMove = filter(userMoves, i);
        if (tempMove.length == 1 && choices.join('').indexOf(tempMove) > -1) {
          aiMove = tempMove;
          move(aiMove);
          break;
        }
      }
      // if user doesnt have two in a row:
      if (aiMove === 0) {
        // loop through possible moves
        //console.log('I AM HERE');
        for (i = 0; i < winningMoves.length; i++) {
          // remove computer moves from winningMove[i] and check if boxes are free.
          tempMove = filter(computerMoves, i);
          if (tempMove.length == 2 && check.indexOf(tempMove[0]) == -1 && check.indexOf(tempMove[1]) == -1) {
            if (userMoves[1] == 2 || userMoves[1] == 4) {
              aiMove = tempMove[0];
            } else if (userMoves[1] == 7 || userMoves[1] == 1) {
              aiMove = tempMove[0];
            } else {
              aiMove = tempMove[1];
            }
            move(aiMove);
            break;
          }
        }
      }
      break;

      case computerMoves.length > 1:
      var aiMove = 0;
        // check if AI can win?
      aiCombinations = k_combinations(computerMoves, 2);
      for (i = 0; i< winningMoves.length; i++) {
        for (j = 0; j < aiCombinations.length; j++) {
          tempMove = filter(aiCombinations[j], i);
          if (tempMove.length == 1 && check.indexOf(tempMove) == -1) {
            aiMove = tempMove;
            move(aiMove[0]);
            break;
          }
        }
      } // end of for loop
      // if AI can't win:

      if (aiMove === 0) {
        var userCombinations = k_combinations(userMoves, 2);
        for (i = 0; i < winningMoves.length; i++) {
          for (j = 0; j <userCombinations.length; j++) {
            tempMove = filter(userCombinations[j], i);
            if (tempMove.length == 1 && check.indexOf(tempMove) == -1) {
              aiMove = tempMove[0];
              move(aiMove);
              return;
            }
          }
        }
        aiMove = 20;
      }
      if (aiMove == 20) {
        //console.log('stopped here');
        aiMove = choices[Math.floor(Math.random() * choices.length)];
        move(aiMove);
      }
      break;
      default:
        break;
    }
} // end of function play

// function to make combinations (took from internet)
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	if (k > set.length || k <= 0) {
		return [];
	}
	if (k == set.length) {
		return [set];
	}
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	// Assert {1 < k < set.length}
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}
// end of combinations

// checks if your moves are in winning moves
function state(userMoves) {
  // create combinations from user presses and check if user got a wining combination
  var userCombs = k_combinations(userMoves, 3);
    for (j = 0; j < userCombs.length; j++) {
      userCombs[j].sort(function(a,b) {
        return a - b;
      });
      for (i = 0; i < winningMoves.length; i++) {
      if (userCombs[j][0] == winningMoves[i][0] && userCombs[j][1] == winningMoves[i][1] && userCombs[j][2] == winningMoves[i][2]) {
        $('.square').addClass('disabled');
        return 'won';
      }
    }
  }
}
// end of state
// ##################### END OF FUNCTIONS ######################

// ##################### STARTING GAME ###################
// ##################### PICK X #######################
$('#oImg').click(function() {
  selected = imgO;
  comp = imgX;
  $('.modal').fadeOut(500);
  $('.overlay').fadeOut(350);
  gameOver = false;
  game();
});

$('#xImg').click(function() {
  selected = imgX;
  comp = imgO;
  $('.modal').fadeOut(500);
  $('.overlay').fadeOut(350);
  gameOver = false;
  game();
});
function game() {

  if (selected == imgX) {
// X is first, AI plays when .squared is clicked;
    $('.square').click(function() {
      $(this).append('<img class="no-select" src="'+ selected + '"/>');
      $(this).addClass('disabled');

      // get id of the clicked square and return last number
      var move = $(this).attr('id');
      // get number of
      move = move.substr(move.length - 1);
      userMoves.push(parseInt(move));
      notAllowedMoves.push(parseInt(move));

      if (state(userMoves) == 'won') {
        $('.info').html('You won the game');
        return;
      }

        // AI should wait for your first move
        if (userMoves.length > computerMoves.length){
        // pick random number of the left moves and append picture at that position.
          play();
          if (state(computerMoves) == 'won') {
            $('.info').html('You lost the game');
            return;
          }
        } // end of usermoves if

      // if the game is not over, its a draw!
      if (notAllowedMoves.length >= 9){
        $('.info').html("it's a draw!");
        return;
      }

    });

  }

// #################### PICK O ############################
  else if (selected == imgO) {
    // AI makes first move
    play();
    $('.square').click(function() {
      $(this).append('<img class="no-select" src="'+ selected + '"/>');
      $(this).addClass('disabled');
      // get id of the clicked square and return last number
      var move = $(this).attr('id');
      // get number of
      move = move.substr(move.length - 1);
      userMoves.push(parseInt(move));
      notAllowedMoves.push(parseInt(move));
      if (state(userMoves) == 'won') {
        $('.info').html('You won the game');
        return;
      }
// computer move
      play();
      if (state(computerMoves) == 'won') {
        $('.info').html('You lost the game');
        return;
      }

      if (notAllowedMoves.length >= 9){
        $('.info').html("It's a draw!");
        return;
      }
    });
  }
}

// play game
  $('#new-game').click(function(){
    computerMoves = [];
    userMoves = [];
    notAllowedMoves = [];
    choices = [];
    currentCompMove = 0;
    tempMove = 0;
    tempArr = [];
    $('.square').html('');
    $('.square').removeClass('disabled');
    $('.info').html('');
  });

});
