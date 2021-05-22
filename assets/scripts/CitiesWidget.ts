
import { _decorator, Component, Node, ScrollView, log, Prefab, instantiate, director, logID, warnID, sys, System, Label } from 'cc';
import { CityItem } from './CityItem';
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

	@property({type: Label})
	progress:Label|null = null;

	private onLoading:boolean = false;
	private onClickLoading:boolean = false;
	
	private loadingSteps:string[]|null = null;
	private nextTime:number = -1;
	private currentCity:string = "";
	
	private loadMyCityRetry:number = -1;
	private myCityItem:any = null;
	
	private static requireCities:string [] = ["Paris", "New%20York", "Istanbul"];
	private static requireSize:number = -1;

	private static myLocation:any = null;
	private static citiesData:Map<string, any>;
	public static currentCityData:any|null = null;

	start ()
	{
		if (!CitiesWidget.citiesData)
		{
			CitiesWidget.requireSize = CitiesWidget.requireCities.length + 1;
			CitiesWidget.citiesData = new Map<string, any>();
		}

		if (CitiesWidget.citiesData.size != 4)
		{
			this.loadingSteps = Object.assign([], CitiesWidget.requireCities);
			this.onLoading = false;
			this.nextTime = 0;
			this.loadMyCityRetry = 10;

			if (sys.os == sys.OS.ANDROID)
				this.loadingSteps.unshift ("myCity");
			else if (sys.os == sys.OS.WINDOWS)
				this.loadingSteps.unshift ("myFakeCity");

			if (this.progress)
				this.progress.string = `Loading 0/${CitiesWidget.requireSize}`;
		}
		else
			this.init ();
	}

	update (delta:number)
	{
		if (this.onLoading)
			return;

		if (!this.loadingSteps)
			return;
			
		this.nextTime -= delta;
		if (this.nextTime > 0)
			return;

		this.nextTime = 1;
		if (this.loadingSteps.length == 0)
		{
			this.init ();
			this.currentCity = "";
			this.loadingSteps = null;
			return;
		}
		
		this.currentCity = this.loadingSteps [0];

		let isNext:boolean = false;
		if (CitiesWidget.citiesData.has (this.currentCity))
			isNext = !CitiesWidget.citiesData.get (this.currentCity).isError;

		if (!isNext)
		switch (this.currentCity)
		{
			case "myCity":		isNext = this.tryGetMyCity (); break;
			case "myFakeCity":	isNext = this.tryGetFakeCity (); break;
			default:			isNext = this.tryGetCity (this.currentCity); break;
		}

		if (isNext)
		{
			this.loadingSteps.shift ();
			if (this.progress)
				this.progress.string = `Loading ${CitiesWidget.requireSize - this.loadingSteps.length}/${CitiesWidget.requireSize}`;
		}
	}

	tryGetMyCity (isCheckRetry:boolean = true)
	{
		let result = jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "getCurrentLocation", "()Ljava/lang/String;");
		if (result == "")
		{
			if (isCheckRetry)
			{
				let isNext = this.loadMyCityRetry -- < 0;
				if (isNext)
					CitiesWidget.citiesData.set (this.currentCity, {name: this.currentCity, isError: true});

				return isNext;
			}
			
			return false;
		}

		CitiesWidget.myLocation = JSON.parse (result);
		this.loadCityByLocation (CitiesWidget.myLocation.lat, CitiesWidget.myLocation.lon);

		return true;
	}

	tryGetFakeCity ()
	{
		let result = "{\"lat\": 10.7528312, \"lon\": 106.701535}";
		CitiesWidget.myLocation = JSON.parse (result);
		this.loadCityByLocation (CitiesWidget.myLocation.lat, CitiesWidget.myLocation.lon);

		return true;
	}

	tryGetCity (city:string)
	{
		this.loadCityByName (city);
		return true;
	}

	init ()
	{
		// log ("call init");
		if (!this.listOfCities || !this.listOfCities.content || !this.itemPrefab)
			return;
			
		let content = this.listOfCities.content;
		content.removeAllChildren ();
		
		CitiesWidget.citiesData.forEach ((value:any, city:string) =>
		{
			// log ("init city", city);
			if (!this.itemPrefab)
				return;

			let node:Node|null = instantiate(this.itemPrefab);
			let item:any = node.getComponent ("CityItem");

			if (!item)
				return;
			
			if (city == "myCity" || city == "myFakeCity")
				this.myCityItem = item;

			item.init (city, value.name, this.itemOnClick.bind (this));
			content.addChild (node);
		});

		this.listOfCities.node.active = true;

		if (this.loading)
			this.loading.active = false;
	}

	itemOnClick (city:string)
	{
		if (this.onLoading)
			return;

		// log ("itemOnClick", `CitiesWidget.citiesData.has (${city})`, CitiesWidget.citiesData.has (city), CitiesWidget.citiesData.keys());
		if (!CitiesWidget.citiesData.has (city))
			return;
		
		let cityData = CitiesWidget.citiesData.get (city);
		// log ("itemOnClick", "cityData.isError", cityData.isError);
		if (cityData.isError)
		{
			switch (cityData.name)
			{
				case "myCity":		this.onClickLoading = this.tryGetMyCity (false); break;
				case "myFakeCity":	this.onClickLoading = this.tryGetFakeCity (); break;
				default:			this.onClickLoading = this.tryGetCity (cityData.name); break;
			}

			if (this.onClickLoading)
				this.currentCity = cityData.name;
		}
		else
		{
			CitiesWidget.currentCityData = cityData;
			director.loadScene("weather");
		}
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
		let isChangeScene = this.onClickLoading;

		this.onLoading = false;
		this.onClickLoading = false;

		if (error)
		{
			log ("onLoadCompleted", "error", error.name, error.message);
			CitiesWidget.citiesData.set (this.currentCity, {name: this.currentCity, isError: true});
			return;
		}

		try
		{
			let obj = JSON.parse (jsonStr);
			let name:string = obj.name;

			// log ("onLoadCompleted", this.currentCity, name, jsonStr);
			CitiesWidget.citiesData.set (this.currentCity, obj);
			
			if (this.currentCity == "myCity" || this.currentCity == "myFakeCity")
			if (this.myCityItem)
				this.myCityItem.init (this.currentCity, name, this.itemOnClick.bind (this));

			if (isChangeScene)
			{
				CitiesWidget.currentCityData = obj;
				director.loadScene("weather");
			}
		}
		catch (error)
		{
			log ("onLoadCompleted", "error", "cannot parse data", jsonStr);
		}
	}
}