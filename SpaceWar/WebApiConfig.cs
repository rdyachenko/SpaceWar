using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace SpaceWarService
{
	public class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			config.Routes.MapHttpRoute(
				name: "SpaceWarAPI",
				routeTemplate: "api/{controller}/{action}",
				defaults: new { controller = "SpaceWar"});
		}
	}
}