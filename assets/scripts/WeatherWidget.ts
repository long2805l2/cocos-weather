
import { _decorator, Component, Node, log } from 'cc';
import { OpenWeather } from './OpenWeather';
const { ccclass, property } = _decorator;

@ccclass('WeatherWidget')
export class WeatherWidget extends Component
{
    @property
	country:string = "London";
	
	private _temperature:number = 0;
	private _feelslike:number = 0;
	private _humidity:number = 0;
	private _wind:number = 0;
	
	start ()
	{
		OpenWeather.GET_DATA (
			OpenWeather.API_URL_GET_BY_CITY (this.country),
			this.onLoadCompleted.bind (this)
		);
	}

	onLoadCompleted (error:Error, jsonStr:string)
	{
		if (error)
		{
			log ("onLoadCompleted", "error", error.name, error.message);
			return;
		}

		if (jsonStr)
			this.parse (jsonStr);
	}
	
	parse (weatherJson:string)
	{
		if (!weatherJson)
			return;

		let obj = null;
		try
		{
			obj = JSON.parse (weatherJson);
			this._temperature = obj.main.temp;
			this._feelslike = obj.main.feels_like;
			this._humidity = obj.main.humidity;
			this._wind = obj.wind.speed;
		}
		catch (error)
		{
			log ("parse error", error);
			return;
		}

		log ("temperature", this._temperature);
		log ("feelslike", this._feelslike);
		log ("humidity", this._humidity);
		log ("wind", this._wind);
	}
}