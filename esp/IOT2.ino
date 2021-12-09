#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#define trigPin D4 //Definições pinos
#define echoPin D3
#define LED_R D5
#define ledG D6
#define ledB D7
int pinoSensorLuz = A0; 

void sensorLuz(); //Prototipos das funções
void sensor();

#define velo 0.034 //definições variáveis gerais
long duration; 
float proximidade;
char caracter[4];              
int luz = 0; 
String dadosLuz = {};
String dadosProximidade= {};

const char* ssid = "SATC IOT";
const char* password = "IOT2021#";

//Dominio do Path
const char* serverName = "http://us-central1-iot-ii-2030.cloudfunctions.net/api/dados";

// Contagem de tempo
unsigned long lastTime = 0;
unsigned long timerDelay = 10000;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("Conectando");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado ao WiFI no IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  sensorLuz();
  sensor();
  dadosLuz=String(luz);
  dadosProximidade=String(proximidade);
  //Manda o POST a cada 10s
  if ((millis() - lastTime) > timerDelay) {
    //Verifica status da conexão
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      
      // Dominio Path
      http.begin(client, serverName);

      // Especifica o tipo de conteudo
      http.addHeader("Content-Type", "application/json");
      // POST
      int httpResponseCode = http.POST("{\"dados\":\"{\"luz\": "+(String)luz+",\"proximidade\": "+(String)proximidade+" }\",\"id\": 1}");           
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
    } 
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

void sensor(){
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);  
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH); 
  proximidade = duration * velo/2;
  delay(3000);
  Serial.print("Distância Sensor Ultrassonico:  ");
  Serial.println(proximidade);
}

void sensorLuz(){
  luz = analogRead(pinoSensorLuz); 
  delay(5000);
  Serial.print("Sensor LUX:  ");
  Serial.println(luz);
}
