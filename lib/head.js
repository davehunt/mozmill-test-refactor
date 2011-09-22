/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MozMill Test code.
 *
 * The Initial Developer of the Original Code is the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Henrik Skupin <mail@hskupin.info>
 *   Geo Mealer <gmealer@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// Include necessary modules
var assertions = require("api/assertions");
var browser = require("ui/browser");
var driver = require("api/driver");
var places = require("places");
var windows = require("api/windows");

/**
 * @namespace Helper methods for the general setup and teardown logic of tests
 *            and methods
 */
var head = exports;

/**
 * @name module
 * @namespace Augmented features into the Mozmill module scope
 */


/**
 * Basic setup function for tests.
 *
 * @memberOf head
 * @param {object} aModule
 *        Test module to initialize
 * @param {Object} [aFlags={}]
 *        Flags for skipping portions of the teardown process. Use these for tests
 *        that leave state for subsequent tests. (restart tests, primarily)
 * @param {Boolean} [aFlags.skipResetWindows=false]
 *        Skip the closing of windows
 * @param {Boolean} [aFlags.skipRestoreBookmarks=false]
 *        Skip restoring bookmarks to default
 * @param {Boolean} [aFlags.skipClearHistory=false]
 *        Skip clearing page history
 */
function setup(aModule, aFlags) {
  aFlags = aFlags || {};

  /**
   * The Mozmill driver for handling global actions
   *
   * @name driver
   * @type driver
   * @memberOf module
   */
  aModule.driver = driver;

  /**
   * Instance of the Assert class to execute tests with fatal assertions
   *
   * @name assert
   * @type assertions.Assert
   * @memberOf module
   */
  aModule.assert = new assertions.Assert();

  /**
   * Instance of the Expect class to execute tests with non-fatal assertions
   *
   * @name expect
   * @type assertions.Expect
   * @memberOf module
   */
  aModule.expect = new assertions.Expect();

  /**
   * Helper method to get the top-most browser window.
   *
   * @name getBrowserWindow
   * @type browser.getBrowserWindow
   * @memberOf module
   */
  aModule.getBrowserWindow = browser.getBrowserWindow;

  /**
   * Helper method to open a new browser window.
   *
   * @name openBrowserWindow
   * @type browser.openBrowserWindow
   * @memberOf module
   */
  aModule.openBrowserWindow = browser.openBrowserWindow;

  /**
   * Get the default browser window or create a new one.
   */
  aModule.browser = resetToKnownState(aFlags);
}


/**
 * Basic teardown function for tests.
 *
 * @memberOf head
 * @param {object} aModule
 *        Test module to teardown
 * @param {Object} [aFlags={}]
 *        Flags for skipping portions of the teardown process. Use these for tests
 *        that leave state for subsequent tests. (restart tests, primarily)
 * @param {Boolean} [aFlags.skipResetWindows=false]
 *        Skip the closing of windows
 * @param {Boolean} [aFlags.skipRestoreBookmarks=false]
 *        Skip restoring bookmarks to default
 * @param {Boolean} [aFlags.skipClearHistory=false]
 *        Skip clearing page history
 */
function teardown(aModule, aFlags) {
  // Clean-up the open browser window (i.e. modal observer)
  aModule.browser.destroy();

  resetToKnownState(aFlags);
}


/**
 * Reset various browser states to their initial state
 *
 * @param {Object} [aFlags={}]
 *        Flags for skipping portions of the teardown process. Use these for tests
 *        that leave state for subsequent tests. (restart tests, primarily)
 * @param {Boolean} [aFlags.skipResetWindows=false]
 *        Skip the closing of windows
 * @param {Boolean} [aFlags.skipRestoreBookmarks=false]
 *        Skip restoring bookmarks to default
 * @param {Boolean} [aFlags.skipClearHistory=false]
 *        Skip clearing page history
 */
function resetToKnownState(aFlags) {
  aFlags = aFlags || {};

  var win = null;

  // Close all windows
  if (!aFlags.skipResetWindows) {
    windows.resetWindows();
    win = browser.getBrowserWindow();
    win.resetTabs();
  }
  else {
    win = browser.getBrowserWindow();
  }

  // Remove all history
  if (!aFlags.skipClearHistory)
    places.removeAllHistory();

  // Restore the default bookmarks
  if (!aFlags.skipRestoreBookmarks)
    places.restoreDefaultBookmarks();

  return win;
}


// Export of methods
head.setup = setup;
head.teardown = teardown;

head.resetToKnownState= resetToKnownState;
