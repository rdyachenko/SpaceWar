using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace SpaceWarService
{
	public class ScoreEngine
	{
		private int score = 0;
		private int enemyKilledScore = int.Parse(ConfigurationManager.AppSettings["EnemyKilledScore"]);
		private int shotScore = int.Parse(ConfigurationManager.AppSettings["ShotScore"]);

		public int Score
		{
			get { return score; }
		}

		public void EnemyKilled()
		{
			score += enemyKilledScore;
		}

		public void Shot()
		{
			score += shotScore;
		}
	}
}