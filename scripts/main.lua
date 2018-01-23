co = coroutine.create(function ()
  logger:debug('Running script:', script.path)

  local func, err = loadfile(script.path)
  if not func then
    return error_handler(err)
  end

  init_state(_state)
  local status, err = pcall(func)
  if not status then
    _running = false
    return error_handler(err)
  else
    _running = false
    script:done()
    return true
  end
end)
coroutine.resume(co)
