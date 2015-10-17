import {expect} from 'chai'
import {List, Map} from 'immutable'
import {openProcess, closeProcess, MAX_OPENED_PROCESSES} from '../../src/core/process'

describe('process application logic', () => {

  describe('openProcess function', () => {

    it('adds the process to the state', () => {
      const processState = Map()
      const entry = 1
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(1)
      }))
    })

    it('adds the process to the begining of list', () => {
      const processState = Map({
        opened: List.of(2, 3, 4)
      })
      const entry = 1
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(1, 2, 3, 4)
      }))
    })

    it('moves the process to begining of list if it is already opened', () => {
      const processState = Map({
        opened: List.of(1, 2, 3, 4)
      })
      const entry = 4
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(4, 1, 2, 3)
      }))
    })

    it('doesn\'t change state if opening process is already opened and on first location', () => {
      const processState = Map({
        opened: List.of(1, 2, 3, 4)
      })
      const entry = 1
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(1, 2, 3, 4)
      }))
    })

    it(`opens ${MAX_OPENED_PROCESSES} processes max, all excess processes are thrown out of the list`, () => {
      const processState = Map({
        opened: List.of(1, 2, 3, 4, 5, 6)
      })
      const entry = 7
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(7, 1, 2, 3, 4, 5)
      }))
    })

  })

  describe('closeProcess function', () => {

    it('removes the process from the opened processes list', () => {
      const processState = Map({
        opened: List.of(1, 2, 3, 4)
      })
      const entry = 1
      const nextState = closeProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(2, 3, 4)
      }))
    })

    it('doesn\'t change state if closing process isn\'t opened', () => {
      const processState = Map({
        opened: List.of(1, 2, 3, 4)
      })
      const entry = 5
      const nextState = closeProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of(1, 2, 3, 4)
      }))
    })

  })

})
