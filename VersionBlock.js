import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import HTMLView from 'react-native-htmlview'; //to convert html'afied JSON to something react can render (https://github.com/jsdf/react-native-htmlview)
import styles from './Styles.js';


class VersionBlock extends React.Component {
  static propTypes = {
    theme:                PropTypes.object.isRequired,
    version:              PropTypes.object.isRequired,
    openVersionInSidebar: PropTypes.func,
    openVersionInReader:  PropTypes.func,
    isCurrent:            PropTypes.bool,
    interfaceLang:        PropTypes.oneOf(["english", "hebrew"]),
  };

  onVersionTitleClick = () => {
    const action = this.props.openVersionInSidebar ? this.props.openVersionInSidebar : this.props.openVersionInReader;
    if (action) {
      action(this.props.version.versionTitle, this.props.version.versionTitleInHebrew, this.props.version.language);
    }
  }
  onSelectVersionClick = () => {
    if (this.props.openVersionInReader) {
      this.props.openVersionInReader(this.props.version.versionTitle, this.props.version.language);
    }
  }
  render() {
    const versionInfo = this.props.version;
    let versionTitle, versionSource, shortVersionSource, license, licenseURL, versionNotes;
    if (this.props.textLang == "hebrew") {
      versionTitle = versionInfo['heVersionTitle'];
      versionSource = versionInfo['heVersionSource'];
      shortVersionSource = Sefaria.util.parseURLhost(versionSource);
      license = versionInfo['heLicense'];
      licenseURL = Sefaria.util.getLicenseURL(license);
      versionNotes = versionInfo['heVersionNotes'];
    } else {
      versionTitle = versionInfo['versionTitle'];
      versionSource = versionInfo['versionSource'];
      shortVersionSource = Sefaria.util.parseURLhost(versionSource);
      license = versionInfo['license'];
      licenseURL = Sefaria.util.getLicenseURL(license);
      versionNotes = versionInfo['versionNotes'];
    }

    const textAlign = { textAlign: "left" };
    if (license === "CC-BY") { console.log(versionSource, license)}
    return (
      <View>
        {
          versionTitle ?
            (this.props.openVersionInSidebar ?
              <TouchableOpacity onPress={this.onVersionTitleClick}>
                <Text style={[styles.en, styles.textTocVersionTitle, textAlign, this.props.theme.text]}>
                  {versionTitle}
                </Text>
              </TouchableOpacity> :
              <Text style={[styles.en, styles.textTocVersionTitle, textAlign, this.props.theme.text]}>
                {versionTitle}
              </Text>)
          : null
        }
        <View style={styles.textTocVersionInfo}>
          { versionSource ?
            <TouchableOpacity onPress={() => {Linking.openURL(versionSource);}}>
              <Text style={[styles.textTocVersionInfoText, this.props.theme.tertiaryText]}>{shortVersionSource || versionSource}</Text>
            </TouchableOpacity>
            : null
          }
          { versionSource && (license && license !== "unknown") ?
            <Text style={[styles.navBottomLinkDot, this.props.theme.tertiaryText]}>•</Text>
            : null
          }
          { license && license !== "unknown" ?
            <TouchableOpacity onPress={() => licenseURL ? Linking.openURL(licenseURL) : null}>
              <Text style={[styles.textTocVersionInfoText, this.props.theme.tertiaryText]}>{license}</Text>
            </TouchableOpacity>
            : null
          }
        </View>
        { versionNotes ?
          <HTMLView
            value={"<div>"+versionInfo['versionNotes']+"</div>"}
            onLinkPress={(url) => Linking.openURL(url) }
            stylesheet={styles}
            textComponentProps={{style: [styles.textTocVersionNotes, textAlign, this.props.theme.tertiaryText]}}
          />
          : null
        }
      </View>
    );
  }
}

export default VersionBlock;