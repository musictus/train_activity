// Initialize Firebase
var config = {
    apiKey: "AIzaSyDOtXiim5D2LNXlLeYwWofAmYODUOV0TNw",
    authDomain: "sung-test.firebaseapp.com",
    databaseURL: "https://sung-test.firebaseio.com",
    projectId: "sung-test",
    storageBucket: "sung-test.appspot.com",
    messagingSenderId: "21688798580"
};

firebase.initializeApp(config);

    var database = firebase.database();

    var name = "";
    var destination = "";
    var firstTime = "00:00";
    var trainFrequency = 0;

    var nextTrain = "00:00";
    var minutesAway = 0;


    // Capture Button Click
    $("#submit-train").on("click", function(event) {

        event.preventDefault();
        // Grabbed values from text boxes
        name = $("#input-name").val().trim();
        destination = $("#input-destination").val().trim();
        firstTime = $("#input-time").val().trim();
        console.log(firstTime);
        trainFrequency = $("#input-frequency").val().trim();

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH,mm").subtract(1, "years");
        console.log(firstTimeConverted);
        // Current Time
        var timeNow = moment();
        console.log(timeNow);
        // Difference between the times
        var diffTime = timeNow.diff(moment(firstTimeConverted), "minutes");
        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        // Minute Until Train
        minutesAway = trainFrequency - tRemainder;
        // Next Train
        nextTrain = moment().add(minutesAway, "minutes");



        // Code for handling the push
        database.ref().push({
            name: name,
            destination: destination,
            firstTimeConverted: firstTimeConverted,
            trainFrequency: trainFrequency,
            nextTrain: nextTrain,
            minutesAway: minutesAway,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    // Firebase watcher .on("child_added"
    database.ref().on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        // Console.loging the last user's data
        var nameAppend = "<td>" + (sv.name) + "</td>";
        var destinationAppend = "<td>" + (sv.destination) + "</td>";
        var frequencyAppend = "<td>" + (sv.trainFrequency) + "</td>";
        var timeAppend = "<td>" + (sv.nextTrain) + "</td>";
        var minutesAwayAppend = "<td>" + minutesAway + "</td>";

        // Change the HTML to reflect
        $("#table-data").append( "<tr>" + nameAppend + destinationAppend + frequencyAppend + timeAppend + minutesAwayAppend + "</tr>" );

        // Handle the errors
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });