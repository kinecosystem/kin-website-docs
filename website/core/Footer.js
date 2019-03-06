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
            <a href={this.docUrl('kin-architecture-overview.html')}>
              Architecture overview
            </a>
            <a href={this.docUrl('quick-start/hi-kin-android.html')}>
              Hello World for Android
            </a>
            <a href={this.docUrl('quick-start/hi-kin-python.html')}>
              Hello World for Python
            </a>
            {/* <a href={this.docUrl('documentation/documentation.html')}>
              Documentation
            </a> */}
          </div>
          <div id="footer-col-2" className="footer-links">
            <h4>Community</h4>
            <a
              href="https://www.reddit.com/r/KinFoundation/"
              target="_blank"
              rel="noreferrer noopener">
              Reddit
            </a>
            <a
              href="https://web.telegram.org/#/im?p=@KinAnnouncements"
              target="_blank"
              rel="noreferrer noopener">
              Telegram
            </a>
          </div>
          <div id="footer-col-3" className="footer-links">
            <h4>More</h4>
            <a
              href="https://medium.com/kinblog/"
              target="_blank"
              rel="noreferrer noopener">
              Blog
            </a>
            <a
              href="https://github.com/kinecosystem"
              target="_blank"
              rel="noreferrer noopener">
              GitHub
            </a>
          </div>
          <div id="footer-social">
            <a href="https://twitter.com/kin_foundation">
              {this.props.config.linkedinIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.linkedinIcon}
                  alt="LinkedIn"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a href="https://www.reddit.com/r/KinFoundation/">
              {this.props.config.redditIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.redditIcon}
                  alt="Reddit"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a href="https://medium.com/kinblog">
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
            <a
              href="https://github.com/kinecosystem"
              target="_blank"
              rel="noreferrer noopener">
              Privacy policy
            </a>
            <a
              href="https://github.com/kinecosystem"
              target="_blank"
              rel="noreferrer noopener">
              Terms and conditions
            </a>
            <a
              href="https://github.com/kinecosystem"
              target="_blank"
              rel="noreferrer noopener">
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
