using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SpaceWarService.DataMembers
{
	[DataContract(Name = "score")]
	public class Score
	{
		[DataMember(Name = "scoreCount", Order = 0)]
		public int ScoreCount { get; set; }

		[DataMember(Name = "level", Order = 0)]
		public int Level { get; set; }
	}
}