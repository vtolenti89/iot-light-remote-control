/**
 * Enable/Disable the loader during a idle activiy
 * @param isEnabled 
 * @param dispatch 
 */
const enable = (isEnabled: boolean, dispatch: any) => {
  dispatch({
    key: 'isLoading',
    data: isEnabled,
  })
}

/**
 * Add a timer to disable a loader 
 * @param dispatch 
 */
const reset = (dispatch: any) => {
  setTimeout(() => {
    dispatch({
      key: 'isLoading',
      data: false,
    })
  }, 5000)
}

export const useLoader = {
  enable,
  reset
}