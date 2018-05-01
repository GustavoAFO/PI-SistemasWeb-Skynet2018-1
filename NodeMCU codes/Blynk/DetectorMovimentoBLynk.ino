#include <ESP8266WiFi.h>

#define BLYNK_PRINT Serial    // Comment this out to disable prints and save space
#include <BlynkSimpleEsp8266.h>
char auth[] = "94044c4968f64b9392cba1580fab2b6c";

/* WiFi credentials */
char ssid[] = "GustavoAF";
char pass[] = "gustavo6";


/* HC-SR501 Motion Detector */
#define pirPin D4 // Input for HC-S501
int pirValue; // Place to store read PIR Value

void setup() {
  Serial.begin(115200);
  delay(10);
  Blynk.begin(auth, ssid, pass);
  pinMode(pirPin, INPUT);

}

void loop() {
  getPirValue();
  Blynk.run();
  delay(1000);
}

void getPirValue(void)
{
  pirValue = digitalRead(pirPin);
  //Serial.println(pirValue);
  if (pirValue) 
  { 
    Serial.println("==> Motion detected");
    Blynk.notify("T==> Motion detected");  
  }
}

