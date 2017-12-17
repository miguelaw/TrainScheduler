$(document).ready(function(){

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB1ivGroVZ19r_FGlZq1AIZ4lBJB7te7VM",
  authDomain: "train-project-36a38.firebaseapp.com",
  databaseURL: "https://train-project-36a38.firebaseio.com",
  projectId: "train-project-36a38",
  storageBucket: "train-project-36a38.appspot.com",
  messagingSenderId: "205707985712"
};
firebase.initializeApp(config);

  let database = firebase.database();

  ////Clock template from CodePen ////
  function clock() {
  var time = new Date(),
      
      // Access the "getHours" method on the Date object with the dot accessor.
      hours = time.getHours(),
      
      // Access the "getMinutes" method with the dot accessor.
      minutes = time.getMinutes(),
      
      
      seconds = time.getSeconds();
  
  document.querySelectorAll('.clock')[0].innerHTML = harold(hours) + ":" + harold(minutes) + ":" + harold(seconds);
    
    function harold(standIn) {
      if (standIn < 10) {
        standIn = '0' + standIn
      }
      return standIn;
    }
  }
  setInterval(clock, 1000);
////////////////////////////////////

  //Refresh page every 1 min
  setTimeout(function () { 
    location.reload();
  }, 60000);

  // Iniitial Values
  let trainName = "";
  let destination = "";
  let firstTime = "";
  let frequency = "";

  // on click function for Submit Button
  $("#submitBtn").on("click", function() {

    event.preventDefault();

    let trainName = $("#trainName").val().trim();
    let destination = $("#destination").val().trim();
    let firstTime = $("#firstTime").val().trim();
    let frequency = $("#frequency").val().trim();

    //Creating an Object to store the data in firebase (key: value)
    trainInfo = {
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    }

    // push user input data into firebase
    database.ref().push(trainInfo);

    //Clear all input from the user input form form
    $("#trainName").val(" ");
    $("#destination").val(" ");
    $("#firstTime").val(" ");
    $("#frequency").val(" ");

  });

  database.ref().on('child_added', function(childSnapshot, prevChildName) {
    // do something with the child
    let name = childSnapshot.val().trainName;
   //  console.log(name);
    let destinationTable = childSnapshot.val().destination;
   //  console.log(destinationTable);
   let firstTTable = childSnapshot.val().firstTime;
   // console.log(firstTTable);
   let frequencyTable = childSnapshot.val().frequency;
   // console.log(frequencyTable);


  // Calculating the time for "next arrival" & "mins away" 
    let firstTimeConversion = moment(firstTTable, "hh:mm").subtract(1, "years");

    let diffTime = moment().diff(moment(firstTimeConversion), "minutes");

    let trainRemainder = diffTime % frequencyTable;

    let minsTarrive = frequencyTable - trainRemainder;

    let minAway = moment().add(minsTarrive, "minutes");

    let arrivalmt = moment(minAway).format("HH:mm");

  // Display Data in the Table
   $("#rowSpace").append(`<tr>
                              <td> ${name} </td>
                              <td> ${destinationTable} </td>
                              <td> ${frequencyTable} </td>
                              <td> ${arrivalmt} </td>
                              <td> ${minsTarrive} </td>
                          </tr>`);

  });


})
