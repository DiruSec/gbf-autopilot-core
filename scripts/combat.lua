function Summon(idx)
  refresh_state(run_processes({
    steps.Combat:Summon(idx, _state),
    steps.Timeout(1500)
  }))
end

function EnableChargeAttack()
  run_processes({steps.Combat:ChargeAttack(true)})
end

function DisableChargeAttack()
  run_processes({steps.Combat:ChargeAttack(false)})
end

function Wait(time)
  run_processes({steps:Timeout(time)})
end

function Retreat()
  run_processes({steps.Combat:Retreat()})
end

function Refresh()
  run_processes({
    steps.Location:Reload(),
    steps:Timeout(3000),
    steps:Wait('.btn-attack-start.display-on,.cnt-result')
  })
end

function Attack()
  refresh_state(run_processes({steps.Combat:Attack()}))
end

function SelectTarget(target)
  run_processes({steps.Combat:SelectTarget(target)})
end

function UseSticker(row, col)
  run_processes({steps.Combat:UseSticker(row, col)})
end

function UseGreenPotionOnPartyMember(member)
  refresh_state(run_processes({steps.Combat:UsePotion(1, member)}))
end

function UseClarityHerbOnPartyMember(member)
  refresh_state(run_processes({steps.Combat:UsePotion(5, member)}))
end

function UseBluePotion()
  refresh_state(run_processes({steps.Combat:UsePotion(2)}))
end

function UseSupportPotion()
  refresh_state(run_processes({steps.Combat:UsePotion(4)}))
end

function UseFullElixir()
  refresh_state(run_processes({steps.Combat:UsePotion(3)}))
end

function UseRevivalPotion()
  refresh_state(run_processes({steps.Combat:UsePotion(6)}))
end

function RequestBackup(all, friend, guild)
  run_processes({steps.Combat:Backup(all, friend, guild)})
end
