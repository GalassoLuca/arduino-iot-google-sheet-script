#include <ArduinoIoTCloud.h>
#include <WiFiConnectionManager.h>

const char THING_ID[] = "ffc68fbc-4f4e-4bb2-9c33-4f517a2fdb89";

const char SSID[]     = SECRET_SSID;    // Network SSID (name)
const char PASS[]     = SECRET_PASS;    // Network password (use for WPA, or use as key for WEP)


String JSON_env_variables;
int Count;

void initProperties(){
  ArduinoCloud.setThingId(THING_ID);
  ArduinoCloud.addProperty(JSON_env_variables, READ, ON_CHANGE, NULL);
  ArduinoCloud.addProperty(Count, READ, ON_CHANGE, NULL);
}

ConnectionManager *ArduinoIoTPreferredConnection = new WiFiConnectionManager(SSID, PASS);
