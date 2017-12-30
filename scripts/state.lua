function apply_global_vars(state)
  _state = state
  battle = state.battle
  turn = state.turn
end

function update_state(state)
  logger:debug('Updating state')
  apply_global_vars(state)
  update_characters(state)
end

function init_state(state)
  logger:debug('Initializing state')
  apply_global_vars(state)
  init_characters(state)
end

function refresh_state()
  local state, err = run_processes({
    steps.Battle:State(nil)
  })
  if err then
    script:fail(err)
    return
  end
  update_state(state)
end
