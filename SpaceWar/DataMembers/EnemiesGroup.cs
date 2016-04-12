using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SpaceWarService.DataMembers
{
	[DataContract(Name = "enemies")]
	public class EnemiesGroup
	{
		[DataMember(Name = "enemies", Order = 0)]
		public Enemy[] Enemies { get; set; }

		[DataMember(Name = "speed", Order = 1)]
		public int Speed{ get; set; }
	}
}