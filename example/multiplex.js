#!/usr/bin/env node

/**
 * multiplex.js
 * https://github.com/chjj/blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey (MIT License)
 * A terminal multiplexer created by blessed.
 */

process.title = 'multiplex.js';

var blessed = require('blessed')
  , screen;

screen = blessed.screen({
  smartCSR: true,
  log: process.env.HOME + '/blessed-terminal.log',
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true
});

var left = blessed.terminal({
  parent: screen,
  cursor: 'line',
  cursorBlink: true,
  screenKeys: false,
  left: 0,
  top: 0,
  width: '50%',
  border: {
    type: 'line',
  },
  style: {
    fg: 'default',
    bg: 'default',
    focus: {
      border: {
        fg: 'green'
      }
    }
  }
});

left.pty.on('data', function(data) {
  screen.log(JSON.stringify(data));
});

var right = blessed.terminal({
  parent: screen,
  cursor: 'block',
  cursorBlink: true,
  screenKeys: false,
  left: '50%-1',
  top: 0,
  width: '50%+1',
  border: {
    type: 'line',
  },
  style: {
    fg: 'red',
    bg: 'black',
    focus: {
      border: {
        fg: 'green'
      }
    }
  }
});

[left, right].forEach(function(term) {
  term.on('title', function(title) {
    screen.title = title;
  });
  term.on('click', term.focus.bind(term));
});

left.focus();

screen.key('C-c', function() {
  return process.exit(0);
});

screen.render();
