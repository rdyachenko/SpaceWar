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
		private int enemiesSpeed = 100;
		private int maxLevel = int.Parse(ConfigurationManager.AppSettings["MaxLevel"]);

		private int width = 1024;
		private int height = 768;

		public int CurrentLevel
		{
			get { return level; }
		}

		public bool IsMaxLevel
		{
			get { return level == maxLevel; }
		}

		public int EnemiesSpeed
		{
			get
			{
				enemiesSpeed = level;
				/*switch (level)
				{
					case 1:
						enemiesSpeed = 1;
						break;
					case 2:
						enemiesSpeed = 2;
						break;
					case 3:
						enemiesSpeed = 3;
						break;
					case 4:
						enemiesSpeed = 4;
						break;
					case 5:
						enemiesSpeed = 5;
						break;
				}*/
				
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
			var startX = (width - distanceBeetwenEnemy * colls)/2 + 20;

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
				X = width / 2 + 40 / 2,
				Y = height - 40,
				S = 40,
				ReloadTime = 200,
				Speed = 5
			};

			switch (forLevel)
			{
				case 1:
					ship.ReloadTime = 150;
					ship.Speed = 1;
					break;
				case 2:
					ship.ReloadTime = 200;
					ship.Speed = 2;
					break;
				case 3:
					ship.ReloadTime = 250;
					ship.Speed = 3;
					break;
				case 4:
					ship.ReloadTime = 300;
					ship.Speed = 4;
					break;
				case 5:
					ship.ReloadTime = 350;
					ship.Speed = 5;
					break;
				default:
					return ship;
			}

			return ship;
		}
	}
}