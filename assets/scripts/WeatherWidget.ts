
import { _decorator, Component, Node, log } from 'cc';
import { OpenWeather } from './OpenWeather';
const { ccclass, property } = _decorator;

@ccclass('WeatherWidget')
export class WeatherWidget extends Component
{
	start ()
	{
		let api_url = WeatherAPI.API_URL_GET_BY_CITY ("London");
		let data = WeatherAPI.GET_DATA (api_url,
			(error:Error, jsonStr:string) => {
				if (error)
				{
					log ("error", error.name, error.message);
					return;
				}

				if (jsonStr)
				{
					let obj = JSON.parse (jsonStr);
					log ("data", obj);
					return;
				}
			}
		);
	}
	
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
