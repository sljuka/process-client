import {List, Map, fromJS} from 'immutable'

export const MAX_OPENED_PROCESSES = 6

export function openProcess(processState, name) {
  return processState.update('opened', List(), processes => {
    const indexOfId = processes.indexOf(name)
    if (indexOfId !== -1)
      processes = processes.remove(indexOfId)
    processes = processes.unshift(name)
    if (processes.size > MAX_OPENED_PROCESSES)
      processes = processes.splice(MAX_OPENED_PROCESSES, processes.size - MAX_OPENED_PROCESSES)

    return processes
  })
}

export function closeProcess(processState, name) {
  const openedList = processState.update('opened', List(), opened => {
    const indexOfId = opened.indexOf(name)
    if (indexOfId !== -1)
      opened = opened.remove(indexOfId)

    return opened
  })
  console.log(openedList.toJS())
  return openedList.deleteIn(['processes', 'p1', 'opened'])
}

export function fetchProcessesSuccess(processState, fetched) {
  return processState.update('processes', Map(fetched), processes => {
    return fromJS(processes).mergeDeep(fromJS(fetched))
  })
}
