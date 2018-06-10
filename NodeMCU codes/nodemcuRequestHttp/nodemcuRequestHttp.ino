#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "GustavoAF";

const char* password = "gustavo6";

String mac;


/* HC-SR501 Motion Detector */
#define pirPin D1 // Input for HC-S501
int pirValue; // Place to store read PIR Value


void setup() {
  Serial.begin(115200);
  
  
  Serial.println();
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.macAddress());
  mac = WiFi.macAddress();
  
  
  pinMode(pirPin, INPUT);

}

void loop() {
  
  HTTPClient http;
  
  pirValue = digitalRead(pirPin);
  Serial.println(pirValue);
  if (pirValue) 
  { 

    StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
    JsonObject& JSONencoder = JSONbuffer.createObject(); 
 
    JSONencoder["nodeMCU"] = mac;
    JSONencoder["sensor"] = pirPin;

    char JSONmessageBuffer[300];
    JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    Serial.println(JSONmessageBuffer);
    
    http.begin("https://sensoresskynet20181.firebaseapp.com/timestamp/","AB:37:A5:6C:F7:86:1B:F2:C8:29:F9:B2:C9:38:87:47:5D:D4:86:C5"); //HTTP
    http.addHeader("Content-Type", "application/json");
 
    int httpCode = http.POST(JSONmessageBuffer);
    if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            Serial.println(httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
               Serial.println(payload);
            }
        } else {
           Serial.println(http.errorToString(httpCode).c_str());
        }

        http.end();
  }
  
  
  delay(2500);
}


