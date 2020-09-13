<center>
<h1>social.io - A privacy-focused social media website</h1>
<a href="https://github.com/yrahul3910/social-media-site/blob/master/COPYING">license</a>  |
<a href="https://github.com/yrahul3910/social-media-site/blob/master/CODE_OF_CONDUCT.md">contribute</a>  |
<a href="https://github.com/yrahul3910/social-media-site/issues/">issues</a>  |
<a href="https://github.com/yrahul3910/social-media-website/wiki">wiki</a>  |
<a href="mailto:r.yedida@pm.me">contact</a><br />
</center>
<p>
<img src="https://img.shields.io/github/license/yrahul3910/social-media-website" />
<a href="https://www.codacy.com/manual/yrahul3910/social-media-website?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yrahul3910/social-media-website&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/d755485ed3364e9ab0f9d174a4d9c2d3"/></a>
<a href="https://github.com/yrahul3910/social-media-website/actions"><img src="https://github.com/yrahul3910/social-media-website/workflows/ESLint/badge.svg?branch=master" /></a>
<a href="https://github.com/yrahul3910/social-media-website/actions"><img src="https://github.com/yrahul3910/social-media-website/workflows/Test%20Suite/badge.svg" /></a>
<img src="https://img.shields.io/github/repo-size/yrahul3910/social-media-website" />
</p> 

[![Promo video](http://img.youtube.com/vi/v51J-B5wSiE/0.jpg)](http://www.youtube.com/watch?v=v51J-B5wSiE "SE 2020: social.io")
<hr />

## What is this?

We are a social media website with a strong focus on privacy. All our code is fully open-source for review, and we do not sell any personal information.

## Setup

To set this up on your local machine, follow the instructions below:  
* Install [Node.js](https://nodejs.org)
* Install [Java](https://java.com)
* Install [Elasticsearch](https://elastic.co)
* Run `npm i` to install dependencies
* Run `npm start` to run the code

## FAQ

All questions, and our API reference can be found on [the wiki](https://github.com/yrahul3910/social-media-website/wiki)

## Why AGPL?

The AGPL is a strong copyleft license that prohibits large corporations from turning this into a closed-source, proprietary software. While it allows modifications, it expects them to also be open-source. This is in line with our ideals: we encourage others to build upon and share our work, but only as long as they make it open source.  

Other privacy-focused social media sites, such as [Friendica](https://github.com/friendica/friendica), [GNU Social](https://git.gnu.io/gnu/gnu-social/-/tree/master), and [Mastodon](https://github.com/tootsuite/mastodon) all use the AGPL-3.0, so there's strong precedence for this choice of license.

## How do you make money?

We have the same business model as ProtonMail: we offer a paid tier with some additional features and customizability. The funds from the paid users help run server costs. As for our personnel, we are simply passionate about digital privacy and are not doing this for money.

## Aren't there other competitors in this space?

Yes; we've discussed some above. We believe more competition is better.

## How can I help?

We're glad to have you on board. You can help out in several ways:
* Become a paid user
* Help develop features
* Make a donation

## Tell me more!

### From the ground-up

We build our features from the ground up, with as few libraries as possible. This simultaneously decreases the size of the bundle downloaded by the client, and reduces potential tracking ability from third-party CDNs.

### A modern framework


We use modern web standards to implement the website. Our client is based on React 16, Sass, Node.js 14, and Webpack 4. Our package versions are the latest that work with Webpack and the rest of our tooling, but ensuring that npm reports no vulnerabilities. We design our code as modularly as possible, following the DRY principle.
