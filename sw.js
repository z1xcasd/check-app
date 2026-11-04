// à¹€à¸à¹‡à¸šà¹„à¸Ÿà¸¥à¹Œà¸«à¸™à¹‰à¸²à¹à¸­à¸›à¹„à¸§à¹‰à¹ƒà¸™à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡ à¹€à¸›à¸´à¸”à¹„à¸”à¹‰à¸—à¸±à¸™à¸—à¸µà¹à¸¡à¹‰à¸ªà¸±à¸à¸à¸²à¸“à¸Šà¹‰à¸² (à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¸–à¹€à¸à¹‡à¸šà¹à¸¢à¸à¹ƒà¸™à¹à¸­à¸›)
// à¸–à¹‰à¸²à¹à¸à¹‰à¹„à¸Ÿà¸¥à¹Œà¹à¸­à¸› à¹ƒà¸«à¹‰à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹€à¸¥à¸‚ v1 à¹€à¸›à¹‡à¸™ v2, v3 ... à¹€à¸žà¸·à¹ˆà¸­à¸šà¸±à¸‡à¸„à¸±à¸šà¹ƒà¸«à¹‰à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¹‚à¸«à¸¥à¸”à¹„à¸Ÿà¸¥à¹Œà¹ƒà¸«à¸¡à¹ˆ
var CACHE = 'cc-v15';
var FILES = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¸–/à¸£à¸¹à¸›à¹„à¸›à¹€à¸„à¸£à¸·à¸­à¸‚à¹ˆà¸²à¸¢à¸•à¸£à¸‡ à¹†
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (r) {
        if (r && r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return r;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
