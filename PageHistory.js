'use strict';

import Sefaria from './sefaria';

export class PageHistory {

  constructor() {
    this._backStack = [];
    this._backStackMain = [];
  }

  forward = ({ state, type = "main", calledFrom }) => {
    const stateClone = Sefaria.util.clone(state);
    this._backStack.push({ type, state: stateClone, calledFrom });
    this._updateMainBackStack();
  }

  back = ({ type, calledFrom } = { }) => {
    const bs = this._backStack;
    let oldStateObj = bs.pop();
    if (!oldStateObj) { return oldStateObj; }

    if (type === "main") {
      while (oldStateObj.type !== "main" && bs.length > 0) {
        oldStateObj = bs.pop();
      }
    }
    else if (calledFrom === "toc") {
      // look ahead one
      while (oldStateObj.calledFrom === "toc" && bs.length > 0 && bs[bs.length - 1].calledFrom === "toc") {
        oldStateObj = bs.pop();
      }
    }
    this._updateMainBackStack();
    if (!oldStateObj) { return oldStateObj; }
    return oldStateObj.state;
  }

  peek = () => {
    const bs = this._backStack;
    if (bs.length === 0) {
      return;
    }
    return bs[bs.length-1];
  }

  _updateMainBackStack = () => {
    this._backStackMain = this._backStack.filter( s => s.type === 'main' );
  }
}

export class TabHistory {
  /**
   * Composes PageHistory and exposes functionality to control history by tab
   */

  constructor() {
    this._historyByTab = TabHistory._initializeHistoryByTab();
  }

  forward = ({ tab, ...args }) => {
    this._historyByTab[tab].forward({ ...args });
  };

  back = ({ tab, ...args }) => {
    return this._historyByTab[tab].back({ ...args });
  };

  peek = ({ tab, ...args }) => {
    return this._historyByTab[tab].peek({ ...args });
  };

  static _initializeHistoryByTab() {
    return TabMetadata.names().reduce((historyByTab, curr) => {
      historyByTab[curr] = new PageHistory();
      return historyByTab;
    }, {});
  }
}

export class TabMetadata {
  static _tabData = [
    {name: "Texts", icon: "book", menu: "navigation" },
    {name: "Topics", icon: "hashtag", menu: "topic toc"},
    {name: "Search", icon: "search", menu: "autocomplete"},
    {name: "Saved", icon: "bookmark", menu: "history"},
    {name: "Account", icon: "profile", menu: "account"},
  ];

  static names() {
    return TabMetadata._tabData.map(tabDatum => tabDatum.name);
  }

  static namesWithIcons() {
    return TabMetadata._tabData;
  }

  static initialTabName() {
    return TabMetadata._tabData[0].name;
  }
}
