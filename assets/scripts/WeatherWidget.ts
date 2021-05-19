
import { _decorator, Component, Node, log, CCLoader, Label, RichText, Gradient, Graphics, SpriteFrame, Sprite, resources, Texture2D, assetManager, ImageAsset } from 'cc';
import { OpenWeather } from './OpenWeather';
const { ccclass, property } = _decorator;

@ccclass('WeatherWidget')
export class WeatherWidget extends Component
{
	@property
	public cityName:string = "London";

	@property({type: RichText})
	public city: RichText|null = null;

	@property({type: RichText})
	public temperature: RichText|null = null;

	@property({type: RichText})
	public feelslike: RichText|null = null;

	@property({type: RichText})
	public humidity: RichText|null = null;

	@property({type: RichText})
	public wind: RichText|null = null;

	@property({type: Sprite})
	public weatherIcon: Sprite|null = null;
	
	private _data:any = null;
	private _temperature:number = 0;
	private _feelslike:number = 0;
	private _humidity:number = 0;
	private _wind:number = 0;
	private _weatherIcon:string = "";
	
	start ()
	{
		OpenWeather.GET_DATA (
			OpenWeather.API_URL_GET_BY_CITY (this.cityName),
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

		this.fill ();
	}
	
	parse (weatherJson:string)
	{
		if (!weatherJson)
			return;

		let obj = null;
		try
		{
			obj = JSON.parse (weatherJson);
			this._data = obj;
			this._temperature = obj.main.temp;
			this._feelslike = obj.main.feels_like;
			this._humidity = obj.main.humidity;
			this._wind = obj.wind.speed;
			this._weatherIcon = OpenWeather.ICON_WEATHER_URL (obj.weather [0].icon);
		}
		catch (error)
		{
			log ("parse error", error);
			return;
		}
	}

	fill ()
	{
		if (!this._data)
			return;

		log ("data", JSON.stringify (this._data));

		if (this.city)
		{
			if (this._data)
				this.city.string = this._data.name;
			else
				this.city.string = this.cityName;
		}

		if (this.temperature)
			this.temperature.string = `${this._temperature} °C`;

		if (this.feelslike)
			this.feelslike.string = `${this._feelslike} °C`;

		if (this.humidity)
			this.humidity.string = `${this._humidity} %`;
			
		if (this.wind)
			this.wind.string = `${this._wind} m/s`;

		if (this.weatherIcon)
		{
			let icon = this.weatherIcon;
			log ("this._weatherIcon", this._weatherIcon);
			assetManager.loadRemote(`${this._weatherIcon}`, (err: any, texture: ImageAsset) =>
			{
				if (err)
				{
					log ("fill", "icon", "error", err);
					return;
				}
				if (!texture)
					return;
					
				const spriteFrame = new SpriteFrame();
				spriteFrame.texture = texture._texture;
				icon.spriteFrame = spriteFrame;
			});
		}
	}
}