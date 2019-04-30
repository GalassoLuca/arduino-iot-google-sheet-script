#include "arduino_secrets.h"
#include "arduino_secrets.h"
#include <Arduino_MKRENV.h>
#include "thingProperties.h"

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!ENV.begin()) {
    Serial.println("Failed to initialize MKR ENV shield!");
    while (1);
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
  ArduinoCloud.update();
  
  Count ++;
  Serial.println(Count);

  float Temperature = ENV.readTemperature();
  Serial.print("Temperature = ");
  Serial.print(Temperature);
  Serial.println(" °C");

  float Humidity = ENV.readHumidity();
  Serial.print("Humidity    = ");
  Serial.print(Humidity);
  Serial.println(" %");

  float Pressure = ENV.readPressure();
  Serial.print("Pressure    = ");
  Serial.print(Pressure);
  Serial.println(" kPa");

  float Lux = ENV.readLux();
  Serial.print("Lux         = ");
  Serial.println(Lux);

  float UVA = ENV.readUVA();
  Serial.print("UVA         = ");
  Serial.println(UVA);

  float UVB = ENV.readUVB();
  Serial.print("UVB         = ");
  Serial.println(UVB);

  float UVIndex = ENV.readUVIndex();
  Serial.print("UV Index    = ");
  Serial.println(UVIndex);

  JSON_env_variables = "{ \"Temperature\": " + String(Temperature) + ", \"Humidity\": " + String(Humidity) + ", \"Pressure\": " + String(Pressure) + ", \"Lux\": " + String(Lux) + ", \"UVA\": " + String(UVA) + ", \"UVB\": " + String(UVB) + ", \"UVIndex\": " + String(UVIndex) + " }";
  // Serial.println(MKR_env_shield_variable);

  Serial.println();

  // https://www.arduino.cc/en/Tutorial/LowPowerTimedWakeup
  delay(10 * 60 * 1000);
}
