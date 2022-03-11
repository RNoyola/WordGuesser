import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'

interface Excercise {
  currentExcercise: number
  phrase: string | null
  guessText: null | [string]
  options: null | [string]
  guesses: null | [string]
  translate: null | [string]
}

const App = () => {
  const [currentExcercise, setCurrentExcercise] = useState<Number | null>(null)
  const [phrase, setPhrase] = useState<null | string>(null)
  const [options, setOptions] = useState<null | [string]>(null)
  const [guesses, setGuesses] = useState<null | [string]>(null)
  const [guessText, setGuessText] = useState<null | [string]>(null)
  const [translate, setTranslate] = useState<null | [string]>(null)
  const [errors, setErrors] = useState<[Number] | [] | null>(null)
  const isDisabled = guesses?.length !== guessText?.length

  const setExcercise = (
    excercise: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
  ) => {
    if (excercise.exists) {
      const data: Excercise = excercise.data()
      setPhrase(data.phrase)
      setOptions(data.options)
      setGuessText(data.guessText)
      setTranslate(data.translate)
      setGuesses(null)
      setErrors(null)
    } else {
      setCurrentExcercise(0)
      setPhrase(null)
      setOptions(null)
      setGuessText(null)
      setTranslate(null)
      setErrors(null)
    }
  }

  const fetchExcercise = async () => {
    const excercises = firestore().collection('german-exercises')
    const excercise = await excercises.doc(`excercise-${currentExcercise}`).get()
    setExcercise(excercise)
  }

  useEffect(() => {
    setCurrentExcercise(1)
  }, [])

  useEffect(() => {
    if (currentExcercise) fetchExcercise()
  }, [currentExcercise])

  const handleText = (): Element => {
    const splitString = phrase?.split(' ')
    return (
      <View style={styles.textContainer}>
        {splitString?.map((value: string): Element => {
          if (guessText?.find((guessValue) => value.toLowerCase() === guessValue.toLowerCase())) {
            return (
              <View style={styles.uderlineStyle}>
                <Text style={[styles.textPhrase, styles.textHighlight]}>{`${value} `}</Text>
              </View>
            )
          } else {
            return <Text style={styles.textPhrase}>{`${value} `}</Text>
          }
        })}
      </View>
    )
  }

  const handleGuess = (): Element => {
    const expectedGuesses = (translate?.length || 1) - 1
    const currentGuesses = guesses?.length
    return (
      <View style={styles.guessContainer}>
        {translate?.map((value, index) => {
          if (index < expectedGuesses) {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textPhrase}>{`${value} `}</Text>
                <View style={styles.uderlineStyle}>
                  <Text style={[styles.textPhrase, styles.textHighlight]}>{index < currentGuesses ? guesses[index] : '              '}</Text>
                </View>
                <Text style={styles.textPhrase}>{' '}</Text>
              </View>
            )
          }
          return <Text style={styles.textPhrase}>{value}</Text>
        })}
      </View>
    )
  }

  const handleClick = (guess: string) => {
    const index = guesses?.findIndex((value: string) => value === guess)
    if (!guesses?.length || index === -1) {
      if (guesses?.length) {
        if (guesses.length < guessText?.length) {
          setGuesses([...guesses, guess])
        }
      } else {
        setGuesses([guess])
      }
    } else {
      if (guesses?.length === 1) {
        setGuesses(null)
      } else {
        setGuesses(guesses?.filter((value) => value !== guess))
      }
    }
  }

  const handleOptions = (): Element => {
    return (
      <View style={styles.optionsContainer}>
        {options?.map((guess) => {
          return (
            <TouchableOpacity
              style={[
                styles.optionsButton,
                {backgroundColor: guesses?.find((value) => value === guess) ? '#76dafe' : 'white'},
              ]}
              onPress={() => handleClick(guess)}>
              <Text style={styles.textOptions}>{guess}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const checkAnswers = () => {
    const errorIndex = guesses?.filter((guess, index) => {
      return guess !== guessText[index]
    })
    setErrors(errorIndex)
  }

  const handleContinue = () => {
    setCurrentExcercise(currentExcercise + 1)
  }

  const handleBottonButton = () => {
    if (errors?.length >= 0) {
      const hasErrors = errors?.length
      const expectedPhrase = translate?.map((text, index) => {
          return `${text} ${guessText[index] ? guessText[index] : ''}`
        })
        .join(' ')
      return (
        <View
          style={[styles.continueContainer, {backgroundColor: hasErrors ? '#fe7a87' : '#26e5e8'}]}>
          <Text style={styles.textContinue}>
            {hasErrors ? `Answer: ${expectedPhrase}` : 'Great Job!'}
          </Text>
          <View style={styles.continueButtonContainer}>
            <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
              <Text style={[styles.textButton, {color: 'black'}]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    return (
      <TouchableOpacity
        onPress={checkAnswers}
        disabled={isDisabled}
        style={[styles.checkAnswersButton, {backgroundColor: isDisabled ? '#6394a4' : '#26e5e8'}]}>
        <Text style={[styles.textButton, {color: isDisabled ? 'grey' : 'white'}]}>
          Check Answer
        </Text>
      </TouchableOpacity>
    )
  }

  if (currentExcercise) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.secondaryContainer}>
          <View style={styles.excerciseContainer}>
            <Text style={styles.instructions}>Fill in the missing word</Text>
            {handleText()}
            {handleGuess()}
          </View>
          <View>{handleOptions()}</View>
          <View style={styles.checkAnswerContainer}>{handleBottonButton()}</View>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.secondaryContainer, styles.centerAll]}>
        <View style={styles.emptyViewContainer}>
          <Text style={styles.emptyViewText}>
            You finished with all the excercises, Congratulations! Want to Start Over?
          </Text>
        </View>
        <View style={styles.emptyViewButtonContainer}>
          <TouchableOpacity onPress={() => setCurrentExcercise(1)} style={styles.startOverButton}>
            <Text style={[styles.textButton, {color: 'white'}]}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#76dafe'},
  secondaryContainer: {flex: 1, marginTop: 25, borderRadius: 25, backgroundColor: '#3c6c82'},
  excerciseContainer: {
    marginTop: 25,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  checkAnswerContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  textPhrase: {
    color: 'white',
    fontSize: 20,
  },
  instructions: {
    color: 'white',
    fontSize: 14,
  },
  textButton: {
    fontSize: 20,
    fontWeight: '700',
  },
  textOptions: {color: '#3c6c82', fontWeight: '600', fontSize: 16},
  uderlineStyle: {borderBottomWidth: 1, borderBottomColor: 'white'},
  textHighlight: {fontWeight: '700'},
  textContainer: {flexDirection: 'row', marginTop: 10},
  guessContainer: {flexDirection: 'row', marginTop: 30},
  optionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 100,
  },
  optionsButton: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowColor: 'black',
  },
  continueContainer: {height: 200, width: '100%', borderRadius: 10},
  textContinue: {marginTop: 25, marginLeft: 16, color: 'white', fontSize: 18, fontWeight: '700'},
  continueButtonContainer: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  continueButton: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  checkAnswersButton: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  centerAll: {justifyContent: 'center', alignContent: 'center', alignItems: 'center'},
  emptyViewContainer: {flex: 1, justifyContent: 'center'},
  emptyViewText: {alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '700'},
  emptyViewButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  startOverButton: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#26e5e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
})

export default App
