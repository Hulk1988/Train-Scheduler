$(document).ready(function() {
  //1. link to Firebase
  // 2.  Initialize Firebase
  var config = {
    apiKey: "AIzaSyDpbXGOsDsyj9hMDjoM9sC1qwkDNI2UYdo",
    authDomain: "train-project-a3fc4.firebaseapp.com",
    databaseURL: "https://train-project-a3fc4.firebaseio.com",
    projectId: "train-project-a3fc4",
    storageBucket: "train-project-a3fc4.appspot.com",
    messagingSenderId: "758333240147"
  };
  firebase.initializeApp(config);

  let fireDB = firebase.database();
  let now = moment();

  // 2. setup on click function for submit button id is addTrainBtn
  //button here-----
  $("#addTrainBtn").on("click", function() {
    event.preventDefault();
    // Grabs user input and assign to variables
    let trainName = $("#trainNameInput")
      .val()
      .trim();
    let lineName = $("#lineInput")
      .val()
      .trim();
    let destination = $("#destinationInput")
      .val()
      .trim();
    let trainTimeInput = $("#trainTimeInput")
      .val()
      .trim();
    let frequencyInput = $("#frequencyInput")
      .val()
      .trim();

    //setup a variable to hold input info

    let newTrainInfo = {
      name: trainName,
      line: lineName,
      destination: destination,
      firstTrainTime: trainTimeInput,
      frequency: frequencyInput
    };

    fireDB.ref().push(newTrainInfo);
    //Clears the form

    $("#trainNameInput").val("");
    $("#lineInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");
    appendToTable();

    //test #1
    console.log(newTrainInfo.name);
    console.log(newTrainInfo.line);
    console.log(newTrainInfo.destination);
    console.log(newTrainInfo.firstTrainTime);
    console.log(newTrainInfo.frequency);
  });

  //create an object to hold variables
  let appendToTable = function() {
    // Used to append or add the newly added train info into the table
    fireDB
      .ref()
      .orderByChild("dateAdded")
      .limitToLast(1)
      .on("child_added", function(snapshot) {
        let sv = snapshot.val();
        console.log(sv);

        //Create a variable that the function responsible for calculating time
        
       let calcTimeArr = sv.firstTrainTime.split(":");
       //Test#2
       console.log(calcTimeArr)
       let hoursToMinutes = moment().hours(calcTimeArr[0]).minutes(calcTimeArr[1])
       //Test #3
       console.log(hoursToMinutes)
       let minsToArrival;
       let trainArrival;
       //Test #4
        console.log(minsToArrival)
        console.log(trainArrival)

        let trainMax = moment.max(moment(), hoursToMinutes)
        //test#5
        console.log(trainMax)

        if (trainMax === hoursToMinutes) {
          trainArrival = hoursToMinutes.format("hh:mm A")
          minsToArrival = hoursToMinutes.diff(moment(), "minutes")
          console.log(hoursToMinutes)
          console.log(trainArrival)
          console.log(minsToArrival)
        } else {
          let timeDifference = moment().diff(hoursToMinutes, "minutes")
          let trainRemainder = timeDifference%sv.frequency
          console.log(timeDifference)
          console.log(trainRemainder)
          //Redefine mins to arrival = minsToArival
          minsToArrival = sv.frequency - trainRemainder
          //Refine arrival time back to military time
          trainArrival = moment().add(minsToArrival, "m").format("hh:mm A")
          console.log(minsToArrival)
          console.log(trainArrival)
        }
        //advance jquery method used
         let tr = `<tr><td>${sv.name}</td><td>${sv.line}</td><td>${sv.destination}</td>
                 <td>${sv.frequency}</td><td>${trainArrival}</td>
                 <td>${minsToArrival}</td></tr>`;

        // appending to the table body
        $("tbody").append(tr);
      });
  };
  // variable and functions use to calculate the next train time

  // Used to append or add the newly added train info into the table

  //create a firebase function to fire on event newRowAdded

  //-- need to store firebase data into variable 'storedFbData'

  //math using 'moment' to calculate two fields of next arrival and minutes away.

  // Add info from FB to newly created table. END. on to extra credit!!!

  // look at moment.js and docs and time library functionality/ built in functions.
});
