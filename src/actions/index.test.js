import * as actions from '.'

describe('actions', () => {
  it('should create an action to toggle AttentionBox', () => {
    const expectedAction = {
      type: actions.UI_ATTENTIONBOX_TOGGLE,
    }
    expect(actions.uiAttentionboxToggle()).toEqual(expectedAction)
  })

  it('should create an action to set position of user', () => {
    const position = { x: 0, y: 0, z: 0 }
    const expectedAction = {
      type: actions.USER_SET_POSITION,
      position,
    }
    expect(actions.userSetPosition(position)).toEqual(expectedAction)
  })
})
