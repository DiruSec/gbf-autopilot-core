function run_process(process)
  local co = coroutine.running()
  local promise = process(process, context)
  promise['then'](promise, function (self, data)
    coroutine.resume(co, data)
  end, function (self, err)
    coroutine.resume(co, nil, err)
  end)
  return coroutine.yield()
end

function refresh_state()
  run_process(steps:Timeout(1500))
  local state, err = run_process(steps.Battle:State())
  if err then
    script_fail(err)
    return
  end
  init_state(state)
end

function attack()
  -- TODO: implement attack function
end

function create_character(charaIdx, chara)
  local character = {
    name = chara.name,
    skill_1_available = false,
    skill_2_available = false,
    skill_3_available = false,
    skill_4_available = false,
    hp = chara.hp,
    max_hp = chara.hpMax,
    hp_percentage = chara.hp / chara.hpMax * 100,
    charge_gauge = chara.ougi,
    is_alive = chara.alive,

    HasStatusEffect = function (self, id)
      for _, effectId in pairs(chara.buffs) do
        if id == effectId then return true end
      end
      for _, buffId in pairs(chara.buffs) do
        if id == effectId then return true end
      end
      return false
    end,
    UseSkill = function (self, skillIdx)
      local result, err = run_process(steps.Combat:UseSkill(charaIdx, skillIdx))
      if err then
        script_fail(err)
        return
      end
      refresh_state()
    end
  }

  for i, skill in pairs(chara.skills) do
    local idx = i + 1
    local key = string.format('skill_%d_available', idx)
    character[key] = skill.available
  end

  return character
end

function init()
  characters = {}
  character_empty = create_character(0, {
    name = '',
    skills = {
      {available = false},
      {available = false},
      {available = false},
      {available = false}
    },
    hp = 0,
    hpMax = 1,
    ougi = 0,
    alive = false
  })
end

function init_characters(state)
  character_1 = character_empty
  character_2 = character_empty
  character_3 = character_empty
  character_4 = character_empty

  for i, chara in pairs(state.party) do
    local idx = i + 1
    local character = create_character(idx, chara)
    characters[character.name] = character

    if idx == 1 then
      character_1 = character
    elseif idx == 2 then
      character_2 = character
    elseif idx == 3 then
      character_3 = character
    elseif idx == 4 then
      character_4 = character
    end
  end
end

function init_state(state)
  logger:debug('Re-initializing state')
  init_characters(state)
end

co = coroutine.create(function ()
  logger:debug('Running script:', script_path)
  local f = loadfile(script_path)

  init(nil)
  init_state(state)

  f(nil)
  attack(nil)
  script_done(nil)
end)
coroutine.resume(co)
