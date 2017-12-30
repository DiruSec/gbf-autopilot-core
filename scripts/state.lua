function update_state(state)
  logger:debug('Updating state')
  update_characters(state)
end

function init_state(state)
  logger:debug('Initializing state')
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
