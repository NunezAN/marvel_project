//218ad171663f8304bfabed8c5e0ecd2d

async function getCharacterSearch(searchCharacterinput) {
  
  const heroId = await getCharacterID(searchCharacterinput);
//   console.log(heroId);
  if (heroId == null){
    const comicsWrapper = document.querySelector(".main__comics");
    comicsWrapper.innerHTML = `L BOZO, 0 results for \"${searchCharacterinput.toUpperCase()}\". Also try entering the first letters of the heroes name. (e.g. \"spid\" for spider-man)`
    return;
  }
  getData(heroId);
  //   const comicsWrapper = document.querySelector(".main__comics");
  //   console.log(comicData);
  //   const comicsHTML = comicData.map((comic) => htmlcomic(comic));
  //   comicsWrapper.innerHTML = comicsHTML.join("");
}

async function getData(heroIds) {
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
    comicsWrapper.innerHTML = allComicHTML;
    
}
function status(res) {
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res;
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
  return `
    <div class="comic">   
        <figure class="comic__img--wrapper">
            <img class="book__img" src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="">
        </figure>
        <div class="comic__title">
            ${comic.title}
        </div>
    </div>
    `;
}

function searchComic(event){
    event.preventDefault();
    console.log("searching...");
    const searchInput = document.getElementsByClassName("input__box");
    const searchCharacterinput = searchInput[0].value
    console.log(searchCharacterinput);
    getCharacterSearch(searchCharacterinput);
    
}

// getCharacterSearch();