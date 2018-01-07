js = require 'js'

function run_processes(processes, lastResult)
  if not _running then
    return nil
  end

  local processesArray = js.global:Array()
  for _, process in ipairs(processes) do
    processesArray:push(process)
  end

  local co = coroutine.running()
  local promise = _context:process(processesArray, lastResult)
  promise['then'](promise, function (self, result)
    coroutine.resume(co, result)
  end, function (self, err)
    coroutine.resume(co, nil, err)
  end)
  return coroutine.yield()
end

function Stop()
  run_processes({steps:Stop()})
end

function dofile(path)
  local result, err = loadfile(path)
  if result == nil then
    logger:error(err)
    script:fail(err)
  else
    result()
  end
end
