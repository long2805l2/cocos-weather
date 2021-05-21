
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
	private isSelected:boolean = false;

	start ()
	{
		if (!this.nameLabel)
			return;
			
		this.nameLabel.string = this.nameCity;
		//this.node.on(Node.EventType.MOUSE_DOWN, this.onTouch.bind (this));
		this.node.on(Node.EventType.TOUCH_START, this.onTouchStart.bind (this));
		this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd.bind (this));
		this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove.bind (this));
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

	onTouchStart (event:any)
	{
		this.isSelected = true;
	}

	onTouchEnd (event:any)
	{
		if (this.onClick && this.isSelected)
			this.onClick (this.nameCity);

		this.isSelected = false;
	}

	onTouchMove (event:any)
	{
		this.isSelected = false;
	}
}