
import { _decorator, Component, Node, log, Label, RichText, Gradient, Graphics, SpriteFrame, Sprite, resources, Texture2D, assetManager, ImageAsset, director, tween, color, sys, systemEvent, SystemEventType, EventKeyboard, macro } from 'cc';
import { CitiesWidget } from './CitiesWidget';

import { OpenWeather } from './OpenWeather';
const { ccclass, property } = _decorator;

@ccclass('WeatherWidget')
export class WeatherWidget extends Component
{
	@property({type: RichText})
	public city: RichText|null = null;

	@property({type: RichText})
	public feelslike: RichText|null = null;

	@property({type: RichText})
	public humidity: RichText|null = null;

	@property({type: RichText})
	public wind: RichText|null = null;

	@property({type: Label})
	public close: Label|null = null;

	@property({type: Sprite})
	public weatherIcon: Sprite|null = null;

	@property({type: Node})
	public citiesView:Node|null = null;
	
	private _data:any = null;
	private _temperature:number = 0;
	private _feelslike:number = 0;
	private _humidity:number = 0;
	private _wind:number = 0;
	private _weatherIcon:string = "";
	
	start ()
	{
		this.loadCity (CitiesWidget.currentCityData);

		if (this.close)
			this.close.node.on(Node.EventType.MOUSE_DOWN, this.onBack.bind (this));

		systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
	}

    onDestroy ()
	{
        systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

	loadCity (weatherJson:string)
	{
		log ("weatherJson", weatherJson);
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

			this.fill ();
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

		if (this.city && this._data)
			this.city.string = `${this._data.name}\n${this._temperature} °C`;

		if (this.feelslike)
			this.feelslike.string = `${this._feelslike} °C`;

		if (this.humidity)
			this.humidity.string = `${this._humidity} %`;
			
		if (this.wind)
			this.wind.string = `${this._wind} mps`;

		if (this.weatherIcon)
		{
			let icon = this.weatherIcon;
			assetManager.loadRemote(this._weatherIcon, (err: any, texture: ImageAsset) =>
			{
				if (err && !texture)
					return;
					
				const spriteFrame = new SpriteFrame();
				spriteFrame.texture = texture._texture;
				icon.spriteFrame = spriteFrame;
				icon.color = color (255, 255, 255, 255);

			});
		}
	}

	onKeyDown (event:EventKeyboard)
	{
		log ("onKeyDown", event.keyCode, macro.KEY.back);
		switch (event.keyCode)
		{
			case macro.KEY.back:
			case macro.KEY.escape:
				this.onBack ();
				break;
		}
	}

	onBack ()
	{
		director.loadScene ("main");
	}
}