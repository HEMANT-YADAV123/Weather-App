import React, { useEffect, useRef, useState , useCallback, useMemo } from 'react'
import './Weathers.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import clear_night from '../assets/clear_night.png'
import cloud_night from '../assets/cloud_night.png'
import drizzle_night from '../assets/drizzle_night.png'
import rain_night from '../assets/rain_night.png'
import sunny_background from '../assets/sunny_bgc.png'
import rainy_background from '../assets/rainy_bgc.png'
import snowy_background from '../assets/snowy_bgc.png'
import cloudy_background from '../assets/cloudy_bgc.png'
import haze_background from '../assets/Haze_2.png'
import Loader from './Loader'; // Import the Loader component.



const Weather = () => {
  const inputRef = useRef()  
  const [weatherData,setweatherData] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [background, setBackground] = useState(''); // State for background image.

  const allIcons = useMemo(() => ({
    "01d": clear_icon,
    "01n": clear_night,
    "02d": cloud_icon,
    "02n": cloud_night,
    "03d": cloud_icon,
    "03n": cloud_night,
    "04d": drizzle_icon,
    "04n": drizzle_night,
    "09d": rain_icon,
    "09n": rain_night,
    "10d": rain_icon,
    "10n": rain_night,
    "13d": snow_icon,
    "13n": snow_icon,
  }), []);

  const backgroundImages = useMemo(() => ({
    "Clear": sunny_background,
    "Rain": rainy_background,
    "Drizzle":rainy_background,
    "Clouds": cloudy_background,
    "Snow": snowy_background,
    "Haze": haze_background,
  }), []);
  
  const API_KEY = "5fd7117aebcdd7345f0f05c8d0951ae7"; 
   
  const search = useCallback( async (city)=>{
    if(city === "")
    {
        setError("Please enter a city name")
        return;
    }
    setIsLoading(true);
    setError("")// Clear any previous error messages
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`

      const response = await fetch(url);//get the response.
      const data = await response.json();//convert response into json.

      if(!response.ok)
      {
        setError(data.message); // Display the error message from the API
        setweatherData(false);
        setIsLoading(false);
        return
      }
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setweatherData({
        humidity:data.main.humidity,
        windSpeed:data.wind.speed,
        temperature:Math.floor(data.main.temp),
        location:data.name,
        icon:icon
      });
      // Set the background based on the weather condition
      const weatherCondition = data.weather[0].main; // e.g., "Clear", "Rain", "Clouds"
      console.log(weatherCondition);
      
      setBackground(backgroundImages[weatherCondition] || sunny_background); // Default to sunny background
      
    } catch (error) {
      setweatherData(false)
      setError("Error fetching the data");
    }finally{
      setIsLoading(false);//Ensure loading is turned off.
    }
  },[API_KEY,allIcons,backgroundImages]);
  useEffect(()=>{//jb ham koi bi city nhi dalte tn jo data render hota hai at the starting vo useEffect krvata hai.
    search("Bangalore")
  } , [search]);
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value);
    }
  };

  return (

      <div className="weather" style={{ backgroundImage: `url(${background})` }}>
        <div className="search-bar">
            <input ref={inputRef} 
            type="text" 
            placeholder='Search'
            onKeyDown={handleKeyDown} // Support "Enter" key
            />
            <img src={search_icon}
             alt="" 
             onClick={()=>search(inputRef.current.value)}
             />
        </div>
        {/* Display Loader  -> is isLoading is true and Loader will always be true so when isLoading is true show the Loader*/}
      {isLoading && <Loader />}

        {/* Display Error Message (meaage is always true so when error os true then show error)*/}
    {error && <p className="error-message">{error}</p>}

     {/* Display Weather Data */}
        {weatherData ? <>
            <img src={weatherData.icon} alt="" className='weather-icon'/>
        <p className='temperature'>{weatherData.temperature}°C</p>
        <p className='location'>{weatherData.location}</p>

        <div className="weather-data">
          <div className='col'>
                <img src={humidity_icon} alt="" />
                <div>
                  <p>
                    {weatherData.humidity}%
                  </p>
                <span>
                  Humidity
                </span>
                </div>
          </div>
          <div className='col'>
                <img src={wind_icon} alt="" />
                <div>
                  <p>
                    {weatherData.windSpeed}km/h
                  </p>
                <span>
                  Wind Speed
                </span>
                </div>
          </div>
        </div>
        </>

        :

        <></>}
        
      </div>
  )
}

export default Weather
