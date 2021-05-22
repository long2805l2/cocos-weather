
import { _decorator, Component, Node, Label, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CityItem')
export class CityItem extends Component
{
	@property({type: Label})
	nameLabel:Label|null = null;

	private cityCode:string = "";
	private cityName:string = "";

	private onClick: ((city:string) => void) | null = null;

	start ()
	{
	}

	init (cityCode:string, city:string, callback: (city:string) => void)
	{
		this.cityCode = cityCode;
		this.cityName = city;
		this.onClick = callback;

		if (this.nameLabel)
			this.nameLabel.string = city;
	}

	update (deltaTime: number)
	{
	}
	
	onTouch (event:any)
	{
		if (this.onClick)
			this.onClick (this.cityCode);
	}
}