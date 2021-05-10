<h1 align="center">
	<img
		width="400"
		alt="EventScope"
		src="img/logo_h.png">
</h1>

<h3 align="center">
	EventScope
</h3>

<p align="center">
	<strong>
		<a href="">Demo Website</a>
		•
		<a href="">Docs</a>
		•
		<a href="">Demo Video</a>
	</strong>
</p>
<!-- <p align="center">
	<a href="https://demo.thelounge.chat/"><img
		alt="#thelounge IRC channel on freenode"
		src="https://img.shields.io/badge/freenode-%23thelounge-415364.svg?colorA=ff9e18"></a>
	<a href="https://yarn.pm/thelounge"><img
		alt="npm version"
		src="https://img.shields.io/npm/v/thelounge.svg?colorA=333a41&maxAge=3600"></a>
	<a href="https://github.com/thelounge/thelounge/actions"><img
		alt="Build Status"
		src="https://github.com/thelounge/thelounge/workflows/Build/badge.svg"></a>
	<a href="https://npm-stat.com/charts.html?package=thelounge&from=2016-02-12"><img
		alt="Total downloads on npm"
		src="https://img.shields.io/npm/dy/thelounge.svg?colorA=333a41&colorB=007dc7&maxAge=3600&label=Downloads"></a>
</p> -->

<p align="center">
	<img src="img/eventscope.png" width="550">
</p>

## Overview

EventScope is designed to be a live map of GMU events.


## Bulit With

* [NodeJS](https://nodejs.org/en/)
* [ReactJs](https://reactjs.org/)
* [FireBase](https://firebase.google.com/)
* [Material UI](https://material-ui.com/)
* [React Bootstrap](https://react-bootstrap.github.io/)

## Installation and usage

EventScope requires latest [Node.js](https://nodejs.org/) LTS version or more recent.
[Yarn package manager](https://yarnpkg.com/) is also recommended.  

### Running from source

The following commands install and run the EventScope:

```sh
git clone https://github.com/GMU-EventScope/master.git
cd master
npm install
npm start
```

⚠️ While it is the most recent codebase, this is not production-ready! 
Run at your own risk. It is also not recommended to run this as root.

## Development setup

Simply follow the instructions to run Eventscope from source above, on your own
fork.

Before submitting any change, make sure to:

- Create your Feature Branch (`git checkout -b feature/yourbranch`)
- Commit your Changes (`git commit -m 'Add some yourbranch'`)
- Push to the Branch (`git push origin feature/yourbranch`)
- Run `npm test` to execute linters and test suite
- Run `npm build` if you change or add anything in `src/contexts` or `src/components`
- `npm dev` can be used to start EventScope with hot module reloading
- Open a pull request

## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.
