//218ad171663f8304bfabed8c5e0ecd2d
async function main() {
  
  const heroId = await getCharacterID("x-men");
  console.log(heroId);
  if (heroId == null){
    return;
  }
  getData(heroId);
  //   const comicsWrapper = document.querySelector(".main__comics");
  //   console.log(comicData);
  //   const comicsHTML = comicData.map((comic) => htmlcomic(comic));
  //   comicsWrapper.innerHTML = comicsHTML.join("");
}

main();

async function getData(heroIds) {
  
    //   const comicResponse = await fetch("https://gateway.marvel.com:443/v1/public/comics?format=comic&apikey=218ad171663f8304bfabed8c5e0ecd2d");
    for(i=0;i<heroIds.length;i++)
    {

    
      const comicResponse = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroIds[i].id}/comics?apikey=218ad171663f8304bfabed8c5e0ecd2d`);

//   console.log(comicResponse);
   const marvelData = await comicResponse.json();
//    console.log(marvelData);
  const comicsData = marvelData.data.results;
  const comicsWrapper = document.querySelector(".main__comics");
  const comicsHTML = comicsData.map((comic) => htmlcomic(comic));
    // console.log(comicsHTML);
  comicsWrapper.innerHTML += comicsHTML.join("");
    }
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
    console.log(heroDataStarts.data.results);
  let hero = heroData.data.results;
  hero = hero.concat(heroDataStarts.data.results);
  console.log(hero);
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
            <img class="book__img" src="${comic.thumbnail.path}/portrait_fantastic.${comic.thumbnail.extension}" alt="">
        </figure>
        <div class="comic__title">
            ${comic.title}
        </div>
    </div>
    `;
}
