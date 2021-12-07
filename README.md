# Frontend Mentor - Memory game solution

This is a solution to the [Memory game challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/memory-game-vse4WFPvM). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the game depending on their device's screen size
- See hover states for all interactive elements on the page
- Play the Memory game either solo or multiplayer (up to 4 players)
- Set the theme to use numbers or icons within the tiles
- Choose to play on either a 6x6 or 4x4 grid

### Screenshot

![](./screenshot.png)

### Links

- Solution URL: [Submited in FM](https://your-solution-url.com)
- Live Site URL: [Github Page](https://your-live-site-url.com)

## My process

### Built with

- SCSS
- Mobile-first workflow
- ES6 Class
- localStorage()
- insertAdjacentHTML()

### What I learned

Reorder randomly all values of the array
```js
this._randomNum = 
            this._randomNum
            .map(num => Math.floor(num / 2))
            .map(p => [p, Math.random()])
            .sort( (a,b) => a[1] - b[1])
            .map( p => p[0] )
```
## Author

- Website - [My Portfolio](https://suleeyman.github.io/Portfolio/)
- Frontend Mentor - [@Suleeyman](https://www.frontendmentor.io/profile/Suleeyman)