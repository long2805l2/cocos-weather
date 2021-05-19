
import { _decorator, Component, Node, assetManager, log, Asset } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('WeatherAPI')
export class WeatherAPI
{
//	doc: https://openweathermap.org/current

	private static API_KEY:string = "3ed9f599a4192d87f3129643f54b82e4";
	private static API_VERSION:string = "2.5";

	static API_URL_GET_BY_CITY (city_name:string, state_code?:string, country_code?:string):string
	{
		let array = [city_name];
		if (state_code)		array.push (state_code);
		if (country_code)	array.push (country_code);

		let params = array.join (",");
		return `http://api.openweathermap.org/data/${this.API_VERSION}/weather?q=${params}&appid=${this.API_KEY}`;
	}

	static GET_DATA (url:string, callback: (error:Error, jsonStr:string) => any)
	{
		if (callback)
			assetManager.loadAny({url: url, ext: "JSON"}, callback);
	}
}
