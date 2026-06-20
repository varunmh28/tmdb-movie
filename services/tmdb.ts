const BASE_URL = "https://api.themoviedb.org/3"

const options = {
    headers:{
        Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`
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

  
