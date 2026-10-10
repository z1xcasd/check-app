// เก็บไฟล์หน้าแอปไว้ในเครื่อง เปิดได้ทันทีแม้สัญญาณช้า (ข้อมูลรถเก็บแยกในแอป)
// ถ้าแก้ไฟล์แอป ให้เปลี่ยนเลข v1 เป็น v2, v3 ... เพื่อบังคับให้เครื่องโหลดไฟล์ใหม่
var CACHE = 'cc-v7';
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
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // ข้อมูลรถ/รูปไปเครือข่ายตรง ๆ
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
