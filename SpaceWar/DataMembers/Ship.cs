using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SpaceWarService.DataMembers
{
	[DataContract(Name ="ship")]
	public class Ship
	{
		[DataMember(Name = "x", Order = 0)]
		public int X { get; set; }

		[DataMember(Name = "y", Order = 1)]
		public int Y { get; set; }

		[DataMember(Name = "s", Order = 2)]
		public int S { get; set; }

		[DataMember(Name = "speed", Order = 3)]
		public int Speed { get; set; }

		[DataMember(Name = "reloadTime", Order = 4)]
		public int ReloadTime { get; set; }
	}
}