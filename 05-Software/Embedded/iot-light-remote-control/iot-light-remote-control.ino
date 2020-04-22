/*
  ESP8266 based access point with fixed ip address
  for remote controlling Leds through wifi

  A arduino nano is equipped with a Wifi module ESP8266-01
  and leds connected to its PWM-capable pins. Similarly,
  to a backend server, this module emulates an API which
  can be comunicate to a Web / Mobile App through a given
  endpoint e.g. http://192.168.0.111.
  The ip is fixed and set in the local modem, thus allowing
  to always come back to the same address if it is free.

  Created 16.04.2020
  By Victor Tolentino
  Modified 17.04.2020
  By Victor Tolentino

  https://github.com/vtolenti89/iot-light-remote-control
*/

#ifndef IOT_LIGHT_REMOTE_CONTROL
#include "src/libraries/WiFiEsp.h"
#include "SoftwareSerial.h"
#include "src/Led.h"
#include "src/HttpBuffer.h"
#define REQ_ENDPOINT_BUF_SIZE 20 // max buffer size of the request endpoint
#define REQ_PARAM_BUF_SIZE 100    // max buffer size of the parameter + value
#define REQ_VALUE_BUF_SIZE 10    // max buffer size of the parameters values
#define RES_BUF_SIZE 200         // buffer size of the outgoing http response

#define NUMBER_OF_LEDS 3                           // number of leds used
#define LED_MAX_BRIGHTNESS 10                      // max PWM analog value (0 - 255)
#define ARRAY_SIZE(x) (sizeof(x) / sizeof((x)[0])) // returns the size of an array
#endif

/**
   Emulates a serial port on pins 3 and 2
*/
SoftwareSerial Serial1(3, 2); // RX, TX

char ssid[] = "UPC6E2796A";   // your network SSID (name)
char pass[] = "Jmre8szre4ez"; // your network password
int status = WL_IDLE_STATUS;  // the Wifi radio's status
const char *username = "alex";
const char *userpass = "bulibuli";

/**
   Led port numbers being used
   For arduino nano, the PWM-capable pins
   are 3, 5, 6, 9, 10 and 11
*/
const int blueLed = 9;
const int yellowLed = 10;
const int redLed = 11;

Leds leds;

//leds.add(redLed, 100, true);
//leds.add(yellowLed, 100, true);
//leds.add(blueLed, 100, true);

WiFiEspServer server(80);
// use a ring buffer to increase speed and reduce memory allocation
// make sure that the endpoints are smaller than the ring buffer
HttpBuffer reqEndpointBuf(REQ_ENDPOINT_BUF_SIZE); // Buffer for handling the request endpoint
HttpBuffer reqParamBuf(REQ_PARAM_BUF_SIZE);       // Buffer for handling the request parameters
char resBuf[RES_BUF_SIZE];                        // Response buffer to be sent back to the front end

void setup()
{
  // Initializing LEDs
  leds.add(redLed, 100, true);
  leds.add(yellowLed, 100, true);
  leds.add(blueLed, 100, true);

  // Set led ports as outpus
  //DDRB |= (1 << redLed) | (1 << yellowLed) | (1 << blueLed);
  DDRB |= 0xFF;
  Serial.begin(115200); // initialize serial for debugging
  Serial1.begin(9600);  // initialize serial for ESP module
  WiFi.init(&Serial1);  // initialize ESP module

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true)
      ;
  }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network
    //The ip address must match the pattern of your modem
    // meaning 192.168.0.xxx
    IPAddress localIp(192, 168, 0, 111);
    WiFi.config(localIp);
    status = WiFi.begin(ssid, pass);
  }

  Serial.println("You're connected to the network");
  printWifiStatus();
  // start the web server on port 80
  server.begin();
}

void loop()
{
  WiFiEspClient client = server.available(); // listen for incoming clients

  if (client)
  { // if you get a client,
    Serial.println("New client"); // print a message out the serial port
    reqEndpointBuf.init();        // initialize the circular buffer
    while (client.connected())
    { // loop while the client's connected
      if (client.available())
      { // if there's bytes to read from the client,
        char c = client.read(); // read a byte, then
        reqEndpointBuf.push(c); // push it to the ring buffer

        // you got two newline characters in a row
        // that's the end of the HTTP request, so send a response
        if (reqEndpointBuf.endsWith("\r\n\r\n"))
        {
          // Send an empty reponse if no endpoint is passed
          emptyEndpoint();
          sendHttpResponse(client, resBuf);
          break;
        }

        if (reqEndpointBuf.endsWith("GET /light/status"))
        {
          Serial.println("...Getting light status");
          getLightStatus();
          sendHttpResponse(client, resBuf);
          break;
        }
        else if (reqEndpointBuf.endsWith("POST /light/set"))
        {
          // Resetting position of pointer
          reqParamBuf.reset();

          while (client.available())
          {
            //Serial.write(client.read());
            reqParamBuf.push(client.read());

            //Parsing line by line
            if (reqParamBuf.endsWith("\r") || reqParamBuf.endsWith("\n"))
            {

              //Check for authentication if not done yet
              Serial.println("LOG: Authenticating ...");
              if (checkAuth()) {
                Serial.println("User IS valid");
                handleProtectedRoutes();
                getLightStatus();
                break;
              } else {
                Serial.println("User is NOT valid");
                handleInvalidUser();
                break;
              }
              reqParamBuf.reset();
            }
          }

          sendHttpResponse(client, resBuf);
          client.stop();
        }
      }
    }
    // close the connection
    client.stop();
    Serial.println("Client disconnected");
  }
  updateLed();
}

/**
  Checks whether the user and password
  are valid
  @return bool
*/
bool checkAuth()
{
  // Variable for holding the parameter value
  char value [REQ_VALUE_BUF_SIZE] = "";

  if (reqParamBuf.parseParam("user", value)) {
    // User parameter exits, lets check whether it is valid
    if (strcmp(username, value) == 0) {
      // Username is valid, lets check the password
      // Resetting variable value to be reused
      memset(value, 0, sizeof(value));
      if (reqParamBuf.parseParam("pass", value)) {
        // Password parameter exists, lets check whether it is valid
        if (strcmp(userpass, value) == 0) {
          // Password is valid;
          return true;
        } else {
          // Pass is not valid
          return false;
        }
      } else {
        // Pass param does not exist in the request
        return false;
      }
    } else {
      // User is not valid
      return false;
    }
  } else {
    // User param does not exist in the request
    return false;
  }
}

/*
  Converts a string TRUE/FALSE to bool
  @return bool
*/
bool strToBool(char *_str)
{
  if (strcmp(_str, "true") == 0)
    return true;
  else
    return false;
}

/*
   Protected Routes which should be called
   only if the user is valid
   @return void
*/
void handleProtectedRoutes()
{
  // Declare parameters which should be checked in the request
  const char *ledReqs[] = {"rlbri", "rlon", "ylbri", "ylon", "blbri", "blon"};

  // Shared variable for handling the return value of each param
  char value [REQ_VALUE_BUF_SIZE] = "";

  // Loops through and search each parameter in the request
  // If a parameter exists, its value is used accordingly
  for (int i = 0; i < ARRAY_SIZE(ledReqs); i++)
  {
    // Resetting the value variable to be reused
    memset(value, 0, sizeof(value));
    if (reqParamBuf.parseParam(ledReqs[i], value)) {
      if (strcmp(ledReqs[i], "blbri") == 0) {
        leds.setBrightness(blueLed, atoi(value));
      } else if (strcmp(ledReqs[i], "blon") == 0) {
        leds.setState(blueLed, strToBool(value));
      }  else if (strcmp(ledReqs[i], "ylbri") == 0) {
        leds.setBrightness(yellowLed, atoi(value));
      } else if (strcmp(ledReqs[i], "ylon") == 0) {
        leds.setState(yellowLed, strToBool(value));
      } else if (strcmp(ledReqs[i], "rlbri") == 0) {
        leds.setBrightness(redLed, atoi(value));
      } else if (strcmp(ledReqs[i], "rlon") == 0) {
        leds.setState(redLed, strToBool(value));
      }
    }
  }
}

/**
   Prepare a json response with the led
   status to be sent back to the user.
   The response is save in the resBuf buffer
   @return void
*/
void getLightStatus() {
  snprintf(
    resBuf,
    sizeof(resBuf),
    "{\"redLed\":{\"brightness\":%u,\"isOn\": %d},"
    "\"yellowLed\":{\"brightness\":%u,\"isOn\":%d},"
    "\"blueLed\":{\"brightness\":%u,\"isOn\":%d}}",
    leds.getBrightness(redLed),
    leds.getState(redLed),
    leds.getBrightness(yellowLed),
    leds.getState(yellowLed),
    leds.getBrightness(blueLed),
    leds.getState(blueLed));
}

/**
   Prepare a json response with
   an invalid response
   @return void
*/
void handleInvalidUser() {
  snprintf(
    resBuf,
    sizeof(resBuf),
    "{\"Error\": \"User or password not valid\"}");
}

/**
   Prepare a json response with
   an empty reponse
   @return void
*/
void emptyEndpoint() {
  snprintf(
    resBuf,
    sizeof(resBuf),
    "This is the IoT Server :-D");
}

/*
  Updates the leds status continuously
  @return void
*/
void updateLed() {
  for (int i = 0; i < leds.getQuantity(); i++) {
    if (leds.devs[i].getState()) {
      analogWrite(leds.devs[i].getPin(), leds.devs[i].getBrightness() * LED_MAX_BRIGHTNESS / 100);
    } else {
      analogWrite(leds.devs[i].getPin(), 0);
    }
  }
}

/*
  Prepares and sends the response to the user
  @return void
*/
void sendHttpResponse(WiFiEspClient client, char const *response) {
  // Set the headers of the response
  setHeaders(client);

  // Add the reponse body
  client.println(response);

  // The HTTP response ends with another blank line:
  client.println();
}

/*
  Prepares the headers of the response
  @return void
*/
void setHeaders(WiFiEspClient client)
{
  // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
  // and a content-type so the client knows what's coming, then a blank line:
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:application/json"); // comment out if a back end rendered file is wished
  client.println("Access-Control-Allow-Origin: *");
  client.println("Allow: HEAD,GET,PUT,POST,DELETE,OPTIONS");
  client.println("Access-Control-Allow-Methods: GET, HEAD, POST, PUT");
  client.println();
};

/*
  Prints the wifi status
  @return void
*/
void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print where to go in the browser
  Serial.println();
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
  Serial.println();
}

/*
  Add CORS to the response heades
  since the request is coming from
  another server
  @return void
*/
void setCors(WiFiEspClient client)
{
  Serial.print("HTTP Method: ");
  //client.println("Content-type:application/json");
  client.println("Access-Control-Allow-Origin: *");
  client.println("Allow: HEAD,GET,PUT,POST,DELETE,OPTIONS");
  client.println("Access-Control-Allow-Methods: GET, HEAD, POST, PUT");
  //client.println("Access-Control-Allow-Headers: X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept");
}
