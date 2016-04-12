using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceWarService
{
	public class GameEngine
	{
		private ScoreEngine score = null;
		private LevelEngine level = null;

		public ScoreEngine Score
		{
			get
			{
				if (score == null)
					score = new ScoreEngine();
				return score;
			}
		}

		public LevelEngine Level
		{
			get
			{
				if (level == null)
					level = new LevelEngine();
				return level;
			}
		}
		
		public void PlayerMakeShot()
		{

		}
	}
}