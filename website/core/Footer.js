/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer id="footer">
        <section className="content">
          <div id="footer-logo">
            <a href={this.props.config.baseUrl}>
              {this.props.config.footerIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.footerIcon}
                  alt={this.props.config.title}
                  width="53"
                  height="53"
                />
              )}
            </a>
          </div>
          <div id="footer-col-1" className="footer-links">
           <h4>Docs</h4>
            <a href={this.docUrl('')}>
              Downloads
            </a>
            <a href={this.docUrl('kin-architecture-overview')}>
              Introduction
            </a>
            <a href={this.docUrl('')}>
              Quickstart
            </a>
            <a href={this.docUrl('documentation/android-sdk')}>
              Android
            </a>
            <a href={this.docUrl('documentation/ios-sdk')}>
              iOS
            </a>
            <a href={this.docUrl('documentation/python-sdk')}>
              Python
            </a>
          </div>
          <div id="footer-col-2" className="footer-links">
            <h4>Support</h4>
            <a href="#">
              Support
            </a>
            <a href="#">
              Go live with Kin
            </a>
          </div>
          <div id="footer-col-3" className="footer-links">
            <h4>Community</h4>
            <a href="#">
              Events
            </a>
          </div>
          <div id="footer-social">
            <a 
              href="https://twitter.com/kin_foundation"
              target="_blank"
              rel="noreferrer noopener">
              {this.props.config.linkedinIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.linkedinIcon}
                  alt="LinkedIn"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a 
              href="https://www.reddit.com/r/KinFoundation/"
              target="_blank"
              rel="noreferrer noopener">
              {this.props.config.redditIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.redditIcon}
                  alt="Reddit"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a 
              href="https://medium.com/kinblog"
              target="_blank"
              rel="noreferrer noopener">
              {this.props.config.mediumIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.mediumIcon}
                  alt="Medium"
                  width="29"
                  height="29"
                />
              )}
            </a>
          </div>
          <div id="footer-privacy">
            <a href="#">
              Privacy policy
            </a>
            <a href="#">
              Terms and conditions
            </a>
            <a href="#">
              Cookies
            </a>
          </div>
          <div id="footer-copyright">{this.props.config.copyright}</div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
