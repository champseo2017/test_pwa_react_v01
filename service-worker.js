/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
"use strict";

var precacheConfig = [
  ["index.html", "02260ea34616e840a702ebd0e592ce75"],
  ["manifest.json", "730915ec2725cf6721080a6516b23f15"],
  ["static/css/main.f0a8b0f4.css", "2eeebfe3576cfbdfa659351ec7e8942a"],
  ["static/js/main.86a97c4d.js", "db85ee531981339362c621e28b641a9b"],
  ["static/media/electron.47605f91.png", "47605f917c1455875be53b1eb5e3a740"],
  ["static/media/hero.b821365d.png", "b821365da1bf5f2b41c0a8ff863c77f1"],
  [
    "static/media/icon-designer.6e024dee.svg",
    "6e024deec44cefc7a8b49aca263e72fd"
  ],
  [
    "static/media/icon-frontend.5f379fd2.svg",
    "5f379fd2aa9c44f384b3e1799ff361fb"
  ],
  ["static/media/icon-mentor.05b2455d.svg", "05b2455d22e33a66812c371773eae91f"],
  ["static/media/js.07bbd95d.png", "07bbd95d47f045f0d0e5343f696a0a47"],
  ["static/media/mf-avatar.91fba148.svg", "91fba148f15f35c06d6195f6ed1050f1"],
  [
    "static/media/mf-logo-white.685eb1bc.svg",
    "685eb1bc3b5edb57babc32cd111fb327"
  ],
  ["static/media/mf-logo.28ca71ea.svg", "28ca71eae166ad882e62fa0c6f73da3f"],
  ["static/media/native.d8488771.png", "d848877173622db145ba3a3971a370af"],
  ["static/media/p_logo.e2eec836.png", "e2eec836b7102f14663a4e3b1806700e"],
  ["static/media/p_logo1.6279a373.png", "6279a373c6009ea2882b4ed13eaa45eb"],
  ["static/media/p_logo2.04557288.png", "0455728822ca9df6a7735feb2ab6e634"],
  [
    "static/media/pascal-avatar.1a22c9de.png",
    "1a22c9deee7b130f2842f4456dabc8c2"
  ],
  [
    "static/media/project-chronicled3.b4a2cc93.jpeg",
    "b4a2cc93299da0349cb209f106db3ea9"
  ],
  [
    "static/media/project-chronicled4.a470aa7b.jpeg",
    "a470aa7b3e164bb79cf207041fd8961c"
  ],
  [
    "static/media/project-chronicled5.538e409c.jpeg",
    "538e409c1ec85befceb48e03395c9160"
  ],
  [
    "static/media/project-chronicled8.303b7a08.jpeg",
    "303b7a08b077b1ac0c501b67f3d7317c"
  ],
  ["static/media/vuejs.2a34afee.png", "2a34afee9e2121c7b0ad91138a0bd332"],
  ["static/media/web.9ca1f228.png", "9ca1f228fefe8876f102fb36f1928534"]
];
var cacheName =
  "sw-precache-v3-sw-precache-" +
  (this.registration ? this.registration.scope : "");

var ignoreUrlParametersMatching = [/^utm_/];

var addDirectoryIndex = function(originalUrl, index) {
  var url = new URL(originalUrl);
  if (url.pathname.slice(-1) === "/") {
    url.pathname += index;
  }
  return url.toString();
};

var cleanResponse = function(originalResponse) {
  // If this is not a redirected response, then we don't have to do anything.
  if (!originalResponse.redirected) {
    return Promise.resolve(originalResponse);
  }

  // Firefox 50 and below doesn't support the Response.body stream, so we may
  // need to read the entire body to memory as a Blob.
  var bodyPromise =
    "body" in originalResponse
      ? Promise.resolve(originalResponse.body)
      : originalResponse.blob();

  return bodyPromise.then(function(body) {
    // new Response() is happy when passed either a stream or a Blob.
    return new Response(body, {
      headers: originalResponse.headers,
      status: originalResponse.status,
      statusText: originalResponse.statusText
    });
  });
};

var createCacheKey = function(
  originalUrl,
  paramName,
  paramValue,
  dontCacheBustUrlsMatching
) {
  // Create a new URL object to avoid modifying originalUrl.
  var url = new URL(originalUrl);

  // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
  // then add in the extra cache-busting URL parameter.
  if (
    !dontCacheBustUrlsMatching ||
    !url.pathname.match(dontCacheBustUrlsMatching)
  ) {
    url.search +=
      (url.search ? "&" : "") +
      encodeURIComponent(paramName) +
      "=" +
      encodeURIComponent(paramValue);
  }

  return url.toString();
};

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
  // If the whitelist is empty, then consider all URLs to be whitelisted.
  if (whitelist.length === 0) {
    return true;
  }

  // Otherwise compare each path regex to the path of the URL passed in.
  var path = new URL(absoluteUrlString).pathname;
  return whitelist.some(function(whitelistedPathRegex) {
    return path.match(whitelistedPathRegex);
  });
};

var stripIgnoredUrlParameters = function(
  originalUrl,
  ignoreUrlParametersMatching
) {
  var url = new URL(originalUrl);
  // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
  url.hash = "";

  url.search = url.search
    .slice(1) // Exclude initial '?'
    .split("&") // Split into an array of 'key=value' strings
    .map(function(kv) {
      return kv.split("="); // Split each 'key=value' string into a [key, value] array
    })
    .filter(function(kv) {
      return ignoreUrlParametersMatching.every(function(ignoredRegex) {
        return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
      });
    })
    .map(function(kv) {
      return kv.join("="); // Join each [key, value] array into a 'key=value' string
    })
    .join("&"); // Join the array of 'key=value' strings into a string with '&' in between each

  return url.toString();
};

var hashParamName = "_sw-precache";
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, this.location);
    var cacheKey = createCacheKey(
      absoluteUrl,
      hashParamName,
      hash,
      /\.\w{8}\./
    );
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache
    .keys()
    .then(function(requests) {
      return requests.map(function(request) {
        return request.url;
      });
    })
    .then(function(urls) {
      return new Set(urls);
    });
}

this.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
        return setOfCachedUrls(cache).then(function(cachedUrls) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
              // If we don't have a key matching url in the cache already, add it.
              if (!cachedUrls.has(cacheKey)) {
                var request = new Request(cacheKey, {
                  credentials: "same-origin"
                });
                return fetch(request).then(function(response) {
                  // Bail out of installation unless we get back a 200 OK for
                  // every request.
                  if (!response.ok) {
                    throw new Error(
                      "Request for " +
                        cacheKey +
                        " returned a " +
                        "response with status " +
                        response.status
                    );
                  }

                  return cleanResponse(response).then(function(
                    responseToCache
                  ) {
                    return cache.put(cacheKey, responseToCache);
                  });
                });
              }
            })
          );
        });
      })
      .then(function() {
        // Force the SW to transition from installing -> active state
        return this.skipWaiting();
      })
  );
});

this.addEventListener("activate", function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
        return cache.keys().then(function(existingRequests) {
          return Promise.all(
            existingRequests.map(function(existingRequest) {
              if (!setOfExpectedUrls.has(existingRequest.url)) {
                return cache.delete(existingRequest);
              }
            })
          );
        });
      })
      .then(function() {
        return this.clients.claim();
      })
  );
});

this.addEventListener("fetch", function(event) {
  if (event.request.method === "GET") {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(
      event.request.url,
      ignoreUrlParametersMatching
    );
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = "index.html";
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = "";
    if (
      !shouldRespond &&
      navigateFallback &&
      event.request.mode === "navigate" &&
      isPathWhitelisted([], event.request.url)
    ) {
      url = new URL(navigateFallback, this.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches
          .open(cacheName)
          .then(function(cache) {
            return cache
              .match(urlsToCacheKeys.get(url))
              .then(function(response) {
                if (response) {
                  return response;
                }
                throw Error(
                  "The cached response that was expected is missing."
                );
              });
          })
          .catch(function(e) {
            // Fall back to just fetch()ing the request if some unexpected error
            // prevented the cached response from being valid.
            console.warn(
              'Couldn\'t serve response for "%s" from cache: %O',
              event.request.url,
              e
            );
            return fetch(event.request);
          })
      );
    }
  }
});
