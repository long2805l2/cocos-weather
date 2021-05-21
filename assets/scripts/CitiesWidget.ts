
import { _decorator, Component, Node, ScrollView, log, Prefab, instantiate, director, logID, warnID, sys, System } from 'cc';
import { OpenWeather } from './OpenWeather';
import { WeatherWidget } from './WeatherWidget';
const { ccclass, property } = _decorator;

@ccclass('CitiesWidget')
export class CitiesWidget extends Component
{
	@property({type: ScrollView})
	listOfCities:ScrollView|null = null;

	@property({type: WeatherWidget})
	weatherView:WeatherWidget|null = null;

	@property({type: Prefab})
	itemPrefab:Prefab|null = null

	private onLoading:boolean = false;
	public static currentCityData:string = "";

	start ()
	{
		let cities:string[] = ["Paris", "New York", "Istanbul"];
		if (sys.os == sys.OS.ANDROID)
		{
			var result = jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "getCurrentLocation", "()Ljava/lang/String;");
			cities.unshift (result);
		}

		if (this.listOfCities && this.listOfCities.content && this.itemPrefab)
		{
			let content = this.listOfCities.content;
			content.removeAllChildren ();

			for (let id in cities)
			{
				let city = cities [id];
				let node:Node|null = instantiate(this.itemPrefab);
				let item:any = node.getComponent ("CityItem");

				if (!item)
					continue;

				item.init (city, this.itemOnClick.bind (this));
				content.addChild (node);
			}
		}
	}

	update ()
	{
	}

	itemOnClick (city:string)
	{
		if (this.onLoading)
			return;

		this.onLoading = true;
		OpenWeather.GET_DATA (
			OpenWeather.API_URL_GET_BY_CITY (city),
			this.onLoadCompleted.bind (this)
		);
	}

	onLoadCompleted (error:Error, jsonStr:string)
	{
		this.onLoading = false;
		if (error)
		{
			log ("onLoadCompleted", "error", error.name, error.message);
			return;
		}

		CitiesWidget.currentCityData = jsonStr;
		director.loadScene("weather");
	}
}