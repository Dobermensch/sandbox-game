import axios from 'axios';

export const postScore = async (endpointURL, playerName, score) =>
{
  try
  {
    const userRankRequest = await axios.post(`${endpointURL}/public/score`,
      {
        playerName,
        score
      }
    );

    return userRankRequest
  } 
  catch (e)
  {
    window.alert(e);
    console.error(e);
  }
}