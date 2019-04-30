const currentISODateString = (new Date()).toISOString()

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

const MKR_env_shield_variables = {
  id: '7a7c007a-a09f-4a40-868e-f59d3ea6bb87',
  name: 'MKR_env_shield_variables',
  value: '{ "Temperature": 24.59, "Pressure": 100.26, "UVB": 0.00 }',
  persist: false,
  updated_at: currentISODateString,
  created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
}

const MKR_values = [{
  id: '7a7c007a-a09f-4a40-868e-f59d3ea6bb87',
  name: 'Temperature',
  value: 24.59,
  persist: false,
  updated_at: currentISODateString,
  created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
}, {
  id: '7a7c007a-a09f-4a40-868e-f59d3ea6bb87',
  name: 'Pressure',
  value: 100.26,
  persist: false,
  updated_at: currentISODateString,
  created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
}, {
  id: '7a7c007a-a09f-4a40-868e-f59d3ea6bb87',
  name: 'UVB',
  value: 0.0,
  persist: false,
  updated_at: currentISODateString,
  created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
}]

const temperatureValue = {
  id: '6a6c006a-a09f-4a40-868e-f59d3ea6bb86',
  name: 'Temperature',
  value: 24.59,
  persist: false,
  updated_at: currentISODateString,
  created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
}

const humidityValue = {
  id: '5a5c005a-a09f-4a40-858e-f59d3ea5bb85',
  name: 'Humidity',
  value: 51.77,
  persist: false,
  updated_at: currentISODateString,
  created_by: 'd2016b52-72ad-4dd0-9a86-877a7e8ae2ba'
}

const contentsWithEnvVarsOnly = {
  ...contentsWithoutValues,
  values: [MKR_env_shield_variables]
}

const contentsWithSingleValue = {
  ...contentsWithoutValues,
  values: [temperatureValue]
}

const contentsWithVarsExcludingEnvVars = {
  ...contentsWithoutValues,
  values: [temperatureValue, humidityValue]
}

const contentsWithVarsIncludingEnvVars = {
  ...contentsWithoutValues,
  values: [temperatureValue, humidityValue, MKR_env_shield_variables]
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
  objectWithSingleValue: contentsToWebHookObject(contentsWithSingleValue),
  objectWithEnvVarsOnly: contentsToWebHookObject(contentsWithEnvVarsOnly),
  objectWithVarsIncludingEnvVars: contentsToWebHookObject(contentsWithVarsIncludingEnvVars),
  objectWithVarsExcludingEnvVars: contentsToWebHookObject(contentsWithVarsExcludingEnvVars),
  MKR_values,
  temperatureValue,
  humidityValue
}
