
import { _decorator, Component, assetManager } from 'cc';
const { ccclass } = _decorator;

@ccclass('OpenWeather')
export class OpenWeather
{
	private static API_KEY:string = "3ed9f599a4192d87f3129643f54b82e4";
	private static API_VERSION:string = "2.5";

	public static API_URL_GET_BY_CITY (city_name:string, state_code?:string, country_code?:string):string
	{
		let array = [city_name];
		if (state_code)		array.push (state_code);
		if (country_code)	array.push (country_code);

		let params = array.join (",");
		return `http://api.openweathermap.org/data/${this.API_VERSION}/weather?q=${params}&appid=${this.API_KEY}&units=metric`;
	}

	public static API_URL_GET_BY_GEOGRAPHIC_COORDINATES (lat:number, lon:number):string
	{
		return `http://api.openweathermap.org/data/${this.API_VERSION}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
	}

	public static ICON_WEATHER_URL (iconId:string)
	{
		return `http://openweathermap.org/img/wn/${iconId}@4x.png`;
	}

	public static GET_DATA (url:string, callback: (error:Error, jsonStr:string) => any)
	{
		if (callback)
			assetManager.loadAny({url: url, ext: "JSON"}, callback);
	}

	/*
	{
		"coord":{"lon":-0.1257,"lat":51.5085},
		"weather":[{
			"id":804,
			"main":"Clouds",
			"description":"overcast clouds",
			"icon":"04d"
		}],
		"base":"stations",
		"main":{
			"temp":10.01,
			"feels_like":9.52,
			"temp_min":8.95,
			"temp_max":11.25,
			"pressure":1016,
			"humidity":94
		},
		"visibility":10000,
		"wind":{
			"speed":0.45,
			"deg":285,
			"gust":2.24
		},
		"clouds":{
			"all":90
		},
		"dt":1621410838,
		"sys":{
			"type":2,
			"id":2019646,
			"country":"GB",
			"sunrise":1621396977,
			"sunset":1621453877
		},
		"timezone":3600,
		"id":2643743,
		"name":"London",
		"cod":200
	}
	*/
}