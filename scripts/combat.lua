function Summon(idx)
  local result = run_processes({
    steps.Combat:Summon(idx, _state),
    steps.Timeout(1500)
  })
  if result ~= false then 
    refresh_state()
  end
end

function EnableChargeAttack()
  run_processes({steps.Combat:ChargeAttack(true)})
end

function DisableChargeAttack()
  run_processes({steps.Combat:ChargeAttack(false)})
end

function Wait(time)
  run_processes({steps.Timeout(time)})
end

function Retreat()
  run_processes({steps.Combat:Retreat()})
end
