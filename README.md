Gemmeus!
========

Latin
-----

**Gemmeus** - (Adjective) *m.*

1. gemstone (attributive)
1. jewelled
1. glittering

About
=====

Gemmeus is a simple Bejeweled clone.

Demo
====

Check out the online demo at [gemmeus.infinitymotel.net](http://gemmeus.infinitymotel.net/).

How to run
==========

This app requires node >= 0.11.7 and an instance of MongoDB.  You'll also need bower and grunt (`npm install -g bower grunt-cli`).  If you have these up and running, the following should get you going.

```bash
cd ~/src
git clone https://github.com/doughsay/gemmeus.git
cd gemmeus
npm install
bower install
cd app/config
cp app.sample.js app.js # edit to your liking
cp mongo.sample.js mongo.js # edit to your liking
cd ../..
grunt deployAssets
npm start
```

After this you should be able to hit `http://localhost:3000/` or whichever url you have it set up to run on.

License
=======

MIT

Inne - fajna muzyka `http://vtriquet.github.io/Matching-fruits--/`
