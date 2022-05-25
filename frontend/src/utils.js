function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

function toPost(type, url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(type, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data);
  xhr.onreadystatechange = function() {
    if (this.status === 200 && this.readyState === 4) {
      callback(JSON.parse(xhr.responseText));
    }
  };
}

export { toDataUrl, toPost };