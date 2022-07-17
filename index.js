//218ad171663f8304bfabed8c5e0ecd2d

//function that takes in charecter name and gets the character id and populates comic data for character id into html
async function getCharacterSearch(searchCharacterinput) {
    //promise that sets variable to html location to poulate the comics
  const comicsWrapper = document.querySelector(".main__comics");
    //loading function that displays loading animation
  loading();
    //get an array of character ids from the input name field
  const heroId = await getCharacterID(searchCharacterinput);
    //if arrays is empty, populate html to display no results were found
  if (heroId == null) {
    const resultsWrapper = document.querySelector(".results");
    resultsWrapper.innerHTML = `<span class="results__text">0 results for \"${searchCharacterinput.toUpperCase()}\". Also try entering the first letters of the heroes name. (e.g. \"spid\" for spider-man)</span>`;
    comicsWrapper.innerHTML = ``;
        //function to stop the loading animation
    doneLoading();
    return;
  }
  //callect and display the comic data for the character inputed by the user
  await getData(heroId, searchCharacterinput);
  //function to stop the loading animation
  doneLoading();
}

//function to add class to html that will set the loading animation to be displayed
function loading() {
  const loadingresultsWrapper = document.querySelector(
    ".comic__results--wrapper"
  );
  loadingresultsWrapper.classList += " comics__loading";
}

//function to remove class from html that will set the loading animation to not be displayed
function doneLoading() {
  const loadingresultsWrapper = document.querySelector(
    ".comic__results--wrapper"
  );
  loadingresultsWrapper.classList.remove("comics__loading");
}

async function getData(heroIds, heroName) {
    //string to store the html to be populates into comics class
  let allComicHTML = "";
    //variable to keep track of the number of results found
  let resultsCount = 0;
    //variable to store location of the main__comics class to populate html
  const comicsWrapper = document.querySelector(".main__comics");

    //loop that goes through array of mathced heroes and collects all the data of each comic
  for (i = 0; i < heroIds.length; i++) {
    //fetch all the comic data from the hero ids
    const comicResponse = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${heroIds[i].id}/comics?apikey=218ad171663f8304bfabed8c5e0ecd2d`
    );
    const marvelData = await comicResponse.json();
    //convert the resulting data into an array
    const comicsData = marvelData.data.results;
    //sum up the number of results
    resultsCount += comicsData.length;
    //map every array object into a html string 
    const comicsHTML = comicsData.map((comic) => htmlcomic(comic));
    //convert the array into one long string and append it to the html variable
    allComicHTML += comicsHTML.join("");
  }
  //funnction to display the number of results found
  resultsHTML(resultsCount, heroName);
  //populate the html
  comicsWrapper.innerHTML = allComicHTML;
}

//function that takes in the hero name and amount of results found for hero and populate html under results class
function resultsHTML(resultsCount, heroName) {
  const resultsWrapper = document.querySelector(".results");
  resultsWrapper.innerHTML = `
    <span class="results__text">Found ${resultsCount} results containing the hero name \"${heroName}\" </span>
    `;
}

//function that takes in the hero name and fetches all character id for matching name and starts with name and returns an array with all the matched character ids
async function getCharacterID(heroName) {
    //collect data for matching character name
  const heroFetchData = await fetch(
    `https://gateway.marvel.com:443/v1/public/characters?name=${heroName}&apikey=218ad171663f8304bfabed8c5e0ecd2d`
  );
  const heroData = await heroFetchData.json();
    //collect data for characters that start with input name
  const heroStartsWithData = await fetch(
    `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${heroName}&apikey=218ad171663f8304bfabed8c5e0ecd2d`
  );
  const heroDataStarts = await heroStartsWithData.json();
    //create an array that contains all hero data starting with the matching hero name
  let hero = heroData.data.results;
    //concat the data from starts with to the hero array
  hero = hero.concat(heroDataStarts.data.results);
    //return null if no results were found
  if (hero.length === 0) {
    return null;
  }
    //return the array of matching hero objects
  return hero;
}

//function that populates html for every comic in html format
function htmlcomic(comic) {
  return `
    <div class="comic">   
        <figure class="comic__img--wrapper">
            <img class="comic__img" src="${
              comic.thumbnail.path
            }/portrait_uncanny.${comic.thumbnail.extension}" alt="">
            <div class="comic__wrapper--background"></div>
            <div class="comic__description">
                <p class="comic__year">DATE RELEASED: ${comic.dates[0].date.substring(
                  0,
                  10
                )}</p>
                <p class="comic__description--para">
                    ${comic.description || "NO DESCRIPTION AVAILABLE"}
                </p>
            </div>
        </figure>
    
    <div class="comic__title">${comic.title}</div>
</div>
    `;
}

//function that capture event when string is entered into search box and begins to search for matching comics
function searchComic(event) {
  event.preventDefault();
  const searchInput = document.getElementsByClassName("input__box");
  const searchCharacterinput = searchInput[0].value;
  if (!searchCharacterinput) {
    return;
  }
  getCharacterSearch(searchCharacterinput);
}
