//Execute in strict mode to avoid some common mistakes

"use strict";

let controller;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);

  controller = new MealCarbCounter();
}

function MealCarbCounter() {
  //Dev testing
  // let BASE_GET_URL = "http://localhost:8080/api/v1/foods?foodCategory=";
  //Live testing - on phone
  let BASE_GET_URL = "https://mealcarbcounter.com/api/v1/foods?foodCategory=";

  //Getting the foods from the API and saving the information to an array
  const foodArray = []; //Array includes foodName, carbs, weight, weightUnit
  function getFoodItems(foodCategory) {
    const itemsArray = []; //Array includes foodNames
    //Only executes if the API returns the information
    function onSuccess(foodItems) {
      console.log("obtained items", foodItems);
      for (let i = 0; i < foodItems.data.length; i++) {
        let foodName = foodItems["data"][i]["foodName"];
        let carbs = foodItems["data"][i]["carbohydrates"];
        let weight = foodItems["data"][i]["weight"];
        let weightUnit = foodItems["data"][i]["weightUnit"];
        //Saving the information to the arrays
        itemsArray.push(foodName);
        foodArray.push({
          foodName: foodName,
          carbs: carbs,
          weight: weight,
          weightUnit: weightUnit,
        });
      }
      //Adding a back button
      let diarySection = document.getElementById("diarySection");
      let backBtn = document.createElement("button");
      backBtn.setAttribute("id", "backButton");
      backBtn.setAttribute("onclick", "controller.back()");
      backBtn.innerText = "Back";
      diarySection.appendChild(backBtn);
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
    let url = BASE_GET_URL + foodCategory;
    console.log("getting data, sending get to " + url);
    $.ajax(url, {
      type: "GET",
      foodItems: {},
      success: onSuccess,
      error: onError,
    });
  }

  //Function to show foodItems received from the API
  function showItems(item) {
    //Removing previous view items
    $(".foodCat").remove();
    //Creating new view to display the items received from the API
    let itemsContainer = document.getElementById("btnContainer");
    let listItem = document.createElement("button");
    listItem.setAttribute("class", "foodListBtn");
    listItem.innerText += item;
    itemsContainer.appendChild(listItem);
    //Getting the carbohydrate values
    listItem.addEventListener("click", function () {
      let foodName = listItem.innerText;
      getFoodWeight(foodName);
    });
  }

  //Function to get user input for food weight
  function getFoodWeight(foodName) {
    let foodWeight = prompt(
      "How much does your food weigh (in grams/mls)?",
      "50"
    );
    //Making sure input is not blank
    if (foodWeight === "") {
      alert("Weight cannot be blank. Please enter a number.");
      return;
    }
    //Checking the input text for numbers only
    else if (foodWeight) {
      if (/^\d+$/.test(foodWeight)) {
        //Foodweight is only numbers
        for (let i = 0; i < foodArray.length; i++) {
          if (foodArray[i].foodName === foodName) {
            let foodName = foodArray[i].foodName;
            let weightUnit = foodArray[i].weightUnit;
            let weight = foodWeight;
            displayFoodWeight(foodName, weightUnit, weight);
          }
        }
      } else if (!/^[0-9.,]+$/.test(foodWeight)) {
        //Foodweight is not just numbers
        alert("Weight must be a number only");
        return;
      }
    } else {
      //User cancelled prompt
      return;
    }
  }

  //Function to insert elements before existing elements
  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  //Creates the display with items and weight user has selected
  function displayFoodWeight(foodName, weightUnit, weight) {
    //Removing the elements from the previous view
    $("#btnContainer").remove();
    $(".search").remove();
    let itemsContainer = document.getElementById("diarySection");
    //Adds a container for the back and add to meal buttons
    let btnCont1 = document.createElement("section");
    btnCont1.setAttribute("class", "btnCont1");
    btnCont1.setAttribute("id", "btnCont1");
    insertAfter(itemsContainer, btnCont1);
    //Creates the addToMeal elements
    let addToMeal = document.createElement("button");
    addToMeal.setAttribute("id", "addToMeal");
    addToMeal.innerText = "Add To Meal";
    //Adds the buttonto a container
    btnCont1.appendChild(addToMeal);
    //Creating the dynamic card view display
    let card = document.createElement("div");
    card.classList = "card-body";
    const content = `
    <div class="card">
    <img src="./img/emote3.png" alt="An emoticon with thumbs up" id="emote">
    <hr>
    <div class="container">
    <h1 id="foodTitle"></h1>
    <h2 id="foodWeight"></h2>
    <button id="totalCarbs">Total Carbs - Click me!</button>
    <h2 id="totalCarbVal">Total Carbs = <span id="total"></span></h2>
    </div>
    </div>
    `;
    //Inserts the card after the top buttons
    insertAfter(btnCont1, card);
    card.innerHTML = content;
    //Adding the content to the html elements
    let foodTitle = document.getElementById("foodTitle");
    foodTitle.innerText = foodName;
    let foodWeight = document.getElementById("foodWeight");
    foodWeight.innerText = "Weight = " + weight + " " + weightUnit;
    //Creating a container for the go to meal button
    let btnCont2 = document.createElement("section");
    btnCont2.setAttribute("class", "btnCont2");
    btnCont2.setAttribute("id", "btnCont2");
    //Creating new button to go to meal
    let goToMeal = document.createElement("button");
    goToMeal.setAttribute("id", "goToMeal");
    goToMeal.innerText = "Go To Meal";
    //Appending btnCont2 after the card element
    insertAfter(card, btnCont2);
    btnCont2.appendChild(goToMeal);
    //Click event listener to display the total carbs for the food
    let displayTotalCarbs = document.getElementById("totalCarbs");
    displayTotalCarbs.addEventListener("click", function () {
      //Prevent multiple clicks
      $(displayTotalCarbs).prop("disabled", true);
      carbsTotal(foodName, weight, weightUnit);
    });
    //Adding onclick event listener to the button to go to meals
    let goToMealList = document.getElementById("goToMeal");
    goToMealList.addEventListener("click", function () {
      displayMealList();
    });
    //Adding the item to the meal list
    addToMeal.addEventListener("click", function () {
      let checkCarbs = document.getElementById("total");
      if (checkCarbs.innerText === "") {
        alert("Please click the 'Total carbs - Click me!' button before the 'Add To Meal' button");
      } else {
      //Prevent repetitive clicking which adds repeating items to the meal table
      let totalCarbs = checkCarbs.innerText;
      $(addToMeal).prop("disabled", true);
      addToMealList(foodName, weight, totalCarbs, weightUnit);
      }
    });
  }

  //Total Carbs for the food per input weight
  function carbsTotal(foodName, weight, weightUnit) {
    let carbs = 0;
    // Working out the carbs per input weight value of item
    for (let i = 0; i < foodArray.length; i++) {
      if (foodArray[i].foodName === foodName) {
        carbs = foodArray[i].carbs;
        const originalWeight = foodArray[i].weight;
        const totalCarbs =
          (parseFloat(carbs) / parseFloat(originalWeight)) * parseFloat(weight);
        let total = document.getElementById("total");
        total.innerText = totalCarbs;
      }
    }
  }

  let storage = window.localStorage;
  //Function to append values to local storage
  function appendValueToStorage(key, value) {
    let values = JSON.parse(storage.getItem(key));
    if (values === null) {
      values = [];
    }
    values.push(value);
    storage.setItem(key, JSON.stringify(values));
  }

  //Function to save the mealist to local storage
  function addToMealList(foodName, weight, totalCarbs, weightUnit) {
    let mealList = {
      foodName: foodName,
      weight: weight,
      totalCarbs: totalCarbs,
      weightUnit: weightUnit,
    };
    //Push meals to local storage
    appendValueToStorage("mealList", mealList);
    alert("Item added");
  }

  //Add all meals and work out total carbs
  function displayMealList() {
    //Removing the previous view
    $(".card-body").remove();
    $("#addToMeal").remove();
    $("#btnCont1").remove();
    $("#btnCont2").remove();
    let container = document.getElementById("diarySection");
    //Adding a button to add meal to the diary
    let addToDiary = document.createElement("button");
    addToDiary.setAttribute("id", "addToDiary");
    addToDiary.setAttribute("onclick", "controller.addToDiary()");
    addToDiary.innerText = "Add To Diary";
    container.appendChild(addToDiary);
    /*Wrapped in try..catch block to catch any type-errors*/
    //Creating a table display for meals
    let mealList = JSON.parse(storage.getItem("mealList"));
    //checking meal list is not empty
    if (mealList) {
      let table = document.createElement("table");
      table.setAttribute("id", "foodListTable");
      insertAfter(container, table);
      //Table header
      let thead = document.createElement("thead");
      let tr1 = document.createElement("tr");
      //Table body
      let tbody = document.createElement("tbody");
      //Table footer
      let tfoot = document.createElement("tfoot");
      let trLast = document.createElement("tr");
      //Adding table headings to the header
      table.appendChild(thead);
      thead.appendChild(tr1);
      let th1 = document.createElement("th");
      th1.innerText = "Food";
      let th2 = document.createElement("th");
      th2.innerText = "Weight";
      let th3 = document.createElement("th");
      th3.innerText = "Carbs";
      let th4 = document.createElement("th");
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
        let weightUnit = mealList[i]["weightUnit"];
        let carbs = mealList[i]["totalCarbs"];
        /*Adding meal list items to the table body with delete option 
          for both the list and the local storage*/
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.setAttribute("class", "foodName");
        td1.innerText = foodNames;
        let td2 = document.createElement("td");
        td2.innerText = weight + " " + weightUnit;
        let td3 = document.createElement("td");
        td3.innerText = carbs;
        let td4 = document.createElement("td");
        let deleteFood = document.createElement("button");
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
      let tdFooter = document.createElement("td");
      tdFooter.setAttribute("colspan", "4");
      //Creating a total button
      let totalMealCarbs = document.createElement("button");
      totalMealCarbs.setAttribute("type", "button");
      totalMealCarbs.setAttribute("id", "totalMealCarbs");
      totalMealCarbs.setAttribute("onclick", "controller.totalMealCarbs()");
      totalMealCarbs.innerText = "Total carbs for this meal";
      trLast.appendChild(tdFooter);
      tdFooter.appendChild(totalMealCarbs);
    } else {
      /*Creating the display in the event that no items have been 
      added to the meal list yet*/
      $("#addToDiary").remove();
      let container = document.getElementById("diarySection");
      let noItemsCont = document.createElement("div");
      noItemsCont.setAttribute("id", "noMealListCont");
      insertAfter(container, noItemsCont);
      let h2 = document.createElement("h2");
      h2.setAttribute("id", "mealListEmptyHeading");
      h2.innerText = "Nothing to see here!";
      noItemsCont.appendChild(h2);
      let h3 = document.createElement("h3");
      h3.setAttribute("id", "mealListEmptyHeading2");
      h3.innerText =
        "To add a meal, press 'Back', select your food and press 'Add To Meal'! \nIn the meantime, here's a little cupcake.";
      h2.appendChild(h3);
      let cupcakeImage = document.createElement("img");
      cupcakeImage.setAttribute("src", "./img/cupcake3.png");
      cupcakeImage.setAttribute("alt", "A cupcake");
      cupcakeImage.setAttribute("id", "cupcake");
      h3.appendChild(cupcakeImage);
    }
  }

  //Function to total up the meal carbs from the food items added to the table
  this.totalMealCarbs = function () {
    //Prevent multiple clicks
    $(totalMealCarbs).prop("disabled", true);
    let arrayOfCarbs = [];
    const storedArray = JSON.parse(storage.getItem("mealList"));
    for (let i = 0; i < storedArray.length; i++) {
      arrayOfCarbs.push(parseFloat(storedArray[i].totalCarbs));
      console.log(arrayOfCarbs)
    }
    /*Error handling for if user deletes all items from the table 
    and then attempts to total the carbs*/
    try {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let totalCarbs = arrayOfCarbs.reduce(reducer);
      let roundedTotal = Math.round(totalCarbs * 10) / 10;
      //Adding total carbs for the meal to the display
      let tableContainer = document.getElementById("foodListTable");
      let totalContainer = document.createElement("section");
      totalContainer.setAttribute("id", "totalContainer");
      insertAfter(tableContainer, totalContainer);
      let carbTotalDisplay = document.createElement("h3");
      carbTotalDisplay.setAttribute("id", "carbTotalDisplay");
      carbTotalDisplay.innerText = "Total Carbs =" + "\n" + roundedTotal;
      totalContainer.appendChild(carbTotalDisplay);
      return roundedTotal;
    } catch (e) {
      alert(
        "No items have been added to the meal, please press back and add some foods! " +
          "(" +
          e.message +
          ")"
      );
    }
  };

  //Function to delete meals from the list and local storage
  this.foodDelete = function (ctl) {
    let getFoodName = $(ctl).parents("tr").find(".foodName").text();
    const storedArray = JSON.parse(storage.getItem("mealList"));
    let index = storedArray.findIndex(
      (storedArray) => storedArray.foodName === getFoodName
    );
    storedArray.splice(index, 1);
    $(ctl).parents("tr").remove();
    let carbTotalDisplay = document.getElementById("carbTotalDisplay");
    if (carbTotalDisplay != null) {
      carbTotalDisplay.remove();
    }
    storage.setItem("mealList", JSON.stringify(storedArray));
    $(totalMealCarbs).prop("disabled", false);
  };

  //Function to create the display of buttons in order to add meals to the diary
  function addToDiary() {
    //Getting the local Storage items
    const diaryArray = JSON.parse(storage.getItem("mealList"));
    if (diaryArray.length == 0) {
      alert(
        "There are no foods here to add to the diary, please go back and add some foods!"
      );
      return;
    } else {
      //Removing the previous table view
      $("#foodListTable").remove();
      //Setting up the button container
      let diaryCont = document.getElementById("diarySection");
      let mealBtnCont = document.createElement("section");
      mealBtnCont.setAttribute("id", "mealBtnCont");
      insertAfter(diaryCont, mealBtnCont);
      //Creating buttons to select which meal (lunch/dinner etc)
      let selectMealName = document.createElement("h2");
      selectMealName.setAttribute("id", "selectMealName");
      selectMealName.innerText = "Which meal is this?";
      mealBtnCont.appendChild(selectMealName);
      let breakfastBtn = document.createElement("button");
      breakfastBtn.setAttribute("id", "breakfastBtn");
      breakfastBtn.setAttribute("value", "Breakfast");
      breakfastBtn.setAttribute(
        "onclick",
        "controller.diaryAdditions(this.value)"
      );
      breakfastBtn.innerText = "Breakfast";
      mealBtnCont.appendChild(breakfastBtn);
      let lunchBtn = document.createElement("button");
      lunchBtn.setAttribute("id", "lunchBtn");
      lunchBtn.innerText = "Lunch";
      lunchBtn.setAttribute("value", "Lunch");
      lunchBtn.setAttribute("onclick", "controller.diaryAdditions(this.value)");
      mealBtnCont.appendChild(lunchBtn);
      let dinnerBtn = document.createElement("button");
      dinnerBtn.setAttribute("id", "dinnerBtn");
      dinnerBtn.innerText = "Dinner";
      dinnerBtn.setAttribute("value", "Dinner");
      dinnerBtn.setAttribute(
        "onclick",
        "controller.diaryAdditions(this.value)"
      );
      mealBtnCont.appendChild(dinnerBtn);
      let teaBtn = document.createElement("button");
      teaBtn.setAttribute("id", "teaBtn");
      teaBtn.innerText = "Tea";
      teaBtn.setAttribute("value", "Tea");
      teaBtn.setAttribute("onclick", "controller.diaryAdditions(this.value)");
      mealBtnCont.appendChild(teaBtn);
      let snackBtn = document.createElement("button");
      snackBtn.setAttribute("id", "snackBtn");
      snackBtn.innerText = "Snack";
      snackBtn.setAttribute("value", "Snack");
      snackBtn.setAttribute("onclick", "controller.diaryAdditions(this.value)");
      mealBtnCont.appendChild(snackBtn);
      //Added at daughters request (she's in the target audience range!)
      let gamerSnackBtn = document.createElement("button");
      gamerSnackBtn.setAttribute("id", "gamerSnackBtn");
      gamerSnackBtn.innerText = "Gamer Snack";
      gamerSnackBtn.setAttribute("value", "Gamer Snack");
      gamerSnackBtn.setAttribute(
        "onclick",
        "controller.diaryAdditions(this.value)"
      );
      mealBtnCont.appendChild(gamerSnackBtn);
    }
  }

  //Creating a display to show the user the items that they have chosen to add to the diary
  function displayDiaryAdditions(diaryMeal) {
    //Removing the previous view buttons
    $("#mealBtnCont").remove();
    //Creating the new view
    let carbTotalDisplay = document.getElementById("carbTotalDisplay");
    let diaryAdditionHeading = document.createElement("h1");
    diaryAdditionHeading.setAttribute("id", "diaryAdditionHeading");
    diaryAdditionHeading.innerText = "Your meal has been added to your diary!";
    // Inserting the title before the carbs total display
    carbTotalDisplay.parentNode.insertBefore(
      diaryAdditionHeading,
      carbTotalDisplay
    );
    //Inserting the image after the title
    let boomImage = document.createElement("img");
    boomImage.setAttribute("src", "./img/boomresized.png");
    boomImage.setAttribute("alt", "Boom, You nailed it!");
    boomImage.setAttribute("id", "boom");
    diaryAdditionHeading.appendChild(boomImage);
    //Displaying the foodName that has been added
    let diaryAdditionMealName = document.createElement("h2");
    diaryAdditionMealName.setAttribute("id", "diaryAdditionMealName");
    diaryAdditionMealName.innerText = "'" + diaryMeal + "'";
    //inserting the mealname after the title
    carbTotalDisplay.parentNode.insertBefore(
      diaryAdditionMealName,
      carbTotalDisplay
    );
    saveDiary(diaryMeal);
  }

  //Function to save the diary information to the local storage and delete mealList local storage
  function saveDiary(diaryMeal) {
    let mealList = JSON.parse(storage.getItem("mealList"));
    let diary = JSON.parse(storage.getItem("diaryList"));
    let totalMealCarbs = document.getElementById("carbTotalDisplay").innerText;
    //Setting up the date for display
    let date = new Date();
    let year = date.getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let time = date.toLocaleTimeString("en-GB");
    date = day + " " + month + " " + year + " " + time;
    console.log(date);
    let diaryItems = [];
    //Extracting the number from the text
    totalMealCarbs = totalMealCarbs.match(/[+-]?\d+(\.\d+)?/g);
    totalMealCarbs = totalMealCarbs[0];
    for (let i = 0; i < mealList.length; i++) {
      let foodName = mealList[i].foodName;
      let weight = mealList[i].weight;
      let totalCarbs = mealList[i].totalCarbs;
      let weightUnit = mealList[i].weightUnit;
      diaryItems.push({
        foodName: foodName,
        weight: weight,
        totalCarbs: totalCarbs,
        weightUnit: weightUnit,
      });
    }
    diaryItems.unshift({
      date: date,
      diaryMeal: diaryMeal,
      totalMealCarbs: totalMealCarbs,
    });
    appendValueToStorage("diary", diaryItems);
    localStorage.removeItem("mealList");
  }

  //Creating the diary display
  function diary() {
    //Removing previous view items from each view you can access the diary from
    $("#addToDiary").remove();
    $("#totalContainer").remove();
    $(".search").remove();
    $(".diarySection").remove();
    $("#btnContainer").remove();
    $(".btnCont1").remove();
    $(".card-body").remove();
    $(".btnCont2").remove();
    $("#foodListTable").remove();
    $("#noMealListCont").remove();
    $("#mealBtnCont").remove();
    //Adding buttons for the diary view
    let homeBtn = document.createElement("button");
    homeBtn.setAttribute("id", "homeBtn");
    homeBtn.innerText = "Home";
    let homeBtnCont = document.createElement("div");
    homeBtnCont.setAttribute("class", "homeBtnCont");
    homeBtnCont.setAttribute("id", "homeBtnCont");
    document.body.appendChild(homeBtnCont);
    homeBtnCont.appendChild(homeBtn);
    homeBtn.addEventListener("click", function () {
      window.location.reload();
    });
    //Setting up the container for the diary list items
    let container = document.createElement("div");
    container.setAttribute("id", "diaryContainer");
    insertAfter(homeBtnCont, container);
    //Getting the data for the diary view
    let diaryArray = JSON.parse(storage.getItem("diary"));
    console.log(diaryArray);
    for (let i = 0; i < diaryArray.length; i++) {
      let date = diaryArray[i][0]["date"];
      let diaryMeal = diaryArray[i][0]["diaryMeal"];
      let totalMealCarbs = diaryArray[i][0]["totalMealCarbs"];
      let diaryTitleItems = document.createElement("h3");
      diaryTitleItems.setAttribute("class", "diaryTitles");
      container.appendChild(diaryTitleItems);
      diaryTitleItems.innerText =
        "Date: " +
        date +
        ",\n Meal: " +
        diaryMeal +
        ",\n Total carbs for this meal = " +
        totalMealCarbs;
      for (let j = 1; j < diaryArray[i].length; j++) {
        let foodName = diaryArray[i][j]["foodName"];
        let weight = diaryArray[i][j]["weight"];
        let totalCarbs = diaryArray[i][j]["totalCarbs"];
        let weightUnit = diaryArray[i][j]["weightUnit"];
        let foodItems = document.createElement("p");
        foodItems.setAttribute("class", "foodItems");
        insertAfter(diaryTitleItems, foodItems);
        foodItems.innerText =
          foodName +
          "\n Weight: " +
          weight +
          " " +
          weightUnit +
          "\n Carbs: " +
          totalCarbs;
      }
    }
  }

  //Public functions

  //To display the food list that corresponds to the value of the item clicked:
  this.foodList = function (val) {
    let foodCategory = val;
    getFoodItems(foodCategory);
  };
  //To add items to the diary
  this.addToDiary = function () {
    $("#addToDiary").remove();
    addToDiary();
  };
  //To go to the diary additions view
  this.diaryAdditions = function (value) {
    let diaryMeal = value;
    displayDiaryAdditions(diaryMeal);
  };
  //To go to the diary
  this.diary = function () {
    diary();
  };
  //To go back to the beginning
  this.back = function () {
    window.location.reload();
  };
}
