using EOSDigital.API;
using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using EOSDigital.SDK;
using Newtonsoft.Json;
using System.Drawing;
using Fleck;
using System.Drawing.Imaging;

namespace UCW_Canon_Lib
{
  public class UcwCanonWrapper : IDisposable
  {
    CanonAPI APIHandler;
    Camera MainCamera;
    bool Error = false;
    ManualResetEvent WaitEvent = new ManualResetEvent(false);
    Response response = new Response();
    WebSocketServer server;
    IWebSocketConnection client;
    BlockingCollection<Bitmap> liveStreams = null;

    public UcwCanonWrapper()
    {
      APIHandler = new CanonAPI();
      Console.WriteLine("APIHandler initialised");
    }

    public async Task<object> Capture(object requestObj)
    {
      response = new Response();
      response.Error = false;
      var opt = (string)requestObj;
      switch (opt)
      {
        case "capture":
          return await captureFromCannon();
        case "liveview":
          return await liveview();
        case "stopliveview":
          return await stopliveview();
        case "dispose":
          return await dispose();
      }
      return "Not valid input";
    }

    private async Task<String> dispose()
    {
      return await Task.Run(() =>
      {
        Dispose();

        response.Error = false;
        response.ErrorDetail = null;
        return JsonConvert.SerializeObject(response);
      });
    }

    public void Dispose()
    {
      try
      {
        //MainCamera?.Dispose();
        APIHandler?.Dispose();
        Console.WriteLine("APIHandler disposed");
      }
      catch (Exception e)
      {
        Console.WriteLine("Exception in Dispose " + e.Message);
      }
    }

    private async Task<String> stopliveview()
    {
      return await Task.Run(() =>
      {
        try
        {
          if (MainCamera.IsLiveViewOn)
          {
            liveStreams.CompleteAdding();
            MainCamera.StopLiveView();
            WaitEvent.WaitOne();
            WaitEvent.Reset();
          }
          if (server != null)
          {
            server.Dispose();
          }
        }
        catch (Exception exc)
        {
          response.Error = true;
          response.ErrorDetail = exc.Message;
          return JsonConvert.SerializeObject(response);
        }
        finally
        {
          CloseSession();
        }
        response.Error = false;
        response.ErrorDetail = null;
        return JsonConvert.SerializeObject(response);
      });
    }

    private async Task<string> liveview()
    {
      if (server != null)
      {
        await stopliveview();
      }
      List<Camera> cameras = APIHandler.GetCameraList();
      if (cameras.Count > 0)
      {
        response = new Response();
        return await Task.Run(() =>
        {
          try
          {
            Task.Factory.StartNew(() =>
            {
              liveStreams = new BlockingCollection<Bitmap>();
              foreach (var bmp in liveStreams.GetConsumingEnumerable())
              {
                if (client != null && client.IsAvailable)
                {
                  Image img = null;
                  using (MemoryStream ms = new MemoryStream())
                  {
                    img = bmp.GetThumbnailImage(320, 240, () => { return true; }, IntPtr.Zero);
                    img.Save(ms, ImageFormat.Png);
                    //Console.WriteLine("Sending -> " + ms.Length);
                    client.Send(ms.GetBuffer());
                  }
                }
              }
            });
          }
          catch (Exception exc)
          {
            Console.WriteLine("Exception in livestream " + exc.Message);
            response.Error = true;
            response.ErrorDetail = exc.Message;
            return JsonConvert.SerializeObject(response);
          }

          try
          {
            server = new WebSocketServer("ws://0.0.0.0:8181");
            server.Start((socket) =>
            {
              socket.OnOpen = () => { client = socket; };
              socket.OnClose = () => { client = null; };
            });
          }
          catch (Exception exc)
          {
            Console.WriteLine("Exception starting web socket: " + exc.Message);
            response.Error = true;
            response.ErrorDetail = exc.Message;
            return JsonConvert.SerializeObject(response);
          }

          try
          {
            if (OpenSession())
            {
              MainCamera.StartLiveView();
              response.Error = false;
            }
            else
            {
              response.Error = true;
              response.ErrorDetail = "No Camera Connected";

            }
          }
          catch (Exception ex)
          {
            Console.WriteLine("Exception opening session: " + ex.Message);
            response.Error = true;
            response.ErrorDetail = ex.Message;
            return JsonConvert.SerializeObject(response);
          }
          response.Error = false;
          return JsonConvert.SerializeObject(response);

        });
      }
      Console.WriteLine("No Camera Connected");
      response.Error = false;
      response.ErrorDetail = "No Camera Connected";
      return JsonConvert.SerializeObject(response);
    }

    private async Task<string> captureFromCannon()
    {
      response = new Response();
      return await Task.Run(() =>
      {
        if (OpenSession())
        {
          try
          {
            //Console.WriteLine("Taking photo with current settings...");
            CameraValue tv = TvValues.GetValue(MainCamera.GetInt32Setting(PropertyID.Tv));
            if (tv == TvValues.Bulb) MainCamera.TakePhotoBulb(30);
            else MainCamera.TakePhoto();

            WaitEvent.WaitOne();

            if (!Error) Console.WriteLine("Photo captured and returned");

          }
          catch (Exception ex)
          {
            Console.WriteLine("Exception during capture: " + ex.Message);
            response.Error = true;
            response.ErrorDetail = ex.Message;
          }
          finally
          {
            CloseSession();
            WaitEvent.Reset();
          }
        }
        else
        {
          response.Error = true;
          response.ErrorDetail = "No Camera Connected";
        }
        return JsonConvert.SerializeObject(response);
      });

    }

    private void MainCamera_DownloadReady(Camera sender, DownloadInfo Info)
    {
      try
      {
        //Console.WriteLine("Starting image download...");
        Stream myStream = sender.DownloadFile(Info);
        //sender.DownloadFile(Info, "C:\\canon");
        using (var ms = new MemoryStream())
        {
          myStream.CopyTo(ms);

          byte[] byteArray = default(byte[]);
          byteArray = ms.ToArray();

          response.ImageData = Convert.ToBase64String(byteArray);
        }
      }
      catch (Exception ex)
      {
        Console.WriteLine("Error: " + ex.Message);
        Error = true;
        response.Error = true;
        response.ErrorDetail = ex.Message;
      }
      finally { WaitEvent.Set(); }
    }

    private void MainCamera_LiveViewStopped(Camera sender)
    {
      WaitEvent.Set();
    }

    static int count = 0;
    private void MainCamera_LiveViewUpdated(Camera sender, Stream img)
    {
      //Console.WriteLine("Received live image => " + img.Length.ToString());
      try
      {
        if (++count % 3 == 0)
        {
          count = 0;
          liveStreams.TryAdd(new Bitmap(img));
        }
      }
      catch (Exception exc)
      {
        Console.WriteLine("Exception in MainCamera_LiveViewUpdated " + exc.Message);
      }
    }

    private bool OpenSession()
    {
      List<Camera> cameras = APIHandler.GetCameraList();
      if (cameras.Count > 0)
      {
        MainCamera = cameras[0];
        MainCamera.OpenSession();
        MainCamera.DownloadReady += MainCamera_DownloadReady;
        MainCamera.LiveViewUpdated += MainCamera_LiveViewUpdated;
        MainCamera.LiveViewStopped += MainCamera_LiveViewStopped;
        MainCamera.SetSetting(PropertyID.SaveTo, (int)SaveTo.Host);
        MainCamera.SetCapacity(4096, int.MaxValue);
        Console.WriteLine($"Opened session with camera: {MainCamera.DeviceName}");
        Thread.Sleep(1000);
        return true;
      }
      else return false;
    }

    private void CloseSession()
    {
      try
      {
        MainCamera?.Dispose();
        Console.WriteLine("MainCamera disposed");
      }
      catch (Exception e)
      {
        Console.WriteLine("Exception in CloseSession " + e.Message);
      }

    }
  }
}
