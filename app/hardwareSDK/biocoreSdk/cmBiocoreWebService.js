module.exports = {
  BioCoreWebService: function(server) {
    //<editor-fold defaultstate="collapsed" desc="private class members">
    var self = this;
    var _server = server;
    var _session = "";
    var _keepAlive = false;
    var _lastStatus = new Date();
    var _lastPreview = new Date();
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="private ajax support methods">
    var _getAjaxObject = function(url, method, callback, contentType) {
      try {
        // if (
        //   // navigator.appName == "Microsoft Internet Explorer" &&
        //   // top.location.protocol != "file:"
        // ) {
        //   var xDomain = new XDomainRequest();
        //   if (callback != null) {
        //     xDomain.onload = function() {
        //       callback(xDomain);
        //     };
        //   }
        //   xDomain.open(method, url);
        //   return xDomain;
        // } else {
          var xmlHttp = new XMLHttpRequest();
          if (callback != null) {
            xmlHttp.onreadystatechange = function() {
              callback(xmlHttp);
            };
          // }
          xmlHttp.open(method, url, true);
          if (contentType != null) {
            xmlHttp.setRequestHeader("Content-type", contentType);
          }
          return xmlHttp;
        }
      } catch (e) {
        console.error(e);
      }
    };
    var _postRequest = function(path, query, content) {
      var method = content.length > 0 ? "POST" : "GET";
      var uri = query.length > 0 ? _server + path + "?" + query : _server + path;
      var ajax = _getAjaxObject(
        uri,
        method,
        _onResponse,
        "text/json; charset=utf-8"
      );
      try {
        console.group();
        console.log(method);
        console.log(uri);
        console.log(content);
        console.groupEnd();
        ajax.send(content);
      } catch (e) {
        console.error(e);
      }
    };
    var _getResponse = function(ajax) {
      try {
        // if (
        //   navigator.appName == "Microsoft Internet Explorer" &&
        //   top.location.protocol != "file:"
        // ) {
        //   return ajax.responseText;
        // } else
        if (ajax.readyState === 4 && ajax.status === 200) {
          return ajax.responseText;
        }
        return null;
      } catch (e) {
        console.error(e);
      }
    };
    var _onResponse = function(ajax) {
      var rsp = _getResponse(ajax);
      if (rsp != null && rsp.length > 0) {
        var arr = JSON.parse(rsp);
        if (arr != null) {
          if (arr.SessionId != null) {
            _session = arr.SessionId;
          } else if (arr.Status != null) {
            _onQueryStatus(arr);
          } else if (arr.Preview != null) {
            _onQueryPreview(arr);
          } else if (arr.ExceptionData != null) {
            self.onException(arr.ExceptionData);
          } else if (arr.EnvironmentData != null) {
            self.onEnvironment(arr.EnvironmentData);
          } else if (arr.WorkflowName != null) {
            self.onRegisterWorkflow(arr.WorkflowName);
          } else if (
            arr.WorkflowList != null &&
            arr.WorkflowList.WorkflowName != null
          ) {
            self.onQueryWorkflow(arr.WorkflowList.WorkflowName);
          } else if (arr.Annotations != null) {
            self.onAnnotations(arr.Annotations);
          } else if (arr.PersonData != null) {
            self.onPersonData(arr.PersonData);
          } else if (arr.SessionLog != null) {
            self.onSessionLog(arr.SessionLog);
          } else if (arr.CollectionStatus != null) {
            self.onCollectionStatus(arr.CollectionStatus);
          } else {
            return arr;
          }
        }
      }
      return null;
    };
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="private class initialization">
    var _init = function() {
      _doQueryStatus(0);
      _doQueryPreview(0);
    };
    var _recoverPreview = function() {
      if (_lastStatus.getTime() - _lastPreview.getTime() > 15000) {
        // preview seem too old restart it
        _doQueryPreview(0);
      }
    };
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="private status query loop">
    var _doQueryStatus = function(timeout) {
      var path = "/status/query/json";
      var content = '{"TimeOutSec":' + timeout + "}";
      // max 10 requests per second
      window.setTimeout(function() {
        if (!_session && !_keepAlive) return;
        _postRequest(path, _session, content);
      }, 100);
    };
    var _onQueryStatus = function(arr) {
      try {
        _lastStatus = new Date();
        _recoverPreview();
        arr.Status["StatusUpdate"] = _lastStatus.toLocaleString();
        arr.Status["PreviewUpdate"] = _lastPreview.toLocaleString();
        self.onStatusChanged(arr.Status);
        if (arr.Status.UserRequest != null) {
          self.onUserRequest(arr.Status.UserRequest);
        }
      } catch (e) {
        console.error(e);
      }
      _doQueryStatus(5);
    };
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="private preview query loop">
    var _doQueryPreview = function(timeout) {
      // console.log("DOING QUERy PREVIEW");
      var path = "/preview/query/json";
      var content = '{"TimeOutSec":' + timeout + "}";
      // max 10 requests per second
      window.setTimeout(function() {
        if (!_session) return;
        _postRequest(path, _session, content);
      }, 100);
    };
    var _onQueryPreview = function(arr) {
      try {
        _lastPreview = new Date();
        var imgObj = self.onPreviewChanged(arr.Preview);
        if (imgObj != null) {
          if (arr.Preview.Image != null) {
            imgObj.onload = imgObj.onabort = imgObj.onerror = function() {
              _doQueryPreview(5);
            };
            imgObj.src = arr.Preview.Image.ImageUri + _session;
            // return here, preview query will restart async by imgObj
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      _doQueryPreview(5);
    };
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="private reading json files">
    var _readServerFile = function(name) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", name, false);
      xmlHttp.send(null);
      if (xmlHttp.status !== 200) {
        console.error(xmlHttp.responseText);
      }
      return xmlHttp.responseText;
    };
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="public methods">
    this.hasSessionId = function() {
      return _session !== "";
    };
    this.getSessionId = function() {
      return _session;
    };
    this.setSession = function(session) {
      _session = session;
      console.info('session SET IN CMBWS:', _session);
    };
    this.setKeepAlive = function(keepAlive) {
      _keepAlive = keepAlive;
    }
    this.queryEnvironment = function() {
      var path = "/environment/query/json";
      _postRequest(path, "", "");
    };
    this.registerWorkflow = function(cfg) {
      var json = _readServerFile(cfg);
      var path = "/workflow/register/json";
      _postRequest(path, "", json);
    };
    this.queryWorkflow = function() {
      var path = "/workflow/query/json";
      _postRequest(path, "", "");
    };
    this.queryCollectionStatus = function() {
      var path = "/collection/query/json";
      _postRequest(path, _session, "");
    };
    this.startCollection = function(name) {
      var path = "/collection/start/json";
      var json = '{"WorkflowName":"' + name + '"}';
      _postRequest(path, _session, json);
    };
    this.updateCollection = function(name) {
      //var json = _readServerFile(cfg);
      var path = "/collection/update/json";
      var json = '{"WorkflowName":"' + name + '"}';
      _postRequest(path, _session, json);
    };
    this.jumpCollection = function(step) {
      var path = "/collection/jump/json";
      _postRequest(path, _session, step);
    };
    this.stopCollection = function() {
      var path = "/collection/stop/json";
      _postRequest(path, _session, "");
    };
    this.resetCollection = function() {
      var path = "/collection/reset/json";
      _postRequest(path, _session, "");
    };
    this.deleteCollection = function(id) {
      var path = "/collection/delete/json";
      var json = '{"Uuid":"' + id + '"}';
      _postRequest(path, _session, json);
    };
    this.forceCollection = function() {
      var path = "/collection/force/json";
      _postRequest(path, _session, "");
    };
    this.userResponse = function(choice) {
      var path = "/collection/interact/json";
      var json = '{"UserResponse":"' + choice + '"}';
      _postRequest(path, _session, json);
    };
    this.getAnnotations = function() {
      var path = "/collection/annotation/json";
      _postRequest(path, _session, "");
    };
    this.setAnnotations = function(annotation) {
      var path = "/collection/annotation/json";
      var json = '{"Annotations":{"Annotation":[' + annotation + "]}}";
      _postRequest(path, _session, json);
    };
    this.downloadPersonData = function() {
      if (!(_session === undefined || _session === "")) {
        var path = "/collection/person/json";
        _postRequest(path, _session, "");
      }
    };
    this.uploadPersonData = function(json) {
      var path = "/collection/person/json";
      _postRequest(path, _session, json);
    };
    this.querySessionLog = function() {
      var path = "/collection/log/json";
      _postRequest(path, _session, "");
    };
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="public events">
    this.onException = function(error) {};
    this.onStatusChanged = function(status) {};
    this.onPreviewChanged = function(preview) {};
    this.onEnvironment = function(env) {};
    this.onRegisterWorkflow = function(name) {};
    this.onQueryWorkflow = function(names) {};
    this.onUserRequest = function(request) {};
    this.onAnnotations = function(data) {};
    this.onPersonData = function(data) {};
    this.onSessionLog = function(data) {};
    this.onCollectionStatus = function(data) {};
    this.init = _init;
    //</editor-fold>
    // _init();
  }
};
