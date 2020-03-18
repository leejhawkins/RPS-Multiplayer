var firebaseConfig = {
  apiKey: "AIzaSyAwL5lSeDCQXO33al0u2PVGQbqkOAcOLig",
  authDomain: "rock-paper-scissors-77abf.firebaseapp.com",
  databaseURL: "https://rock-paper-scissors-77abf.firebaseio.com",
  projectId: "rock-paper-scissors-77abf",
  storageBucket: "rock-paper-scissors-77abf.appspot.com",
  messagingSenderId: "524869835993",
  appId: "1:524869835993:web:a8140afa9c4d3e5a4df2c8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var player1 = "";
var player2 = "";
var chat = "";
var turn = 0;
var yourName = "";
var messageNumber = 0;

database.ref('/players/player1').on("value", function (snapshot) {
  if (snapshot.child("name").exists()) {
    player1 = snapshot.val().name;
    player1Wins = snapshot.val().wins;
    player1Losses = snapshot.val().losses;
    $("#player1-wins-losses").text("Wins: " + player1Wins + "  Losses: " + player1Losses)
    $("#player1").text(snapshot.val().name);
    $("#player1-rock").text("Rock");
    $("#player1-rock").addClass("btn btn-success")
    $("#player1-rock").attr("data-text", "rock")
    $("#player1-paper").text("Paper");
    $("#player1-paper").addClass("btn btn-warning")
    $("#player1-paper").attr("data-text", "paper")
    $("#player1-scissors").text("Scissors")
    $("#player1-scissors").addClass("btn btn-danger")
    $("#player1-scissors").attr("data-text", "scissors")



  } else {
    player1 = "";
    $("#player1").text("Waiting for Player 1")
    $("#player1-rock").empty();
    $("#player1-rock").removeClass("btn btn-success")

    $("#player1-paper").empty();
    $("#player1-paper").removeClass("btn btn-warning")
    $("#player1-scissors").empty();
    $("#player1-scissors").removeClass("btn btn-danger")
    $("#player1-wins-losses").empty();
  }


})
database.ref('/players/player2').on("value", function (snapshot) {

  if (snapshot.child("name").exists()) {
    player2 = snapshot.val().name;
    player2Wins = snapshot.val().wins;
    player2Losses = snapshot.val().losses;
    $("#player2").text(snapshot.val().name);
    $("#player2-wins-losses").text("Wins: " + player2Wins + "  Losses:  " + player2Losses)
    $("#player2-rock").text("Rock");
    $("#player2-rock").addClass("btn btn-success btn-player2")
    $("#player2-rock").attr("data-text", "rock")
    $("#player2-paper").text("Paper");
    $("#player2-paper").addClass("btn btn-warning btn-player2")
    $("#player2-paper").attr("data-text", "paper")
    $("#player2-scissors").text("Scissors")
    $("#player2-scissors").addClass("btn btn-danger btn-player2")
    $("#player2-scissors").attr("data-text", "scissors")


  } else {
    player2 = ""
    $("#player2").text("Waiting for Player 2")
    $("#player2-rock").empty();
    $("#player2-rock").removeClass("btn btn-success")

    $("#player2-paper").empty();
    $("#player2-paper").removeClass("btn btn-warning")
    $("#player2-scissors").empty();
    $("#player2-scissors").removeClass("btn btn-danger")
    $("#player2-wins-losses").empty();
  }




})



$("#player-login").on("click", function (event) {
  event.preventDefault();
  yourName = $("#player-name-input").val().trim()
  if (player1 === "") {
    player1 = yourName;
    database.ref('/players/player1').set({
      name: yourName,
      wins: 0,
      losses: 0,
      choice: ""

    })
    $("#login-form").empty();
    var welcomeDiv = $('<h4>');
    welcomeDiv.text("Welcome to the game:  " + player1);
    $("#narrate-div").prepend(welcomeDiv)
    database.ref('/players/player1').onDisconnect().remove();


  } else if (player2 === "") {
    player2 = yourName;
    database.ref('players/player2').set({
      name: yourName,
      wins: 0,
      losses: 0,
      choice: ""
    })
    $("#login-form").empty();
    var welcomeDiv = $('<h4>');
    welcomeDiv.text("Welcome to the game:  " + player2)
    $("#narrate-div").prepend(welcomeDiv)


    database.ref('players/player2').onDisconnect().remove()




  }
  if (player1 && player2) {

    turn = 1;
    database.ref('/turn').set({
      turn: turn
    })

  }
  

  $("#player-name-input").val("")

})


$("#chat-button").on("click", function (event) {
  event.preventDefault();
  var message = yourName + ": " + $("#chat-input").val().trim()

  console.log(message)
  database.ref('/chat/').set({
    message: message,

  })

  $("#chat-input").val("")

})
$(".btn-player1").on("click", function (event) {
  if (turn === 1) {

    player1Choice = $(this).attr("data-text");

    database.ref('players/player1').update({
      choice: player1Choice
    })
    turn++
    database.ref('/turn').update({
      turn: turn
    })

  }

})
$(".btn-player2").on("click", function (event) {
  if (turn === 2) {
    player2Choice = $(this).attr("data-text");
    database.ref('players/player2').update({
      choice: player2Choice
    })
    turn--
    outcome();
  }
})

database.ref('/players/').on("child_removed", function (snapshot) {
  if (player1 == "" && player2 == "") {
    database.ref('/chat').remove();
  } else {
    name = snapshot.val().name
    message = name + " has disconnected";

    console.log(player1)
    console.log(player2)
    database.ref('/chat/').set({
      message: message,
    })
  }
})

database.ref('/chat/').on("value", function (snapshot) {

  message = snapshot.val().message;
  var messageDiv = $("<div>");
  messageDiv.text(message)
  $("#chat-body").append(messageDiv)

})

function outcome() {
  if (player1Choice === "rock" && player2Choice === "scissors" || player1Choice === "scissors" && player2Choice === "paper" || player1Choice === "paper" && player2Choice === "rock") {
    $("#outcome-text").html(player1 + "         wins!!")
    player1Wins++
    database.ref('players/player1').update({
      wins: player1Wins
    })
    player2Losses++
    database.ref('players/player2').update({
      losses: player2Losses
    })
  } else {
    $("#outcome-text").html(player2 + "        wins!!!")
    player1Losses++
    database.ref('players/player1').update({
      losses: player1Losses
    })
    player2Wins++
    database.ref('players/player2').update({
      wins: player2Wins
    })

  }
  setTimeout(reset, 2500)



}
database.ref('/turn').on("value", function (snapshot) {


  database.ref('/turn').onDisconnect().remove()
  if (snapshot.child("turn").exists()) {
    turn = snapshot.val().turn
  } else {
    turn = 0
    database.ref('/turn').set({
      turn: turn
    })
  }

  if (turn === 1) {
    $("#player1-card").css("border", " solid yellow 3px")
    $("#player2-card").css("border", "none")
    $("#outcome-text").empty()
    $("#turn-div").text("It is " + player1 + "'s turn")
  } else if (turn === 2) {
    $("#player2-card").css("border", " solid yellow 3px")
    $("#player1-card").css("border", "none")
    $("#turn-div").text("It is " + player2 + "'s turn")

  } else {
    $("#player1-card").css("border", "none")
    $("#player2-card").css("border", "none")
    $("#turn-div").empty()
  }

})

function reset() {
  turn = 1;
  database.ref('/turn').set({
    turn: turn
  })
  $("#outcome-text").empty();
}





