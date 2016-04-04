using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SpaceWarService.DataMembers
{
	[DataContract(Name = "startGameData")]
	public class StartGameData
	{
		[DataMember(Name = "someData", Order = 0)]
		public int SomeData { get; set; }
	}
}