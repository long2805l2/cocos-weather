
import { _decorator, Component, Node, ScrollView, log, Prefab, instantiate, director, logID, warnID, sys, System } from 'cc';
import { OpenWeather } from './OpenWeather';
import { WeatherWidget } from './WeatherWidget';
const { ccclass, property } = _decorator;

@ccclass('CitiesWidget')
export class CitiesWidget extends Component
{
	@property({type: ScrollView})
	listOfCities:ScrollView|null = null;

	@property({type: Prefab})
	itemPrefab:Prefab|null = null;

	@property({type: Node})
	loading:Node|null = null;

	private onLoading:boolean = false;
	
	private loadingSteps:string[]|null = null;
	private nextTime:number = -1;

	private static citiesData:Map<string, any>;
	public static currentCityData:any|null = null;

	start ()
	{
		if (!CitiesWidget.citiesData || CitiesWidget.citiesData.size == 0)
		{
			CitiesWidget.citiesData = new Map<string, any>();

			this.loadingSteps = ["Paris", "New York", "Istanbul"];
			this.onLoading = false;
			this.nextTime = 0;

			if (sys.os == sys.OS.ANDROID)
				this.loadingSteps.unshift ("myCity");
			else if (sys.os == sys.OS.WINDOWS)
				this.loadingSteps.unshift ("myFakeCity");
		}
		else
			this.init ();
	}

	update (delta:number)
	{
		if (this.onLoading)
			return;

		if (this.loadingSteps)
		{
			this.nextTime -= delta;
			// log ("update", this.loadingSteps.length, delta, this.nextTime);

			if (this.nextTime > 0)
				return;

			this.nextTime = 1;
			if (this.loadingSteps.length > 0)
			{
				let city = this.loadingSteps [0];
				switch (city)
				{
					case "myCity":
					{
						let result = jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "getCurrentLocation", "()Ljava/lang/String;");
						if (result == "")
							return;

						let location = JSON.parse (result);
						this.loadingSteps.shift ();
						this.loadCityByLocation (location.lat, location.lon);
					}
					break;

					case "myFakeCity":
					{
						let location = { lat: 10.762622, lon: 106.660172 };
						this.loadingSteps.shift ();
						this.loadCityByLocation (location.lat, location.lon);
					}
					break;
					
					default:
					{
						this.loadingSteps.shift ();
						this.loadCityByName (city);
					}
					break;
				}
			}
			else
			{
				this.init ();
				this.loadingSteps = null;
			}
		}
	}

	init ()
	{
		log ("call init");
		if (!this.listOfCities || !this.listOfCities.content || !this.itemPrefab)
			return;
			
		let content = this.listOfCities.content;
		content.removeAllChildren ();
		
		CitiesWidget.citiesData.forEach ((value:any, city:string) =>
		{
			log ("init city", city);
			if (!this.itemPrefab)
				return;

			let node:Node|null = instantiate(this.itemPrefab);
			let item:any = node.getComponent ("CityItem");

			if (!item)
				return;
			
			item.init (city, this.itemOnClick.bind (this));
			content.addChild (node);
		});

		this.listOfCities.node.active = true;

		if (this.loading)
			this.loading.active = false;
	}

	itemOnClick (city:string)
	{
		if (!CitiesWidget.citiesData.has (city))
			return;

		CitiesWidget.currentCityData = CitiesWidget.citiesData.get (city);
		director.loadScene("weather");
	}

	loadCityByName (city:string)
	{
		this.onLoading = true;
		OpenWeather.GET_DATA (
			OpenWeather.API_URL_GET_BY_CITY (city),
			this.onLoadCompleted.bind (this)
		);
	}

	loadCityByLocation (lat:number, lon:number)
	{
		this.onLoading = true;
		OpenWeather.GET_DATA (
			OpenWeather.API_URL_GET_BY_GEOGRAPHIC_COORDINATES (lat, lon),
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

		try
		{
			let obj = JSON.parse (jsonStr);
			let name:string = obj.name;

			log ("onLoadCompleted", name, jsonStr);
			CitiesWidget.citiesData.set (name, obj);
		}
		catch (error)
		{
			log ("onLoadCompleted", "error", "cannot parse data", jsonStr);
		}
	}
}