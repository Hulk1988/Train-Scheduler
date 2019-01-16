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
  let trainArr = [];
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
      // trainArrival: trainArrival,
      // minsToArival: minsToArrival,
    };

    fireDB.ref().push(newTrainInfo);
    //Clears the form

    $("#trainNameInput").val("");
    $("#lineInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");

  });

  // Used to append or add the newly added train info into the table
  fireDB
    .ref()
    .orderByChild("dateAdded")
    .on("child_added", function(snapshot) {
      let sv = snapshot.val();
      console.log(sv);

      //Create a variable that the function responsible for calculating time

      let calcTimeArr = sv.firstTrainTime.split(":");
      //Test#2
      console.log(calcTimeArr);
      let hoursToMinutes = moment()
        .hours(calcTimeArr[0])
        .minutes(calcTimeArr[1]);
      
      let trainArrival = calculateNextArrival(hoursToMinutes, sv.frequency);
      let minsToArrival = trainArrival.diff(moment(), "minutes");

      //need to connect to firebase to add minsToArrival and trainArrival
      //advance jquery method used
      trainArr.push({
        name: sv.name,
        line: sv.line,
        destination: sv.destination,
        firstTrainTime: sv.firstTrainTime,
        frequency: sv.frequency,
        trainArrival: trainArrival.format("hh:mm A"),
        minsToArrival: minsToArrival
      });

      renderTrainRows();
    });

  function renderTrainRows() {
    $('tbody').empty();
    for (let i = 0; i < trainArr.length; i++) {
      const train = trainArr[i];
      let tr = `
        <tr>
          <td>${train.name}</td>
          <td>${train.line}</td>
          <td>${train.destination}</td>
          <td>${train.frequency}</td>
          <td>${train.trainArrival}</td>
          <td>${train.minsToArrival}</td>
        </tr>`;
      // appending to the table body
      $("tbody").append(tr);
    }
  }

  function calculateNextArrival(initialTime, frequency) {
    let trainMax = moment.max(moment(), moment(initialTime));

    let trainArrival;
    if (trainMax === initialTime) {
      trainArrival = initialTime.format("hh:mm A");
    } else {
      let timeDifference = moment().diff(initialTime, "minutes");
      let trainRemainder = timeDifference % frequency;
      
      //Redefine mins to arrival = minsToArival
      minsToArrival = frequency - trainRemainder;
      //Refine arrival time back to military time
      trainArrival = moment()
        .add(minsToArrival, "m");
    }

    return trainArrival;
  }
  
  function updateArrivalTimes() {
    let trainInfo = fireDB.ref().orderByKey();
    console.log(trainInfo);
    for (let i = 0; i < trainArr.length; i++) {
      const train = trainArr[i];
      let trainArrival = calculateNextArrival(train.initialTime, train.frequency);
      train.trainArrival = trainArrival.format("hh:mm A");
      train.minsToArrival = trainArrival.diff(moment(), "minutes");
    }
    renderTrainRows();
  }
  setInterval(updateArrivalTimes, 1000 * 6);
});

// setTimeout(sixtySeconds, 1000 * 6);
// function sixtySeconds() {
//   let trainInfo = fireDB.ref().orderByKey();
//   console.log(trainInfo)
//   // console.log(trainArrival);
//   // console.log(minsToArrival);

// }
// variable and functions use to calculate the next train time

// Used to append or add the newly added train info into the table

//create a firebase function to fire on event newRowAdded

//-- need to store firebase data into variable 'storedFbData'

//math using 'moment' to calculate two fields of next arrival and minutes away.

// Add info from FB to newly created table. END. on to extra credit!!!

// look at moment.js and docs and time library functionality/ built in functions.

// From Leah Daniels to Everyone:  02:32 PM
// $.ajax({
//   dataType: 'json',
//   url: 'https://developers.zomato.com/api/v2.1/cities',
//   headers: {
//     'user-key': 'put your key in here'
//   }
//   success: function(response, status, xhr) {
//     // Handle the response here.
//   }
// });
// From Leah Daniels to Everyone:  04:01 PM
// var leadsRef = database.ref('leads');
// lfireDB.ref().on('value', function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       var childData = childSnapshot.val();
//     });
// });
// From Leah Daniels to Everyone:  04:18 PM
// // https://firebase.google.com/docs/database/web/read-and-write#basic_write
// // https://stackoverflow.com/questions/49101324/android-firebase-update-existing-value-instead-of-setvalue-creating-a-new-record
// //https://firebase.google.com/docs/database/web/read-and-write#basic_write
// https://stackoverflow.com/questions/49101324/android-firebase-update-existing-value-instead-of-setvalue-creating-a-new-record
// https://stackoverflow.com/questions/48904039/is-it-possible-to-update-only-specific-data-on-my-child-on-firebase
 //bonus material timer
  //var time;
  //var countDownSeconds = 60;
  // fireDB.ref().on('value', function(snapshot) {
  //   snapshot.forEach(function(childSnapshot) {
  //     var childData = childSnapshot.val();
  //     console.log(childData)
