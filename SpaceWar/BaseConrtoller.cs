using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace SpaceWarService
{
	public abstract class BaseController : ApiController
	{
		protected void ValidateMissingRequestBody(object data)
		{
			if (data == null)
				throw new Exception("Request body is missing.");
		}
	}
}