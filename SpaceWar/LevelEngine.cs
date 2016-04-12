using SpaceWarService.DataMembers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace SpaceWarService
{
	public class LevelEngine
	{
		private int level = 0;
		private int enemiesSpeed = 1;
		private int maxLevel = int.Parse(ConfigurationManager.AppSettings["MaxLevel"]);

		public int CurrentLevel
		{
			get { return level; }
		}

		public int EnemiesSpeed
		{
			get
			{
				switch (level)
				{
					case 1:
					case 2:
						enemiesSpeed = 1;
						break;
					case 3:
					case 4:
						enemiesSpeed = 2;
						break;
					case 5:
						enemiesSpeed = 3;
						break;
				}

				return enemiesSpeed;
			}
		}

		public Enemy[] GetEnemiesForLevel(int forLevel)
		{
			level = forLevel;
			var enemies = new List<Enemy>();
			var rows = 5;//5;
			var colls = 8;//8;
			var distanceBeetwenEnemy = 100;
			var startX = (1024 - distanceBeetwenEnemy * colls)/2 + 20;

			for (int j = 0; j < rows; j++)
			{
				for (int i = 0; i < colls; i++)
				{

					enemies.Add(new Enemy
					{
						X = startX + i * distanceBeetwenEnemy,
						Y = 10 + j * 40,
						S = 40,
						DX = j % 2 == 0 ? -2 : 1
					});
				}
			}

			return enemies.ToArray();
		}

		public Ship GetShipProperties(int forLevel)
		{
			var ship = new Ship()
			{
				X = 1024 / 2 + 40 / 2,
				Y = 768 - 40,
				S = 40,
				ReloadTime = 200,
				Speed = 5
			};

			switch (forLevel)
			{
				case 1:
					ship.ReloadTime = 50;
					ship.Speed = 1;
					break;
				case 2:
					ship.ReloadTime = 100;
					ship.Speed = 2;
					break;
				case 3:
					ship.ReloadTime = 150;
					ship.Speed = 3;
					break;
				case 4:
					ship.ReloadTime = 200;
					ship.Speed = 4;
					break;
				case 5:
					ship.ReloadTime = 250;
					ship.Speed = 5;
					break;
				default:
					return ship;
			}

			return ship;
		}
	}
}