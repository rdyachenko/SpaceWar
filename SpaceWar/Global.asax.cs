using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;

namespace SpaceWarService
{
	public class Global : HttpApplication
	{
		protected void Application_Start(object sender, EventArgs e)
		{
			try
			{
				GlobalConfiguration.Configure(WebApiConfig.Register);
			}
			catch (Exception ex)
			{
			}
		}

		protected void Session_Start(object sender, EventArgs e)
		{
		}

		protected void Application_BeginRequest(object sender, EventArgs e)
		{
		}

		protected void Application_AuthenticateRequest(object sender, EventArgs e)
		{
		}

		protected void Application_Error(object sender, EventArgs e)
		{
		}

		protected void Application_EndRequest(object sender, EventArgs e)
		{
		}

		protected void Session_End(object sender, EventArgs e)
		{
		}

		protected void Application_End(object sender, EventArgs e)
		{
		}

		public override void Init()
		{
			PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
			base.Init();
		}

		void MvcApplication_PostAuthenticateRequest(object sender, EventArgs e)
		{
			HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
		}
	}
}