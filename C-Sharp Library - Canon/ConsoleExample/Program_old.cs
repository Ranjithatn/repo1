//using System;
//using System.Collections.Generic;
//using System.Drawing;
//using System.IO;
//using System.Text;
//using System.Threading;
//using EOSDigital.API;
//using EOSDigital.SDK;

//namespace ConsoleExample
//{
//  class Program
//  {
//    static CanonAPI APIHandler;
//    static Camera MainCamera;
//    static string ImageSaveDirectory;
//    static bool Error = false;
//    static ManualResetEvent WaitEvent = new ManualResetEvent(false);

//    static void Main(string[] args)
//    {
//      try
//      {
//        APIHandler = new CanonAPI();
//        List<Camera> cameras = APIHandler.GetCameraList();
//        if (!OpenSession())
//        {
//          Console.WriteLine("No camera found. Please plug in camera");
//          APIHandler.CameraAdded += APIHandler_CameraAdded;
//          //WaitEvent.WaitOne();
//          //WaitEvent.Reset();
//        }

//        if (!Error)
//        {
//          //ImageSaveDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyPictures), "RemotePhoto");
//          //MainCamera.SetSetting(PropertyID.SaveTo, (int)SaveTo.Host);
//          //MainCamera.SetCapacity(4096, int.MaxValue);
//          //Console.WriteLine($"Set image output path to: {ImageSaveDirectory}");

//          //Console.WriteLine("Taking photo with current settings...");
//          //CameraValue tv = TvValues.GetValue(MainCamera.GetInt32Setting(PropertyID.Tv));
//          //if (tv == TvValues.Bulb) MainCamera.TakePhotoBulb(2);
//          //else MainCamera.TakePhoto();
//          MainCamera.StartLiveView();
//          WaitEvent.WaitOne();
//          MainCamera.StopLiveView();

//          if (!Error) Console.WriteLine("Photo taken and saved");
//        }
//      }
//      catch (Exception ex) { Console.WriteLine("Error: " + ex.Message); }
//      finally
//      {
//        MainCamera?.Dispose();
//        APIHandler.Dispose();
//        Console.WriteLine("Good bye! (press any key to close)");
//        Console.ReadKey();
//      }
//    }

//    private static void APIHandler_CameraAdded(CanonAPI sender)
//    {
//      try
//      {
//        Console.WriteLine("Camera added event received");
//        if (!OpenSession()) { Console.WriteLine("Sorry, something went wrong. No camera"); Error = true; }
//      }
//      catch (Exception ex) { Console.WriteLine("Error: " + ex.Message); Error = true; }
//      finally { WaitEvent.Set(); }
//    }

//    private static void MainCamera_DownloadReady(Camera sender, DownloadInfo Info)
//    {
//      try
//      {
//        Console.WriteLine("Starting image download...");
//        //sender.DownloadFile(Info, ImageSaveDirectory);
//        Stream myStream = sender.DownloadFile(Info);
//        using (var ms = new MemoryStream())
//        {
//          myStream.CopyTo(ms);

//          byte[] byteArray = default(byte[]);
//          byteArray = ms.ToArray();

//          String res = Convert.ToBase64String(byteArray);
//          Console.WriteLine(res);

//        }

//      }
//      catch (Exception ex) { Console.WriteLine("Error: " + ex.Message); Error = true; }
//      finally { WaitEvent.Set(); }
//    }

//    private static bool OpenSession()
//    {
//      List<Camera> cameras = APIHandler.GetCameraList();
//      if (cameras.Count > 0)
//      {
//        MainCamera = cameras[0];
//        MainCamera.DownloadReady += MainCamera_DownloadReady;
//        MainCamera.LiveViewUpdated += MainCamera_LiveViewUpdated;
//        MainCamera.OpenSession();
//        Console.WriteLine($"Opened session with camera: {MainCamera.DeviceName}");
//        return true;
//      }
//      else return false;
//    }

//    private static int maxImg = 100;
//    private static void MainCamera_LiveViewUpdated(Camera sender, Stream img)
//    {
//      Console.WriteLine("Received Live Images => " + img.Length.ToString());
//      if (--maxImg != 0)
//      {
//        var bmp = new Bitmap(img);
//        bmp.Save("C:\\temp\\" + maxImg.ToString() + ".bmp");
//      }else
//      {
//        WaitEvent.Set();
//      }
//    }
//  }
//}
