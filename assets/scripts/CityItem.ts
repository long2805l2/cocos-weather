
import { _decorator, Component, Node, Label, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CityItem')
export class CityItem extends Component
{
	@property
	nameCity:string = "";

	@property({type: Label})
	nameLabel:Label|null = null;

	public onClick: ((city:string) => void) | null = null;

	start ()
	{
		if (!this.nameLabel)
			return;
			
		this.nameLabel.string = this.nameCity;
		this.nameLabel.node.on(Node.EventType.MOUSE_DOWN, this.onTouch.bind (this));
	}

	init (city:string, callback: (city:string) => void)
	{
		this.nameCity = city;
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
			this.onClick (this.nameCity);
	}
}