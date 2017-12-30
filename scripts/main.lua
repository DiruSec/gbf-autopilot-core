function attack()
  -- TODO: implement attack function
end

co = coroutine.create(function ()
  logger:debug('Running script:', script.path)
  local f = loadfile(script.path)

  init_state(_state)
  f(nil)
  script:done(nil)
end)
coroutine.resume(co)
