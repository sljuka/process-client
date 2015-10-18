import {List, Map} from 'immutable'

export const MAX_OPENED_PROCESSES = 6

export function openProcess(processState, id) {
  return processState.update('opened', List(), processes => {
    const indexOfId = processes.indexOf(id)
    if (indexOfId !== -1)
      processes = processes.remove(indexOfId)
    processes = processes.unshift(id)
    if (processes.size > MAX_OPENED_PROCESSES)
      processes = processes.splice(MAX_OPENED_PROCESSES, processes.size - MAX_OPENED_PROCESSES)

    return processes
  })
}

export function closeProcess(processState, id) {
  return processState.update('opened', List(), processes => {
    const indexOfId = processes.indexOf(id)
    if (indexOfId !== -1)
      processes = processes.remove(indexOfId)

    return processes
  })
}

export function fetchProcessesSuccess(processState, fetched) {
  return processState.set('processes', fetched)
}
