import { useSyncExternalStore } from 'react'
import { getBookmarks, subscribeBookmarks } from './lib/bookmarks'
import { getContinueReading, subscribeContinue } from './lib/continue-reading'

export function useBookmarks() {
  return useSyncExternalStore(subscribeBookmarks, getBookmarks, getBookmarks)
}

export function useContinueReading() {
  return useSyncExternalStore(subscribeContinue, getContinueReading, getContinueReading)
}
