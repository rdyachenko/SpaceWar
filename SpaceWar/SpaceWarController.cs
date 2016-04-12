using SpaceWarService.DataMembers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace SpaceWarService
{
	public class SpaceWarController : ApiController
	{
		private static Dictionary<string, GameEngine> games = new Dictionary<string, GameEngine>();
		private GameEngine gameEngine = null;

		public SpaceWarController()
		{
			var key = HttpContext.Current.Session.SessionID;
			if (games.ContainsKey(key))
			{
				gameEngine = games[key];
			}
			else
			{
				gameEngine = new GameEngine();
				games.Add(key, gameEngine);
			}
		}

		[ActionName("StartGame")]
		[HttpPost]
		public void StartGame(StartGameData data)
		{

		}

		[ActionName("Level")]
		[HttpGet]
		[ResponseType(typeof(LevelConfiguration))]
		public HttpResponseMessage GetEnemyPosition()
		{
			var levelConfiguration = new LevelConfiguration();

			levelConfiguration.Enemies = new EnemiesGroup();
			levelConfiguration.Enemies.Enemies = gameEngine.Level.GetEnemiesForLevel(gameEngine.Level.CurrentLevel + 1);
			levelConfiguration.Enemies.Speed = gameEngine.Level.EnemiesSpeed;

			levelConfiguration.Ship = gameEngine.Level.GetShipProperties(gameEngine.Level.CurrentLevel);

			return Request.CreateResponse(HttpStatusCode.OK, levelConfiguration, "application/json");
		}

		[ActionName("Shot")]
		[HttpPost]
		public void Shot()
		{
			gameEngine.Score.Shot();
		}

		[ActionName("EnemyKilled")]
		[HttpPost]
		public void EnemyKilled()
		{
			gameEngine.Score.EnemyKilled();
		}

		[ActionName("Score")]
		[HttpGet]
		[ResponseType(typeof(Score))]
		public HttpResponseMessage GetScore()
		{
			return Request.CreateResponse(HttpStatusCode.OK, new Score()
			{
				ScoreCount = gameEngine.Score.Score,
				Level = gameEngine.Level.CurrentLevel
			}, "application/json");
		}
	}
}