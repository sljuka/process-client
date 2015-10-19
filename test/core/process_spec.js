/* eslint-disable no-undef, camelcase */

import {expect} from 'chai'
import {List, Map} from 'immutable'
import {openProcess, closeProcess, fetchProcessesSuccess, MAX_OPENED_PROCESSES} from '../../src/core/process'

describe('process application logic', () => {

  describe('openProcess function', () => {

    it('adds the process to the state', () => {
      const processState = Map()
      const entry = 'p1'
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p1')
      }))
    })

    it('adds the process to the begining of list', () => {
      const processState = Map({
        opened: List.of('p2', 'p3', 'p4')
      })
      const entry = 'p1'
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      }))
    })

    it('moves the process to begining of list if it is already opened', () => {
      const processState = Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      })
      const entry = 'p4'
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p4', 'p1', 'p2', 'p3')
      }))
    })

    it('doesn\'t change state if opening process is already opened and on first location', () => {
      const processState = Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      })
      const entry = 'p1'
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      }))
    })

    it(`opens ${MAX_OPENED_PROCESSES} processes max, all excess processes are thrown out of the list`, () => {
      const processState = Map({
        opened: List.of('p1', 'p2', 'p3', 'p4', 'p5', 'p6')
      })
      const entry = 'p7'
      const nextState = openProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p7', 'p1', 'p2', 'p3', 'p4', 'p5')
      }))
    })

  })

  describe('closeProcess function', () => {

    it('removes the process from the opened processes list', () => {
      const processState = Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      })
      const entry = 'p1'
      const nextState = closeProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p2', 'p3', 'p4')
      }))
    })

    it('doesn\'t change state if closing process isn\'t opened', () => {
      const processState = Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      })
      const entry = 'p5'
      const nextState = closeProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened: List.of('p1', 'p2', 'p3', 'p4')
      }))
    })

    it('removes the opened key from the closed process', () => {
      const processState = Map({
        opened:    List.of('p1', 'p2', 'p3', 'p4'),
        processes: {
          p1: {
            id:     1,
            opened: 'instance_1'
          }
        }
      })
      const entry = 'p1'
      const nextState = closeProcess(processState, entry)
      expect(nextState).to.equal(Map({
        opened:    List.of('p2', 'p3', 'p4'),
        processes: {
          p1: {
            id: 1
          }
        }
      }))
    })
  })

  describe('fetchProcessesSuccess function', () => {

    it('saves the fetched processes into state', () => {
      const processState = Map()
      const entry = {
        process_1: {
          id:   1,
          name: 'process_1'
        },
        process_2: {
          id:   2,
          name: 'process_2'
        }
      }
      const nextState = fetchProcessesSuccess(processState, entry)
      const expectedValue = {
        processes: {
          process_1: {
            id:   1,
            name: 'process_1'
          },
          process_2: {
            id:   2,
            name: 'process_2'
          }
        }
      }
      expect(nextState.toJS()).to.deep.equal(expectedValue)
    })

    it('merges the fetched process state with the existing process state', () => {
      const processState = Map({
        processes: {
          process_1: {
            id:        1,
            name:      'process_1',
            instances: ['instance_1', 'instance_2'],
            opened:    'instance_2'
          },
          process_2: {
            id:        2,
            name:      'process_2',
            instances: ['instance_1', 'instance_2']
          }
        }
      })
      const entry = {
        process_1: {
          id:        1,
          name:      'process_1',
          instances: ['instance_2', 'instance_3']
        },
        process_2: {
          id:        2,
          name:      'process_2',
          instances: ['instance_1', 'instance_3']
        }
      }
      const nextState = fetchProcessesSuccess(processState, entry)
      const expectedValue = {
        processes: {
          process_1: {
            id:        1,
            name:      'process_1',
            instances: ['instance_2', 'instance_3'],
            opened:    'instance_2'
          },
          process_2: {
            id:        2,
            name:      'process_2',
            instances: ['instance_1', 'instance_3']
          }
        }
      }
      expect(nextState.toJS()).to.deep.equal(expectedValue)
    })
  })
})
