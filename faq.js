document.addEventListener("DOMContentLoaded", function () {
  //Fetch the faq container and the search input

  let faqContainer = document.getElementById("faq-container");
  let searchInput = document.getElementById("faq-search-input");
  const rootElement = document.documentElement;
  const faqBase = document.getElementById("faq-base");

  //Fetch the faq.json file
  let xhr = new XMLHttpRequest();

  //Open the json local file
  xhr.open("GET", "/faq.json", true);
  //Check if the file is loaded
  xhr.onload = function () {
    if (xhr.status === 200) {
      let dataFaqResults = JSON.parse(xhr.responseText);
      displayFAQ(dataFaqResults);

      // Listen for input changes in the search input
      searchInput.addEventListener("input", function () {
        filterFAQ(dataFaqResults, searchInput.value);
      });
    }
  };
  //Send the request
  xhr.send();

  //Display the faq data
  function displayFAQ(dataFaqResults) {
    faqContainer.innerHTML = "";

    //Loop through the data
    dataFaqResults.map((data) => {
      const questions = data.lesQuestions;
      let categoryTitle = document.createElement("div");
      categoryTitle.classList.add("category-title");

      // create category icon
      let categoryIcon = document.createElement("div");
      categoryIcon.classList.add("category-icon");

      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        //enableDarkMode
        categoryIcon.innerHTML = data["icon_white"];
      } else {
        //disableDarkMode
        categoryIcon.innerHTML = data["category-icon"];
      }

      // create category element
      let categoryElement = document.createElement("h2");
      categoryElement.classList.add("category");
      categoryElement.textContent = data["category-name"];

      categoryTitle.appendChild(categoryIcon);
      categoryTitle.appendChild(categoryElement);
      faqContainer.appendChild(categoryTitle);

      //Loop through the questions
      questions.map((question) => {
        // create question element
        let questionElement = document.createElement("div");
        questionElement.classList.add("question");
        questionElement.textContent = question.question;
        faqContainer.appendChild(questionElement);

        // create answer element
        let answerElement = document.createElement("div");
        answerElement.classList.add("answer", "hidden");
        answerElement.innerHTML = question.reponse;
        faqContainer.appendChild(answerElement);

        questionElement.addEventListener("click", function () {
          //Toggle the hidden class
          this.nextElementSibling.classList.toggle("hidden");
        });
      });
    });
  }

  //Filter the faq data
  function filterFAQ(dataFaqResults, searchQuery) {
    let filteredData = [];

    //Loop through the data
    for (let data in dataFaqResults) {
      let category = dataFaqResults[data]["category-name"];
      let questions = dataFaqResults[data]["lesQuestions"];
      let categoryIcon = dataFaqResults[data]["category-icon"];
      let icon_white = dataFaqResults[data]["icon_white"];

      //Filter the questions
      let filteredQuestions = questions.filter(function (question) {
        return question.question
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });

      //Add the filtered questions to the filtered data
      if (filteredQuestions.length > 0) {
        filteredData.push({
          "category-name": category,
          "lesQuestions": filteredQuestions,
          "category-icon": categoryIcon,
          "icon_white": icon_white,
        });
      }
    }

    //Display the filtered data
    displayFAQ(filteredData);
  }

  //Function to enable dark mode
  function enableDarkMode() {
    rootElement.classList.add("dark-mode");
    faqBase.classList.add("dark-mode");
  }

  //Function to disable dark mode
  function disableDarkMode() {
    rootElement.classList.remove("dark-mode");
    faqBase.classList.remove("dark-mode");
  }

  //Check if the user has dark mode enabled
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }


  console.log("faq.js loaded");
});
