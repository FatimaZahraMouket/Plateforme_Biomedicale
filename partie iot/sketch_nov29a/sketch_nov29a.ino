#define USE_ARDUINO_INTERRUPTS true
#include <PulseSensorPlayground.h>
#include <SoftwareSerial.h>

const int PulseWire = 0;
const int LED13 = 13;
int Threshold = 550;
int val;
int myBPM;
int tempPin = 1;
int bmp = 0;
unsigned long previousMillis = 0;
const long interval = 10; // Réduit l'intervalle à 10 ms

PulseSensorPlayground pulseSensor;
SoftwareSerial blue(7, 8);

void setup() {
  Serial.begin(9600);
  blue.begin(1300);
  pulseSensor.analogInput(PulseWire);
  // pulseSensor.blinkOnPulse(LED13); // Désactivé pour tester
  pulseSensor.setThreshold(Threshold);

  if (pulseSensor.begin()) {
    //Serial.println("PulseSensor initialisé avec succès.");
  } else {
    //Serial.println("Erreur lors de l'initialisation du PulseSensor. Vérifiez le câblage et les paramètres.");
  }
}

void loop() {

    // Read sensor values
    myBPM = analogRead(bmp);
    val = analogRead(tempPin);
    float mv = (val / 1024.0) * 5000;
    float cel = mv / 10;
    int cell = mv / 10;

    // Print values without waiting for a beat
    //Serial.print("Heart Rate Sensor Value: ");
    Serial.print(myBPM);

    //blue.print("Temperature Sensor Value: ");
    blue.print(cell);
    delay(0);
  
}