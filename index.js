//218ad171663f8304bfabed8c5e0ecd2d

async function getCharacterSearch(searchCharacterinput) {
    const comicsWrapper = document.querySelector(".main__comics");
    const loadingresultsWrapper = document.querySelector(".comic__results--wrapper");
    loadingresultsWrapper.classList += " comics__loading";
    // comicsWrapper.classList += " comics__loading";
  
  const heroId = await getCharacterID(searchCharacterinput);
//   console.log(heroId);
  if (heroId == null){
    const resultsWrapper = document.querySelector(".results");
    resultsWrapper.innerHTML = `<span class="results__text">L BOZO, 0 results for \"${searchCharacterinput.toUpperCase()}\". Also try entering the first letters of the heroes name. (e.g. \"spid\" for spider-man)</span>`;
    // const comicsWrapper = document.querySelector(".main__comics");
    comicsWrapper.innerHTML = ``;
    // comicsWrapper.classList.remove("comics__loading");
    loadingresultsWrapper.classList.remove("comics__loading");
    return;
  }
  await getData(heroId,searchCharacterinput);
//   comicsWrapper.classList.remove("comics__loading");
  loadingresultsWrapper.classList.remove("comics__loading");
  //   const comicsWrapper = document.querySelector(".main__comics");
  //   console.log(comicData);
  //   const comicsHTML = comicData.map((comic) => htmlcomic(comic));
  //   comicsWrapper.innerHTML = comicsHTML.join("");
}

async function getData(heroIds, heroName) {
    let allComicHTML = "";
    let resultsCount = 0;
    const comicsWrapper = document.querySelector(".main__comics");
  
    //   const comicResponse = await fetch("https://gateway.marvel.com:443/v1/public/comics?format=comic&apikey=218ad171663f8304bfabed8c5e0ecd2d");
    for(i=0;i<heroIds.length;i++)
    {
      const comicResponse = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroIds[i].id}/comics?apikey=218ad171663f8304bfabed8c5e0ecd2d`);

//   console.log(comicResponse);
   const marvelData = await comicResponse.json();
//    console.log(marvelData);
  const comicsData = marvelData.data.results;
  resultsCount+=comicsData.length;
//   const comicsWrapper = document.querySelector(".main__comics");
  const comicsHTML = comicsData.map((comic) => htmlcomic(comic));
    // console.log(comicsHTML);
    allComicHTML += comicsHTML.join("");
    }
    console.log(resultsCount);
    resultsHTML(resultsCount,heroName);
    comicsWrapper.innerHTML = allComicHTML;
    
}

function resultsHTML(resultsCount,heroName){
    const resultsWrapper = document.querySelector(".results");
    resultsWrapper.innerHTML = `
    <span class="results__text">Found ${resultsCount} results containing the hero name \"${heroName}\" </span>
    `;
}

async function getCharacterID(heroName) {
  const heroFetchData = await fetch(
    `https://gateway.marvel.com:443/v1/public/characters?name=${heroName}&apikey=218ad171663f8304bfabed8c5e0ecd2d`
  );
  const heroData = await heroFetchData.json();
    const heroStartsWithData = await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${heroName}&apikey=218ad171663f8304bfabed8c5e0ecd2d`);
    const heroDataStarts = await heroStartsWithData.json();
    // console.log(heroDataStarts.data.results);
  let hero = heroData.data.results;
  hero = hero.concat(heroDataStarts.data.results);
//   console.log(hero);
  if(hero.length ===0){
    return null;
  }
  return hero;
}

function htmlcomic(comic) {
    // console.log(comic)
//   return `
//     <div class="comic">   
//         <figure class="comic__img--wrapper">
//             <img class="comic__img" src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="">
//         </figure>
//         <div class="comic__title">
//             ${comic.title}
//         </div>
//     </div>
//     `;
    // console.log(comic.description);
    return `
    <div class="comic">   
        <figure class="comic__img--wrapper">
            <img class="comic__img" src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="">
            <div class="comic__wrapper--background"></div>
            <div class="comic__description">
                <p class="comic__year">DATE RELEASED: ${comic.dates[0].date.substring(0,10)}</p>
                <p class="comic__description--para">
                    ${comic.description || "NO DESCRIPTION AVAILABLE"}
                </p>
            </div>
        </figure>
    
    <div class="comic__title">${comic.title}</div>
</div>
    `;
}

function searchComic(event){
    event.preventDefault();
    console.log("searching...");
    const searchInput = document.getElementsByClassName("input__box");
    const searchCharacterinput = searchInput[0].value
    console.log(searchCharacterinput);
    if(!searchCharacterinput)               //handle empty string
    {
        return;
    }
    getCharacterSearch(searchCharacterinput);
    
}

// getCharacterSearch();