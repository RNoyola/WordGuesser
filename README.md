### WordGuesser

### Setup
- Clone this repo
- yarn install

## Tech Stack

- React Native
- TypeScript
- react-native-firebase

### Description

Simple App that receives an excercise from Firestore

## Firestore structure

`<language>-excercise` -> `excercise-<number>` -> {`guessText: [string]`, `options: [string]`, `phrase: string`, `translate: [string]`}

## Missing

- Give a hint on the translation of the word by pressing the text
- Tests
- Since the time was limit to 2 hours, I was'n able to create a nice folder structure, so sadly eveerything is on App.tsx
