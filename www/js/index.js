//Execute in strict mode to avoid some common mistakes

"use strict";

var controller;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);

  controller = new MealCarbCounter();
}

function MealCarbCounter() {
  var BASE_GET_URL = "http://localhost:8080/api/v1/foods?foodCategory=";
  // var BASE_GET_URL = "https://mealcarbcounter.com/api/v1/foods?foodCategory=";

  //Getting the foods from the API and saving the information to an array
  const foodArray = []; //Array includes foodName, carbs, weight, weightUnit

  //Function to show foodItems
  function showItems(item) {
    //Removing previous view items
    $(".foodCat").remove();
    //Creating new view to display the items received from the API
    var itemsContainer = document.getElementById("btnContainer");
    var listItem = document.createElement("button");
    listItem.setAttribute("class", "foodListBtn");
    listItem.innerText += item;
    itemsContainer.appendChild(listItem);

    //Getting the carbohydrate values
    listItem.addEventListener("click", function () {
      let foodName = listItem.innerText;
      getFoodWeight(foodName);
    });
  }

  function getFoodItems(foodCategory) {
    const itemsArray = []; //Array includes foodNames
    //Only executes if the API returns the information
    function onSuccess(foodItems) {
      console.log("obtained items", foodItems);
      for (var i = 0; i < foodItems.data.length; i++) {
        var foodName = foodItems["data"][i]["foodName"];
        var carbs = foodItems["data"][i]["carbohydrates"];
        var weight = foodItems["data"][i]["weight"];
        var weightUnit = foodItems["data"][i]["weightUnit"];
        //Saving the information to the arrays
        itemsArray.push(foodName);
        foodArray.push({
          foodName: foodName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
      }
      itemsArray.forEach(showItems);
    }
    //Executes if there is a problem with getting information from the API
    function onError(foodItems) {
      try {
        throw new Error("Unable to retrieve data");
      } catch (e) {
        console.error(e.name + ": " + e.message);
      }
    }
    //Sending GET to the API for the food data
    var url = BASE_GET_URL + foodCategory;
    console.log("getting data, sending get to " + url);
    $.ajax(url, {
      type: "GET",
      foodItems: {},
      success: onSuccess,
      error: onError,
    });
  }

  //Creates the display with items and weight user has selected
  function displayFoodWeight(foodName, weightUnit, weight) {
    //Removing the elements from the previous view
    $(".foodListBtn").remove();
    $("#search").remove();
    var itemsContainer = document.getElementById("btnContainer");
    //Creating the dynamic card view display
    var card = document.createElement("div");
    card.classList = "card-body";
    const content = `
    <div class="card">
    <img src="/www/img/emote3.png" alt="An emoticon with thumbs up" id="emote">
    <hr>
    <div class="container">
    <h1 id="foodTitle"></h1>
    <h2 id="foodWeight"></h2>
    <button id="totalCarbs">Total Carbs</button>
    <h2 id="totalCarbVal">Total Carbs = <span id="total"></span></h2>
    </div>
    </div>
    `;
    itemsContainer.innerHTML = content;
    //Adding the content to the html elements
    let foodTitle = document.getElementById("foodTitle");
    foodTitle.innerText = foodName;
    let foodWeight = document.getElementById("foodWeight");
    foodWeight.innerText = "Weight = " + weight + " " + weightUnit;
    //Creating new buttons for this view
    var backButton = document.createElement("button");
    var addToMeal = document.createElement("button");
    var goToMeal = document.createElement("button");
    backButton.setAttribute("id", "backButton");
    addToMeal.setAttribute("id", "addToMeal");
    goToMeal.setAttribute("id", "goToMeal");
    backButton.innerText = "Back";
    addToMeal.innerText = "Add To Meal";
    goToMeal.innerText = "Go To Meal";
    itemsContainer.appendChild(backButton);
    itemsContainer.appendChild(addToMeal);
    itemsContainer.appendChild(goToMeal);
    //Click event listener to go back to the previous view
    let back = document.getElementById("backButton");
    back.addEventListener("click", function () {
      window.location.reload();
    });
    //Click event listener to display the total carbs for the food
    let displayTotalCarbs = document.getElementById("totalCarbs");
    displayTotalCarbs.addEventListener("click", function () {
      carbsTotal(foodName, weight);
    });
    //Adding onclick event listener to the button to go to meals
    let goToMealList = document.getElementById("goToMeal");
    goToMealList.addEventListener("click", function () {
      displayMealList();
    });
  }

  //Getting input for weight from the user
  function getFoodWeight(foodName) {
    let foodWeight = prompt(
      "How much does your food weigh (in grams/mls)?",
      "100"
    );
    //Checking the input text for numbers only
    if (/^[0-9.,]+$/.test(foodWeight)) {
      //Find the weight unit in the array for the selected name
      for (var i = 0; i < foodArray.length; i++) {
        if (foodArray[i].foodName === foodName) {
          let foodName = foodArray[i].foodName;
          let weightUnit = foodArray[i].weightUnit;
          let weight = foodWeight;
          displayFoodWeight(foodName, weightUnit, weight);
        }
      }
    } else {
      alert("Please input weight");
    }
  }

  //Total Carbs for the food per input weight
  function carbsTotal(foodName, weight) {
    let carbs = 0;
    // Working out the carbs per input weight value of item
    for (var i = 0; i < foodArray.length; i++) {
      if (foodArray[i].foodName === foodName) {
        carbs = foodArray[i].carbs;
        const originalWeight = foodArray[i].weight;
        const totalCarbs =
          (parseFloat(carbs) / parseFloat(originalWeight)) * parseFloat(weight);
        let total = document.getElementById("total");
        total.innerText = totalCarbs;
        // Click event listener for adding the food item to a meal
        let addToMeal = document.getElementById("addToMeal");
        //Adding the item to the meal list
        addToMeal.addEventListener("click", function () {
          addToMealList(foodName, weight, totalCarbs);
        });
      }
    }
  }

  var storage = window.localStorage;
  //Function to append values to local storage
  function appendValueToStorage(key, value) {
    var values = JSON.parse(storage.getItem(key));
    if (values === null) {
      values = [];
    }
    values.push(value);
    storage.setItem(key, JSON.stringify(values));
  }

  function addToMealList(foodName, weight, totalCarbs) {
    let mealList = {
      foodName: foodName,
      weight: weight,
      totalCarbs: totalCarbs,
    };
    //Push meals to local storage
    appendValueToStorage("mealList", mealList);
    alert("Item added");
  }

  //Add all meals and work out total carbs
  function displayMealList() {
    //Removing the previous view
    $(".card").remove();
    $("#addToMeal").remove();
    $("#goToMeal").remove();
    var container = document.getElementById("btnContainer");
    //Adding a button to add meal to the diary
    var addToDiary = document.createElement("button");
    addToDiary.setAttribute("id", "addToDiary");
    addToDiary.innerText = "Add To Diary";
    container.appendChild(addToDiary);
    /*Wrapped in if..else block to check if content exists and change 
    display accordingly*/
    //Creating a table display for meals
    let mealList = JSON.parse(storage.getItem("mealList"));
    if (mealList.length === 0) {
      let h1 = document.createElement("h1");
      h1.setAttribute("id", "mealListEmptyHeading");
      h1.innerText =
        "There is nothing here at present! \nPlease add a food and click the 'Add To Meal Button!";
    } else {
      var table = document.createElement("table");
      container.appendChild(table);
      //Table header
      var thead = document.createElement("thead");
      var tr1 = document.createElement("tr");
      //Table body
      var tbody = document.createElement("tbody");
      //Table footer
      var tfoot = document.createElement("tfoot");
      var trLast = document.createElement("tr");
      //Adding table headings to the header
      table.appendChild(thead);
      thead.appendChild(tr1);
      var th1 = document.createElement("th");
      th1.innerText = "Food";
      var th2 = document.createElement("th");
      th2.innerText = "Weight";
      var th3 = document.createElement("th");
      th3.innerText = "Carbs";
      var th4 = document.createElement("th");
      th4.innerText = "Delete";
      tr1.appendChild(th1);
      tr1.appendChild(th2);
      tr1.appendChild(th3);
      tr1.appendChild(th4);
      //Adding body of table
      table.appendChild(tbody);
      //Getting specific items from the meal list
      for (let i = 0; i < mealList.length; i++) {
        let foodNames = mealList[i]["foodName"];
        let weight = mealList[i]["weight"];
        let carbs = mealList[i]["totalCarbs"];
        /*Adding meal list items to the table body with delete option 
      for both the list and the local storage*/
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.setAttribute("class", "foodName");
        td1.innerText = foodNames;
        var td2 = document.createElement("td");
        td2.innerText = weight;
        var td3 = document.createElement("td");
        td3.innerText = carbs;
        var td4 = document.createElement("td");
        var deleteFood = document.createElement("button");
        deleteFood.setAttribute("type", "button");
        deleteFood.setAttribute("onclick", "controller.foodDelete(this)");
        deleteFood.innerText = "X";
        td4.appendChild(deleteFood);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);
      }
      //Appending footer to the table
      table.appendChild(tfoot);
      tfoot.appendChild(trLast);
      var tdFooter = document.createElement("td");
      tdFooter.setAttribute("colspan", "4");
      //Creating a total button
      var totalMealCarbs = document.createElement("button");
      totalMealCarbs.setAttribute("type", "button");
      totalMealCarbs.setAttribute("id", "totalMealCarbs");
      totalMealCarbs.setAttribute("onclick", "controller.totalMealCarbs()");
      totalMealCarbs.innerText = "Total carbs for this meal";
      trLast.appendChild(tdFooter);
      tdFooter.appendChild(totalMealCarbs);
    }
  }

  this.totalMealCarbs = function () {
    let arrayOfCarbs = [];
    const storedArray = JSON.parse(storage.getItem("mealList"));
    for (let i = 0; i < storedArray.length; i++) {
      arrayOfCarbs.push(storedArray[i].totalCarbs);
      console.log(arrayOfCarbs);
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalCarbs = arrayOfCarbs.reduce(reducer);
    let roundedTotal = Math.round(totalCarbs * 10) / 10;
    //Adding total carbs for the meal to the display
    var container = document.getElementById("btnContainer");
    var carbTotalDisplay = document.createElement("h3");
    carbTotalDisplay.innerText = "Total Carbs =" + "\n" + roundedTotal;
    container.appendChild(carbTotalDisplay);
  };

  //Function to delete meals from the list and local storage
  this.foodDelete = function (ctl) {
    let getFoodName = $(ctl).parents("tr").find(".foodName").text();
    const storedArray = JSON.parse(storage.getItem("mealList"));
    if (storedArray === null) {
      console.log("No meals have been added yet!");
    }
    for (let i = 0; i < storedArray.length; i++) {
      if (storedArray[i].foodName === getFoodName) {
        storedArray.splice(i, 1);
      }
    }
    $(ctl).parents("tr").remove();
    let carbTotalDisplay = document.getElementsByTagName("h3");
    carbTotalDisplay = "";
    storage.setItem("mealList", JSON.stringify(storedArray));
  };

  //Public functions

  //To display the food list that corresponds to the value of the item clicked:
  this.foodList = function (val) {
    let foodCategory = val;
    getFoodItems(foodCategory);
  };
}
