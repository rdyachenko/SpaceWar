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
	public class SpaceWarController : BaseController
	{
		[ActionName("EnemyPosition")]
		[HttpGet]
		[ResponseType(typeof(Enemy[]))]
		public HttpResponseMessage GetEnemyPosition()
		{
			var enemies = new List<Enemy>();
			var distanceBeetwenEnemy = 1024 / 10;
			var dx = 1;

			for (int j = 0; j < 5; j++)
			{
				for (int i = 0; i < 10; i++)
				{

					enemies.Add(new Enemy
					{
						X = 70 + i * distanceBeetwenEnemy - distanceBeetwenEnemy / 3,
						Y = 70 + j * 30,
						S = 20,
						DX = dx
					});
				}
				dx *= -1;
			}

			return Request.CreateResponse(HttpStatusCode.OK, enemies.ToArray(), "application/json");
		}
	}
}