#include "arduino_secrets.h"
#include "thingProperties.h"

#include <Arduino_MKRENV.h>
#include <ArduinoLowPower.h>

#define isDebugEnable 0

void setup() {
  if (isDebugEnable) {
    Serial.begin(9600);
    while (!Serial);
  }

  pinMode(LED_BUILTIN, OUTPUT);

  if (!ENV.begin()) {
    while (1) {
      debug("Failed to initialize MKR ENV shield!");
      delay(1000);
    }
  }

  // Defined in thingProperties.h
  initProperties();

  // Connect to Arduino IoT Cloud
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);

  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();
  
  Count = 0;
}

void loop() {
  while (!ArduinoCloud.connected()) {
    ArduinoCloud.update();
    delay(1000);
    toggleLed(50, 50);
    toggleLed(50, 50);
  }

  Count ++;
  debug("Count       = " + String(Count));

  float Temperature = ENV.readTemperature();
  debug("Temperature = " + String(Temperature) + " celsius");

  float Humidity = ENV.readHumidity();
  debug("Humidity    = " + String(Humidity) + " %");

  float Pressure = ENV.readPressure();
  debug("Pressure    = " + String(Pressure) + " kPa");

  float Lux = ENV.readLux();
  debug("Lux         = " + String(Lux));

  float UVA = ENV.readUVA();
  debug("UVA         = " + String(UVA));

  float UVB = ENV.readUVB();
  debug("UVB         = " + String(UVB));

  float UVIndex = ENV.readUVIndex();
  debug("UV Index    = " + String(UVIndex));

  JSON_env_variables = "{ \"Temperature\": " + String(Temperature) + ", \"Humidity\": " + String(Humidity) + ", \"Pressure\": " + String(Pressure) + ", \"Lux\": " + String(Lux) + ", \"UVA\": " + String(UVA) + ", \"UVB\": " + String(UVB) + ", \"UVIndex\": " + String(UVIndex) + " }";
  // debug(MKR_env_shield_variable);

  debug("");

  ArduinoCloud.update();

  if (isDebugEnable) {
    delay(5 * 1000);
  } else {
    LowPower.deepSleep(10 * 60 * 1000);
  }
}

void debug(String s) {
  toggleLed(100, 50);
  if (isDebugEnable) {
    Serial.println(s);
  }
}

void toggleLed (int on, int off) {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(on);
  digitalWrite(LED_BUILTIN, LOW);
  delay(off);
}
