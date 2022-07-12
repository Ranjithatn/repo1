# UCW Client (Universal Criminal Workstation)

## Installation

  1. `yarn setup-all`
  
 ## Development Mode

  1. `yarn dev`
  
 ## Release

  1. `yarn package-win`

 ## Run Tests With Coverage Report

  1. `yarn test --coverage`

## Issues Installing Node Modules or running NPM commands

  1. Make sure you have installed Windows Build Tools (Open PowerShell as Administrator) run the command `npm install --production windows-build-tools`
  2. Run all `package` commands in PowerShell (opened as Administrator). 



### Build Status
| CI | STATUS |
| -- | ------ |
| Appveyor | [![Build status](https://ci.appveyor.com/api/projects/status/s40458ixe2s9s0mg?svg=true)](https://ci.appveyor.com/project/cmdkoh/ucw-client) |
| Codecov | [![codecov](https://codecov.io/gh/CrossmatchUCW/UCW-CLIENT/branch/master/graph/badge.svg?token=Td19AHetTr)](https://codecov.io/gh/CrossmatchUCW/UCW-CLIENT) |