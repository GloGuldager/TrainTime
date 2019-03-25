// $(document).ready(function () {

// connect and add config to firebase
var config = {
    apiKey: "AIzaSyBgTnVHGFGrqEz6-oQM4RuDvQcgKdo1yXM",
    authDomain: "traintimes-guldager.firebaseapp.com",
    databaseURL: "https://traintimes-guldager.firebaseio.com",
    projectId: "traintimes-guldager",
    storageBucket: "traintimes-guldager.appspot.com",
    messagingSenderId: "153818352580"
};


firebase.initializeApp(config);

var database = firebase.database();


// Click event to add new train to table and to firebase
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: destination,
        next: firstTrain,
        frequency: frequency
    };

    // Add new train to firebase on submit
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

// write new entries to both html table and to firebase an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().next;
    var frequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);


    var tFrequency = frequency;

    var firstTime = firstTrain;
    console.log("firstTime: " + firstTime);
    console.log("firstTrain: " + firstTrain);
    //both log correctly with first time

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("first time converted: " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // $("#train-header").append("Current Time: " + moment(currentTime).format("HH:mm"));
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log("tRemainder: " + tRemainder);
    //log correct

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    //log correct

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    //logs correctly

    var nextTrainPretty = moment(nextTrain).format("HH:mm");
    console.log("nextTrainPretty: " + nextTrainPretty);
    //log is NOT correct


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrainPretty),
        $("<td id = minTillTrain>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

var datetime = null,
        date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
    // nextTrain = moment().add(tMinutesTillTrain, "minutes");

};


$(document).ready(function(){
    datetime = $("#train-header")
    // nextTrain = $("#minTillTrain")
    update();
    setInterval(update, 1000);
});