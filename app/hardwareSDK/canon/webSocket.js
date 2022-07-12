let ws;
let onImageData = null;

export function disconnectWebSocket() {
    if (ws) {
        ws.close();
    }
}

export function connectSocketServer(onData, onError) {

    if (typeof onData === "function") {
        onImageData = onData;
    }

    try {
        var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

        if (support == null) {
            return "Your browser cannot support WebSocket!";
        }

        // create a new websocket and connect
        ws = new window[support]('ws://localhost:8181/');
        // new WebSocket
        ws.binaryType = "arraybuffer";

        console.log("WS", ws)

        // when data is comming from the server, this metod is called
        ws.onmessage = function (evt) {
            console.log("ws.onmessage", evt);
            console.log("getting canon data, Image length is (should be 180000++) ", evt.data.length);
            if (evt.data) {
                onImageData(convertData(evt.data));
            }
        };

        // when the connection is established, this method is called
        ws.onopen = function () {
            console.log('Web Socket Connection open');
        };

        // when the connection is closed, this method is called
        ws.onclose = function () {
            console.log('Web Socket Connection closed');
        }

        ws.onerror = function() {
            onError("WebSocket error occoured");
        }
    } catch (err) {
        console.error("websocket error", err);
        onError(err);
    }
}

function convertData(data) {
    var bytes = new Uint8Array(data);
    var binary = "";
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return "data:image/png;base64,"+window.btoa( binary );
}