/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true, esnext:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, dump:true */

"use strict";

var Etherpad = require('./etherpad').Etherpad;
var etherpad = new Etherpad('urlbar-quotes');
var prefs = require('simple-prefs');
var Request = require('sdk/request').Request;
var tabs = require('tabs');
var winutils = require('window/utils');

etherpad.setDefaults([
  'people call me a feminist whenever I express sentiments that differentiate me from a door mat -Rebecca West',
  'The thing women have yet to learn is nobody gives you power. You just take it. -Roseanne Barr',
  'You don’t have to be anti-man to be pro-woman. -Jane Galvin Lewis',
  'What, do you think that feminism means you hate men? -Cyndi Lauper',
  'Remember no one can make you feel inferior without your consent. -Eleanor Roosevelt'
]);

var tabActivate = function (tab) {
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = etherpad.getItem(tab.id);
};

var run = function () {
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = etherpad.getItem(0);
  etherpad.loadPlaceholders();
  tabs.on('activate', tabActivate);
  tabActivate(tabs.activeTab);
};

var stop = function () {
  tabs.removeListener('activate', tabActivate);
  var window = winutils.getMostRecentBrowserWindow();
  window.gURLBar.placeholder = 'Search or enter address';
};

var listener = function (prefName) {
  if (prefs.prefs.urlbar) {
    run();
  } else {
    stop();
  }
};

exports.load = function () {
  prefs.on('urlbar', listener);
  listener('urlbar');
};

exports.unload = function () {
  prefs.removeListener('urlbar', listener);
};
