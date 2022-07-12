using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading;
using EOSDigital.API;
using EOSDigital.SDK;

namespace ConsoleExample
{
  class Program
  {
    static void Main(string[] args)
    {
      UCW_Canon_Lib.UcwCanonWrapper canon = new UCW_Canon_Lib.UcwCanonWrapper();
      var img = canon.Capture("liveview").Result;
      Console.ReadLine();
      Console.WriteLine(canon.Capture("liveview").Result);
      Console.ReadLine();
      Console.WriteLine(canon.Capture("stopliveview").Result);
      Console.ReadLine();
      Console.WriteLine(((String)canon.Capture("capture").Result).Length);
      Console.ReadLine();
      Console.WriteLine(canon.Capture("liveview").Result);
      Console.ReadLine();
      Console.WriteLine(canon.Capture("liveview").Result);
      Console.ReadLine();
      Console.WriteLine(canon.Capture("liveview").Result);
      Console.ReadLine();
      Console.WriteLine(canon.Capture("dispose").Result);
      Console.ReadLine();
    }
  }
}
