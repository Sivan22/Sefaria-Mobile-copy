'use strict';

import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import ReaderDisplayOptionsMenu from './ReaderDisplayOptionsMenu';
import styles from './Styles.js';
import {
  MenuButton,
  DirectedButton,
  DisplaySettingsButton,
  CategoryAttribution
} from './Misc.js';

class ReaderControls extends React.Component {
  static propTypes = {
    theme:                           PropTypes.object,
    enRef:                           PropTypes.string,
    heRef:                           PropTypes.string,
    language:                        PropTypes.string,
    categories:                      PropTypes.array,
    openNav:                         PropTypes.func,
    openTextToc:                     PropTypes.func,
    goBack:                          PropTypes.func,
    themeStr:                        PropTypes.oneOf(["white", "black"]),
    toggleReaderDisplayOptionsMenu:  PropTypes.func,
    backStack:                       PropTypes.array,
  };

  render() {
    const isSaved = Sefaria.indexOfSaved(this.props.enRef) !== -1;
    var langStyle = this.props.language === "hebrew" ? [styles.he, {marginTop: 4}] : [styles.en];
    var titleTextStyle = [langStyle, styles.headerTextTitleText, this.props.theme.text];
    if (this.props.backStack.length == 0) {
      var leftMenuButton = <MenuButton onPress={this.props.openNav} theme={this.props.theme} themeStr={this.props.themeStr}/>
    } else {
      var leftMenuButton =
        <DirectedButton
          onPress={this.props.goBack}
          themeStr={this.props.themeStr}
          imageStyle={[styles.menuButton, styles.directedButton]}
          language="english"
          direction="back"/>
    }
    return (
        <View style={[styles.header, this.props.theme.header]}>
          {leftMenuButton}
          <View style={styles.readerNavSectionMoreInvisible}>
            <Image
              style={styles.starIcon}
              source={require('./img/starUnfilled.png')}
              resizeMode={Image.resizeMode.contain}
            />
          </View>
          <TouchableOpacity style={styles.headerTextTitle} onPress={this.props.openTextToc}>
            <View style={styles.headerTextTitleInner}>
              <Image source={this.props.themeStr == "white" ? require('./img/caret.png'): require('./img/caret-light.png') }
                       style={[styles.downCaret, this.props.language === "hebrew" ? null: {opacity: 0}]}
                       resizeMode={Image.resizeMode.contain} />
              <Text style={titleTextStyle} numberOfLines={1} ellipsizeMode={"tail"}>
                {this.props.language === 'hebrew' ? this.props.heRef : this.props.enRef}
              </Text>
              <Image source={this.props.themeStr == "white" ? require('./img/caret.png'): require('./img/caret-light.png') }
                       style={[styles.downCaret, this.props.language === "hebrew" ? {opacity: 0} : null]}
                       resizeMode={Image.resizeMode.contain} />
            </View>
            <CategoryAttribution
              categories={this.props.categories}
              language={this.props.language === "hebrew" ? "hebrew" : "english"}
              context={"header"}
              linked={false} />
          </TouchableOpacity>
          <TouchableOpacity onPress={
              () => {
                if (isSaved) {
                  Sefaria.removeSavedItem({ ref: this.props.enRef });
                } else {
                  Sefaria.saveSavedItem({ ref: this.props.enRef, heRef: this.props.heRef, category: this.props.categories[0] });
                }
                this.forceUpdate();
              }
            }>
            <Image
              style={styles.starIcon}
              source={this.props.themeStr == "white" ?
                      (isSaved ? require('./img/starFilled.png') : require('./img/starUnfilled.png')) :
                      (isSaved ? require('./img/starFilled-light.png') : require('./img/starUnfilled-light.png'))}
              resizeMode={Image.resizeMode.contain}
            />
          </TouchableOpacity>
          <DisplaySettingsButton onPress={this.props.toggleReaderDisplayOptionsMenu} themeStr={this.props.themeStr}/>
        </View>
    );
  }
}

export default ReaderControls;