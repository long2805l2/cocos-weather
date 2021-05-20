
import { _decorator, Component, Node, ScrollView, Label, log, color, UITransform, Vec3, size, Graphics, Prefab, instantiate } from 'cc';
import { CityItem } from './CityItem';
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

	start ()
	{
		let cities:string[] = ["Paris", "New York", "Istanbul"];
		cities.unshift ("My City");

		if (this.listOfCities && this.listOfCities.content && this.itemPrefab)
		{
			let y = 0;
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
		log ("on touch city", city);

		if (!this.weatherView)
			return;
			
		this.node.active = false;
		this.weatherView.node.active = true;
		this.weatherView.loadCity (city);
	}
}