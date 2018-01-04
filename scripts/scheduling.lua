function RepeatQuest(questPage, ap, repeatCount)
  run_processes({
    _repeatQuest(questPage, ap, repeatCount)
  })
end

co = coroutine.create(function ()
  logger:debug('Running script:', script.path)
  local f = loadfile(script.path)

  f(nil)
  logger:debug('asdf')
  script:done(nil)
end)
coroutine.resume(co)
