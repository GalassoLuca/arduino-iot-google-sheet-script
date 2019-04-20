const contentsWithoutValues = {
  event_id: '3f12fdc2-6f00-59c5-b06f-3ce9cbbbfd4e',
  webhook_id: 't:ffc68fbc-4f4e-4bb2-9c33-4f517a2fdb89',
  device_id: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba',
  thing_id: 'ffc68fbc-4f4e-4bb2-9c33-4f517a2fdb89'
}

const contentsWithCorruptedValue = {
  ...contentsWithoutValues,
  values: [{
    updated_at: 'I have been corrupted'
  }]
}

const contentsWithOldValue = {
  ...contentsWithoutValues,
  values: [{
    updated_at: '2019-04-16T19:06:00.914Z'
  }]
}

const contentsWithSingleValue = {
  ...contentsWithoutValues,
  values: [{
    id: '7a7c007a-a09f-4a40-868e-f59d3ea6bb87',
    name: 'MKR_env_shield_variable',
    value: '{ Temperature: 24.59, Humidity: 51.77, Pressure: 100.26, Lux: 17.74, UVA: 0.00, UVB: 0.00, UVIndex: 0.00 }',
    persist: false,
    updated_at: (new Date()).toISOString(),
    created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
  }]
}

function contentsToWebHookObject (contents) {
  return {
    postData: {
      contents: JSON.stringify(contents)
    }
  }
}

module.exports = {
  objectWithoutValues: contentsToWebHookObject(contentsWithoutValues),
  objectWithCorruptedValue: contentsToWebHookObject(contentsWithCorruptedValue),
  objectWithOldValue: contentsToWebHookObject(contentsWithOldValue),
  objectWithSingleValue: contentsToWebHookObject(contentsWithSingleValue)
}
