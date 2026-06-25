const BASE_URL = "https://api.themoviedb.org/3"

const options = {
    headers:{
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`
    }
}

export async function getTrendingAllWeek() {
    const res = await fetch(
      `${BASE_URL}/trending/all/week`,
      options
    );

    if (!res.ok) {
        throw new Error(`TMDB API failed with status: ${res.status}`);
      }
  
    return res.json();
  }


  export async function getNowPlaying() {
    const res = await fetch(
      `${BASE_URL}/movie/now_playing`,
      options
    );

    if (!res.ok) {
        throw new Error(`TMDB API failed with status: ${res.status}`);
      }
  
    return res.json();
  }

  //movies


  //discover movies
  export async function getDiscoverMovies() {
    const res = await fetch(
      `${BASE_URL}/discover/movie`,
      options
    );

    if (!res.ok) {
        throw new Error(`TMDB API failed with status: ${res.status}`);
      }
  
    return res.json();
  }


    //all movies
    export async function getAllMovies(id: string | number) {
      const res = await fetch(
        `${BASE_URL}/movie/${id}`,
        options
      );
  
      if (!res.ok) {
          throw new Error(`TMDB API failed with status: ${res.status}`);
        }
    
      return res.json();
    }


   //popular movies
   export async function getPopularMovies(page: number) {
    const res = await fetch(
      `${BASE_URL}/movie/popular?language=en-US&page=${page}`,
      options
    );

    if (!res.ok) {
        throw new Error(`TMDB API failed with status: ${res.status}`);
      }
  
    return res.json();
  }
  

  //Now Playing Page
  export async function getNowPlayingPage(page: number) {
    const res = await fetch(
      `${BASE_URL}/movie/now_playing?language=en-US&page=${page}`,
      options
    );

    if (!res.ok) {
        throw new Error(`TMDB API failed with status: ${res.status}`);
      }
  
    return res.json();
  }

