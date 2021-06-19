//Execute in strict mode to avoid some common mistakes
"use strict";

var controller;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    controller = new MealCarbCounter();
}

function MealCarbCounter() {

    function startApp() {
        window.location.href = "foodSearch.html";
    }

    function bakeryList() {
        console.log("clicked");
        window.location.href = "foodList.html";
    }



//Public functions
this.startApp = function() {
    startApp();
}

this.bakeryList = function() {
 bakeryList();
}

}

