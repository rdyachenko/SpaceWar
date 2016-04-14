using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SpaceWarService.DataMembers
{
	[DataContract(Name = "level")]
	public class LevelConfiguration
	{
		[DataMember(Name = "enemies", Order = 0)]
		public EnemiesGroup Enemies { get; set; }

		[DataMember(Name = "ship", Order = 1)]
		public Ship Ship { get; set; }

		[DataMember(Name = "newGameRequired", Order = 2)]
		public bool NewGameRequired { get; set; }
	}
}