//Execute in strict mode to avoid some common mistakes
"use strict";

var controller;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);

  controller = new MealCarbCounter();
}

function MealCarbCounter() {
  var BASE_GET_URL = "http://localhost:8080"; //Temporary test url

  //Start page redirects to list of items
  function startApp() {
    window.location.href = "foodSearch.html";
  }
  //Function to show items
  function showItems(item) {
    var itemsContainer = document.getElementById("btnContainer");
    var listItem = document.createElement("button");
    listItem.setAttribute("class", "foodListBtn");
    listItem.innerText += item;
    itemsContainer.appendChild(listItem);
    listItem.addEventListener("click", function () {
      let foodName = listItem.innerText;
      sessionStorage.setItem("foodTitle", foodName);
      window.location.href = "foodNutritionInfo.html";
    });
  }

  //Adding functionality to bring up a list of bakery items and display it on the page
  function bakeryList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(bakeryItems) {
      console.log("obtained items", bakeryItems);
      for (var i = 0; i < bakeryItems.bakeryItems.length; i++) {
        var itemName = bakeryItems["bakeryItems"][i]["foodItem"];
        var carbs = bakeryItems["bakeryItems"][i]["carbs"];
        var weight = bakeryItems["bakeryItems"][i]["weight"];
        var weightUnit = bakeryItems["bakeryItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (bakeryItems.message) {
          console.log(bakeryItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the bakery data TESTING MODE
    var url = BASE_GET_URL + "/bakery/bakeryItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", bakeryItems: {}, success: onSuccess });
  }
  //Adding functionality to display biscuit list on the page
  function biscuitList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(biscuitItems) {
      console.log("obtained items", biscuitItems);
      for (var i = 0; i < biscuitItems.biscuitItems.length; i++) {
        var itemName = biscuitItems["biscuitItems"][i]["foodItem"];
        var carbs = biscuitItems["biscuitItems"][i]["carbs"];
        var weight = biscuitItems["biscuitItems"][i]["weight"];
        var weightUnit = biscuitItems["biscuitItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (biscuitItems.message) {
          console.log(biscuitItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the biscuit data TESTING MODE
    var url = BASE_GET_URL + "/biscuits/biscuitItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", biscuitItems: {}, success: onSuccess });
  }

  //Adding functionality to display breakfast list
  function breakfastList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(breakfastItems) {
      console.log("obtained items", breakfastItems);
      for (var i = 0; i < breakfastItems.breakfastItems.length; i++) {
        var itemName = breakfastItems["breakfastItems"][i]["foodItem"];
        var carbs = breakfastItems["breakfastItems"][i]["carbs"];
        var weight = breakfastItems["breakfastItems"][i]["weight"];
        var weightUnit = breakfastItems["breakfastItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (breakfastItems.message) {
          console.log(breakfastItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the breakfast data TESTING MODE
    var url = BASE_GET_URL + "/breakfast/breakfastItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", breakfastItems: {}, success: onSuccess });
  }
  //Adding functionality to display drink list
  function drinkList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(drinkItems) {
      console.log("obtained items", drinkItems);
      for (var i = 0; i < drinkItems.drinkItems.length; i++) {
        var itemName = drinkItems["drinkItems"][i]["foodItem"];
        var carbs = drinkItems["drinkItems"][i]["carbs"];
        var weight = drinkItems["drinkItems"][i]["weight"];
        var weightUnit = drinkItems["drinkItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (drinkItems.message) {
          console.log(drinkItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the drinks data TESTING MODE
    var url = BASE_GET_URL + "/drinks/drinkItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", drinkItems: {}, success: onSuccess });
  }

  //Adding functionality to display fruit list
  function fruitList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(fruitItems) {
      console.log("obtained items", fruitItems);
      for (var i = 0; i < fruitItems.fruitItems.length; i++) {
        var itemName = fruitItems["fruitItems"][i]["foodItem"];
        var carbs = fruitItems["fruitItems"][i]["carbs"];
        var weight = fruitItems["fruitItems"][i]["weight"];
        var weightUnit = fruitItems["fruitItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (fruitItems.message) {
          console.log(fruitItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the fruit data TESTING MODE
    var url = BASE_GET_URL + "/fruit/fruitItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", fruitItems: {}, success: onSuccess });
  }

  //Adding functionality to display meat list
  function meatList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(meatItems) {
      console.log("obtained items", meatItems);
      for (var i = 0; i < meatItems.meatItems.length; i++) {
        var itemName = meatItems["meatItems"][i]["foodItem"];
        var carbs = meatItems["meatItems"][i]["carbs"];
        var weight = meatItems["meatItems"][i]["weight"];
        var weightUnit = meatItems["meatItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (meatItems.message) {
          console.log(meatItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the meat data TESTING MODE
    var url = BASE_GET_URL + "/meat/meatItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", meatItems: {}, success: onSuccess });
  }

  //Adding functionality to display pasta list
  function pastaList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(pastaItems) {
      console.log("obtained items", pastaItems);
      for (var i = 0; i < pastaItems.pastaItems.length; i++) {
        var itemName = pastaItems["pastaItems"][i]["foodItem"];
        var carbs = pastaItems["pastaItems"][i]["carbs"];
        var weight = pastaItems["pastaItems"][i]["weight"];
        var weightUnit = pastaItems["pastaItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (pastaItems.message) {
          console.log(pastaItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the pasta data TESTING MODE
    var url = BASE_GET_URL + "/pasta/pastaItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", pastaItems: {}, success: onSuccess });
  }

  //Adding functionality to display potato list
  function potatoList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(potatoItems) {
      console.log("obtained items", potatoItems);
      for (var i = 0; i < potatoItems.potatoItems.length; i++) {
        var itemName = potatoItems["potatoItems"][i]["foodItem"];
        var carbs = potatoItems["potatoItems"][i]["carbs"];
        var weight = potatoItems["potatoItems"][i]["weight"];
        var weightUnit = potatoItems["potatoItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (potatoItems.message) {
          console.log(potatoItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the potato data TESTING MODE
    var url = BASE_GET_URL + "/potatoes/potatoItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", potatoItems: {}, success: onSuccess });
  }

  //Adding functionality to display rice list
  function riceList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(riceItems) {
      console.log("obtained items", riceItems);
      for (var i = 0; i < riceItems.riceItems.length; i++) {
        var itemName = riceItems["riceItems"][i]["foodItem"];
        var carbs = riceItems["riceItems"][i]["carbs"];
        var weight = riceItems["riceItems"][i]["weight"];
        var weightUnit = riceItems["riceItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (riceItems.message) {
          console.log(riceItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the rice data TESTING MODE
    var url = BASE_GET_URL + "/rice/riceItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", riceItems: {}, success: onSuccess });
  }

  //Adding functionality to display soup list
  function soupList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(soupItems) {
      console.log("obtained items", soupItems);
      for (var i = 0; i < soupItems.soupItems.length; i++) {
        var itemName = soupItems["soupItems"][i]["foodItem"];
        var carbs = soupItems["soupItems"][i]["carbs"];
        var weight = soupItems["soupItems"][i]["weight"];
        var weightUnit = soupItems["soupItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (soupItems.message) {
          console.log(soupItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the soup data TESTING MODE
    var url = BASE_GET_URL + "/soups/soupItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", soupItems: {}, success: onSuccess });
  }

  //Adding functionality to display sauce list
  function sauceList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(sauceItems) {
      console.log("obtained items", sauceItems);
      for (var i = 0; i < sauceItems.sauceItems.length; i++) {
        var itemName = sauceItems["sauceItems"][i]["foodItem"];
        var carbs = sauceItems["sauceItems"][i]["carbs"];
        var weight = sauceItems["sauceItems"][i]["weight"];
        var weightUnit = sauceItems["sauceItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (sauceItems.message) {
          console.log(sauceItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the sauce data TESTING MODE
    var url = BASE_GET_URL + "/sauces/sauceItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", sauceItems: {}, success: onSuccess });
  }

  //Adding functionality to display veg list
  function vegList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(vegItems) {
      console.log("obtained items", vegItems);
      for (var i = 0; i < vegItems.vegItems.length; i++) {
        var itemName = vegItems["vegItems"][i]["foodItem"];
        var carbs = vegItems["vegItems"][i]["carbs"];
        var weight = vegItems["vegItems"][i]["weight"];
        var weightUnit = vegItems["vegItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (vegItems.message) {
          console.log(vegItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the veg data TESTING MODE
    var url = BASE_GET_URL + "/veg/vegItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", vegItems: {}, success: onSuccess });
  }

  //Adding functionality to display snack list
  function snackList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(snackItems) {
      console.log("obtained items", snackItems);
      for (var i = 0; i < snackItems.snackItems.length; i++) {
        var itemName = snackItems["snackItems"][i]["foodItem"];
        var carbs = snackItems["snackItems"][i]["carbs"];
        var weight = snackItems["snackItems"][i]["weight"];
        var weightUnit = snackItems["snackItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (snackItems.message) {
          console.log(snackItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the snack data TESTING MODE
    var url = BASE_GET_URL + "/snacks/snackItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", snackItems: {}, success: onSuccess });
  }

  //Adding functionality to display dessert list
  function dessertList() {
    var itemsArray = [];
    var foodArray = [];
    function onSuccess(dessertItems) {
      console.log("obtained items", dessertItems);
      for (var i = 0; i < dessertItems.dessertItems.length; i++) {
        var itemName = dessertItems["dessertItems"][i]["foodItem"];
        var carbs = dessertItems["dessertItems"][i]["carbs"];
        var weight = dessertItems["dessertItems"][i]["weight"];
        var weightUnit = dessertItems["dessertItems"][i]["weightUnit"];
        JSON.stringify(itemName);
        JSON.stringify(carbs);
        JSON.stringify(weight);
        JSON.stringify(weightUnit);
        itemsArray.push(itemName);
        foodArray.push({
          itemName: itemName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
        sessionStorage.setItem("foodNutrition", JSON.stringify(foodArray));
        if (dessertItems.message) {
          console.log(dessertItems.message);
        } else {
          alert("Unable to add items list");
        }
      }
      itemsArray.forEach(showItems);
    }
    //Sending GET for the dessert data TESTING MODE
    var url = BASE_GET_URL + "/dessert/dessertItems";
    console.log("getting data, sending get to " + url);
    $.ajax(url, { type: "GET", dessertItems: {}, success: onSuccess });
  }
  //Nutritional info
  function addFoodWeight() {
    let foodWeight = prompt(
      "How much does your food item weigh (in grams/mls)?",
      "100"
    );
    if (foodWeight == null || foodWeight == "") {
      alert("Please input weight");
      addFoodWeight();
    } else {
      let foodTitle = document.getElementById("foodtitle");
      foodTitle.innerText = sessionStorage.getItem("foodTitle");
      let weight = document.getElementById("weight");
      weight.innerText = foodWeight;
    }
  }

  //Total Carbs
  function carbsTotal() {
    let foodWeight = document.getElementById("weight").innerText;
    let foodTitle = sessionStorage.getItem("foodTitle");
    //Working out the carbs per input weight value of item
    let foodNutrition = JSON.parse(sessionStorage.getItem("foodNutrition"));
    let carbs = foodNutrition.find((x) => x.itemName === foodTitle).carbs;
    let weight = foodNutrition.find((x) => x.itemName === foodTitle).weight;
    let totalCarbs = (carbs / weight) * foodWeight;
    let total = document.getElementById("total");
    total.innerText = totalCarbs;
  }

  //Function to append values to local storage
  function appendValueToStorage(key, value) {
    var values = JSON.parse(sessionStorage.getItem(key));
    if (values === null) {
      values = [];
    }
    values.push(value);
    sessionStorage.setItem(key, JSON.stringify(values));
    console.log(sessionStorage.getItem(key));
  }
  //Function to append values to session storage
  function appendValueTosessionStorage(key, value) {
    var values = JSON.parse(sessionStorage.getItem(key));
    if (values === null) {
      values = [];
    }
    values.push(value);
    sessionStorage.setItem(key, JSON.stringify(values));
    console.log(sessionStorage.getItem(key));
  }

  //Add to Meal List
  function addToMealList() {
    let foodTitle = document.getElementById("foodtitle").innerText;
    let weight = document.getElementById("weight").innerText;
    let total = document.getElementById("total").innerText;
    JSON.stringify(foodTitle);
    JSON.stringify(weight);
    JSON.stringify(total);
    let mealList = {
      foodTitle: foodTitle,
      weight: weight,
      total: total,
    };
    appendValueToStorage("meals", mealList);
  }

  //Add all meals and work out total carbs
  function addAllMeals() {
    let meals = JSON.parse(sessionStorage.getItem("meals"));
    let totalArray = [];
    let itemsContainer = document.getElementById("listOfMeals");
    for (let i = 0; i < meals.length; i++) {
      let mealName = meals[i]["foodTitle"];
      let weight = meals[i]["weight"];
      let total = meals[i]["total"];
      totalArray.push(parseFloat(total));
      let listItemMealName = document.createElement("li");
      listItemMealName.setAttribute("class", "itemList");
      let listItemWeightText = document.createElement("span");
      listItemWeightText.setAttribute("class", "weight");
      let listItemWeight = document.createElement("span");
      listItemWeight.setAttribute("class", "weight");
      let listItemTotalText = document.createElement("span");
      listItemTotalText.setAttribute("class", "total");
      let listItemTotal = document.createElement("span");
      listItemTotal.setAttribute("class", "total");

      listItemMealName.innerText = mealName;
      itemsContainer.appendChild(listItemMealName);
      listItemWeightText.innerText = ", Weight: ";
      listItemMealName.appendChild(listItemWeightText);
      listItemWeight.innerText = weight;
      listItemWeightText.appendChild(listItemWeight);
      listItemTotalText.innerText = ", Carbs = ";
      listItemWeight.appendChild(listItemTotalText);
      listItemTotal.innerText = total;
      listItemTotalText.appendChild(listItemTotal);
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalCarbs = totalArray.reduce(reducer);
    let roundedTotal = Math.round(totalCarbs * 10) / 10;
    let displayRoundedTotal = document.getElementById("totalCarbs");
    displayRoundedTotal.innerText =
      "Total carbs for this meal = " + roundedTotal;
    sessionStorage.setItem("totalCarbs", JSON.stringify(roundedTotal));
  }

  //Public functions
  this.startApp = function () {
    startApp();
  };
  //To display the food lists:
  this.bakeryList = function () {
    window.location.href = "bakeryList.html";
  };
  this.bakeryItems = function () {
    bakeryList();
  };
  this.back = function () {
    window.location.href = "foodSearch.html";
  };
  this.biscuitList = function () {
    window.location.href = "biscuitList.html";
  };
  this.biscuitItems = function () {
    biscuitList();
  };
  this.breakfastList = function () {
    window.location.href = "breakfastList.html";
  };
  this.breakfastItems = function () {
    breakfastList();
  };
  this.drinkList = function () {
    window.location.href = "drinkList.html";
  };
  this.drinkItems = function () {
    drinkList();
  };
  this.fruitList = function () {
    window.location.href = "fruitList.html";
  };
  this.fruitItems = function () {
    fruitList();
  };
  this.meatList = function () {
    window.location.href = "meatList.html";
  };
  this.meatItems = function () {
    meatList();
  };
  this.pastaList = function () {
    window.location.href = "pastaList.html";
  };
  this.pastaItems = function () {
    pastaList();
  };
  this.potatoList = function () {
    window.location.href = "potatoList.html";
  };
  this.potatoItems = function () {
    potatoList();
  };
  this.riceList = function () {
    window.location.href = "riceList.html";
  };
  this.riceItems = function () {
    riceList();
  };
  this.soupList = function () {
    window.location.href = "soupList.html";
  };
  this.soupItems = function () {
    soupList();
  };
  this.sauceList = function () {
    window.location.href = "sauceList.html";
  };
  this.sauceItems = function () {
    sauceList();
  };
  this.vegList = function () {
    window.location.href = "vegList.html";
  };
  this.vegItems = function () {
    vegList();
  };
  this.snackList = function () {
    window.location.href = "snackList.html";
  };
  this.snackItems = function () {
    snackList();
  };
  this.dessertList = function () {
    window.location.href = "dessertList.html";
  };
  this.dessertItems = function () {
    dessertList();
  };
  this.foodNutrition = function () {
    addFoodWeight();
  };
  this.totalCarbs = function () {
    carbsTotal();
  };
  this.addToMeal = function () {
    addToMealList();
  };
  this.mealPage = function () {
    window.location.href = "mealPage.html";
  };
  this.addMeals = function () {
    addAllMeals();
  };

  this.diary = function () {
    window.location.href = "diaryPage.html";
  };
}
