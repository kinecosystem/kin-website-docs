/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  // {
  //   caption: 'User1',
  //   // You will need to prepend the image path with your baseUrl
  //   // if it is not '/', like: '/test-site/img/docusaurus.svg'.
  //   image: '/img/docusaurus.svg',
  //   infoLink: 'https://docs.kin.org/',
  //   pinned: true,
  // },
];

const siteConfig = {
  title: 'Kin SDK Docs', // Title for your website.
  tagline: 'Let your users earn, spend, and manage Kin.',
  url: 'https://docs.kin.org', // Your website URL
  baseUrl: '/', // Base URL for your project
  docsUrl: '', // Base URL for the docs
  cname: 'docs.kin.org',

  // Used for publishing and more
  projectName: 'kin-website-docs',
  organizationName: 'kinecosystem',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { href: 'https://www.kin.org/tutorials', label: 'Tutorials' },
    { href: 'https://www.kin.org/developers', label: 'Developers' },
    { href: 'https://github.com/kinecosystem', label: 'Build' },
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/logo-clear-k.svg',
  footerIcon: 'img/logo-black-k.svg',
  favicon: 'img/favicon.png',
  linkedinIcon: 'img/linkedin.svg',
  redditIcon: 'img/reddit.svg',
  mediumIcon: 'img/medium.svg',

  /* Colors for website */
  colors: {
    primaryColor: '#149e83',
    secondaryColor: '#149e83',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `© ${new Date().getFullYear()} Kin Foundation`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
    // theme: 'dark',
    //theme: 'solarized-light',
  },

  editUrl: 'https://github.com/kinecosystem/kin-website-docs/tree/master/docs/',
  // don't import CSS files for api reference manuals into docusaurus
  separateCss: ["static/api-ref"],
//  disableHeaderTitle: true,
//  disableTitleTagline: true,


  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js',
  ],

  // Styles from /website/static/css are automatically included.
  stylesheets: [],

  gaTrackingId: 'UA-136101659-1',

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/kin.svg',
  twitterImage: 'img/kin.svg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },

  docsSideNavCollapsible: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
