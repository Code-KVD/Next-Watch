// Storing the api key in a variable.
const apikey = "2f86555bdb8f43af9c42effe0439a260"

// initalising variables.
const cardContainer = document.getElementById("cardContainer");
const search = document.getElementById("search");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const moviesSort = Array.from(document.getElementsByClassName("movies"));
const tvSort = Array.from(document.getElementsByClassName("tvShows"));
const more = Array.from(document.getElementsByClassName("more"));


// creating a URL object for access to different URLs.
const urlObj = {
    baseURL: `https://api.themoviedb.org/3`,
    imgURL: `https://image.tmdb.org/t/p/original`,
    trendingURL: `/trending/all/day?api_key=${apikey}`,
    searchURL: `/search/multi?api_key=${apikey}&query=`,
    moviesURL : [
        `/movie/popular?api_key=${apikey}`,
        `/movie/top_rated?api_key=${apikey}`,
        `/movie/upcoming?api_key=${apikey}`,
        `/discover/movie?api_key=${apikey}&with_genres=35`,
        `/discover/movie?api_key=${apikey}&with_genres=28`
    ],
    tvURL : [
        `/tv/popular?api_key=${apikey}`,
        `/tv/top_rated?api_key=${apikey}`,
        `/discover/tv?api_key=${apikey}&with_genres=35`,
        `/discover/tv?api_key=${apikey}&with_genres=28`
    ],
    moreURL : [
        `/discover/movie?api_key=${apikey}&with_genres=27`,
        `/discover/movie?api_key=${apikey}&with_genres=18`,
        `/discover/movie?api_key=${apikey}&with_genres=16`
    ]
};

// creating a new xhr(XMLHttpRequest) object.
const dataObj = new XMLHttpRequest();
fetchdata(dataObj, urlObj["trendingURL"], showdata);

// creating a fetchdata function which fetches the data from the server.
function fetchdata(request, url, callBack,...rest) {
    // opening GET request for our request object with async true .
    request.open("GET", `${rest[0]?urlObj["baseURL"] + url+ rest[0]:urlObj["baseURL"] + url}`, true);

    // here a function will be executed when the trending object is loaded. 
    request.onload = function () {

        // converting JSON into javascript Object.
        let obj = JSON.parse(this.responseText);
        if (request.status === 200) {
            callBack(obj);
        }
        else {
            alert(`The error caused is ${request.status}`)
        }
    }
    // sending our request to the api database server.
    request.send();
}

// creating a showdata function which displays the data onto the Screen. 
function showdata(object) {
    let cardHTML = "";
    object["results"].forEach((element) => {
        if(element.original_name||element.original_title){
            cardHTML += 
            `<div class="card">
                <img class="card-image" src= ${urlObj["imgURL"] + element.poster_path} alt="">
                <div class="rating">
                    <img class='rating-star' src="static/star.png">
                    <p>${element.vote_average}</p>
                </div>
                <h4>${element.original_name ? element.original_name : element.original_title}</h4>
                <div class ="overview">
                    <h3>Overview</h3>
                    <p>${element.overview.substring(0,200) + "..."}</p>
                </div>
            </div>`
        }
    });
    cardContainer.innerHTML = cardHTML;
}

//adding eventlistener to the search.
search.addEventListener("click", () => {
    if (searchForm.style.visibility != "visible") {
        searchForm.style.visibility = "visible";
        search.innerHTML = `<img src="static/icons8-cancel.svg" alt="" width="30px">`;
    }
    else {
        searchForm.style.visibility = "hidden";
        search.innerHTML = `<img src="static/search_white_24dp.svg" alt="" width="30px">`;
    }
});

// adding event listner to the form.
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value;
    if(searchValue){
        fetchdata(dataObj, urlObj["searchURL"], showdata,searchValue);
    }
    else{
        fetchdata(dataObj, urlObj["trendingURL"], showdata);
    }
});

// Movies sorting.
moviesSort.forEach((element,index)=>{
    element.addEventListener("click",()=>{
        fetchdata(dataObj,urlObj.moviesURL[index],showdata);
    });
})

// Tv sorting.
tvSort.forEach((element,index)=>{
    element.addEventListener("click",()=>{
        fetchdata(dataObj,urlObj.tvURL[index],showdata);
    });
})

// more genres of movies.
more.forEach((element,index)=>{
    element.addEventListener("click", ()=>{
        console.log(index);
        fetchdata(dataObj,urlObj.moreURL[index],showdata);
    });
});