#define USE_ARDUINO_INTERRUPTS true
#include <PulseSensorPlayground.h>
#include <SoftwareSerial.h>

const int PulseWire = 0;
const int LED13 = 13;
int Threshold = 550;
int val;
int tempPin = 1;
unsigned long previousMillis = 0;
const long interval = 10; // Réduit l'intervalle à 10 ms

PulseSensorPlayground pulseSensor;
SoftwareSerial blue(2, 3);

void setup() {
  Serial.begin(9600);
  blue.begin(9600);
  pulseSensor.analogInput(PulseWire);
  // pulseSensor.blinkOnPulse(LED13); // Désactivé pour tester
  pulseSensor.setThreshold(Threshold);

  if (pulseSensor.begin()) {
    Serial.println("PulseSensor initialisé avec succès.");
  } else {
    Serial.println("Erreur lors de l'initialisation du PulseSensor. Vérifiez le câblage et les paramètres.");
  }
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Read sensor values
    int myBPM = pulseSensor.getBeatsPerMinute();
    val = analogRead(tempPin);
    float mv = (val / 1024.0) * 5000;
    float cel = mv / 10;
    int cell = mv / 10;

    // Print values without waiting for a beat
    //Serial.print("Heart Rate Sensor Value: ");
    Serial.print(myBPM);

    //blue.print("Temperature Sensor Value: ");
    blue.print(cell);
  }
}
