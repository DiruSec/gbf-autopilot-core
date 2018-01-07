co = coroutine.create(function ()
  logger:debug('Running script:', script.path)
  local result, err = loadfile(script.path)

  if result == nil then
    logger:error(err)
    script:fail(err)
  else
    init_state(_state)
    result()
    script:done()
  end
end)
coroutine.resume(co)
