/* @flow */
import invariant from 'invariant';

import { createInternalAddon } from 'core/reducers/addons';
import type { SearchFilters } from 'core/api/search';
import type {
  AddonType,
  CollectionAddonType,
  ExternalAddonType,
} from 'core/types/addons';

export const SEARCH_STARTED: 'SEARCH_STARTED' = 'SEARCH_STARTED';
export const SEARCH_LOADED: 'SEARCH_LOADED' = 'SEARCH_LOADED';

const SEARCH_ABORTED: 'SEARCH_ABORTED' = 'SEARCH_ABORTED';

export type SearchState = {|
  count: number,
  filters: SearchFilters | null,
  loading: boolean,
  pageSize: string | null,
  results: Array<AddonType | CollectionAddonType>,
|};

export const initialState: SearchState = {
  count: 0,
  filters: null,
  loading: false,
  pageSize: null,
  results: [],
};

type AbortSearchAction = {|
  type: typeof SEARCH_ABORTED,
|};

export const abortSearch = (): AbortSearchAction => {
  return { type: SEARCH_ABORTED };
};

type SearchStartParams = {|
  errorHandlerId: string,
  filters: SearchFilters,
|};

export type SearchStartAction = {|
  type: typeof SEARCH_STARTED,
  payload: SearchStartParams,
|};

export function searchStart({
  errorHandlerId,
  filters,
}: SearchStartParams): SearchStartAction {
  invariant(errorHandlerId, 'errorHandlerId is required');
  invariant(filters, 'filters are required');

  return {
    type: SEARCH_STARTED,
    payload: { errorHandlerId, filters },
  };
}

type SearchLoadParams = {|
  count: number,
  pageSize: string,
  results: Array<ExternalAddonType>,
|};

type SearchLoadAction = {|
  type: typeof SEARCH_LOADED,
  payload: SearchLoadParams,
|};

export function searchLoad({
  count,
  pageSize,
  results,
}: SearchLoadParams): SearchLoadAction {
  invariant(results, 'results are required');

  return {
    type: SEARCH_LOADED,
    payload: { count, pageSize, results },
  };
}

type Action = AbortSearchAction | SearchStartAction | SearchLoadAction;

export default function search(
  state: SearchState = initialState,
  action: Action,
): SearchState {
  switch (action.type) {
    case SEARCH_STARTED: {
      const { payload } = action;

      return {
        ...state,
        count: 0,
        filters: payload.filters,
        loading: true,
        results: [],
      };
    }
    case SEARCH_LOADED: {
      const { payload } = action;

      return {
        ...state,
        count: payload.count,
        loading: false,
        pageSize: payload.pageSize,
        results: payload.results.map((addon) => createInternalAddon(addon)),
      };
    }
    case SEARCH_ABORTED:
      return {
        ...state,
        count: 0,
        loading: false,
        results: [],
      };
    default:
      return state;
  }
}
