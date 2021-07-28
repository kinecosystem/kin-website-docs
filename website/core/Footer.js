/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
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
            <a href={this.docUrl("kin-architecture-overview")}>Introduction</a>
            <a href={this.docUrl("android/sdk")}>Android</a>
            <a href={this.docUrl("ios/sdk")}>iOS</a>
            <a href={this.docUrl("go/sdk")}>Go</a>
            <a href={this.docUrl("python/sdk")}>Python</a>
            <a href={this.docUrl("nodejs/sdk")}>Node.js</a>
          </div>
          <div id="footer-col-2" className="footer-links">
            <h4>Resources</h4>
            <a href="https://github.com/kinecosystem">Github</a>
            <a
              href="https://www.kin.org/developers/guidelines.pdf"
              target="_blank"
            >
              Guidelines
            </a>
          </div>
          <div id="footer-col-3" className="footer-links"></div>
          <div id="footer-social">
            <a
              href="https://twitter.com/kin_foundation"
              target="_blank"
              rel="noreferrer noopener"
            >
              {this.props.config.twitterIcon && (
                <img
                  src={
                    this.props.config.baseUrl + this.props.config.twitterIcon
                  }
                  alt="Kin Foundation Twitter Account Icon"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a
              href="https://www.linkedin.com/company/kin-ecosystem/"
              target="_blank"
              rel="noreferrer noopener"
            >
              {this.props.config.linkedinIcon && (
                <img
                  src={
                    this.props.config.baseUrl + this.props.config.linkedinIcon
                  }
                  alt="Kin Foundation LinkedIn Account Icon"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a
              href="https://www.reddit.com/r/KinFoundation/"
              target="_blank"
              rel="noreferrer noopener"
            >
              {this.props.config.redditIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.redditIcon}
                  alt="Kin Foundation Reddit Account Icon"
                  width="29"
                  height="29"
                />
              )}
            </a>
            <a
              href="https://medium.com/kinblog"
              target="_blank"
              rel="noreferrer noopener"
            >
              {this.props.config.mediumIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.mediumIcon}
                  alt="Kin Foundation Medium Account Icon"
                  width="29"
                  height="29"
                />
              )}
            </a>
          </div>
          <div id="footer-privacy">
            <a href="https://www.kin.org/privacy-policy.pdf" target="_blank">
              Privacy policy
            </a>
            <a
              href="https://www.kin.org/terms-and-conditions.pdf"
              target="_blank"
            >
              Terms and conditions
            </a>
          </div>
          <div id="footer-copyright">{this.props.config.copyright}</div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
