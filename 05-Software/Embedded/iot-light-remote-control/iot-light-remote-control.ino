#ifndef IOT_LIGHT_REMOTE_CONTROL
#include "src/libraries/WiFiEsp.h"
#include "SoftwareSerial.h"
#define RES_BUF_SIZE 200
#define IN_DATA_SIZE 100
#define TEMP_IN_DATA_SIZE 20
#define NUMBER_OF_LAMPS 3
#define LED_MAX_BRIGHTNESS 10
#define ARRAY_SIZE(x) ( sizeof(x) / sizeof((x)[0]) )
SoftwareSerial Serial1(3, 2); // RX, TX
#endif

class Led {
  public:
    Led(int pin, unsigned int brightness, bool on);
    void setPin(unsigned int _pin) {
      pin = _pin;
    }
    void setBrightness(unsigned int _brightness) {
      brightness = _brightness;
    }
    void setState(bool _state) {
      isOn = _state;
    }
    unsigned int getPin() {
      return pin;
    }
    unsigned int  getBrightness() {
      return brightness;
    }
    bool getState() {
      return isOn;
    }

  private:
    unsigned int pin;
    unsigned int brightness;
    bool isOn;
};

Led::Led(int _pin, unsigned int _brightness, bool _state) {
  setPin(_pin);
  setBrightness(_brightness);
  setState(_state);
}



char ssid[] = "UPC6E2796A";            // your network SSID (name)
char pass[] = "Jmre8szre4ez";        // your network password
int status = WL_IDLE_STATUS;
char httpResBuf [RES_BUF_SIZE];
const int blueLed = 9;
const int yellowLed = 10;
const int redLed = 11;
char inData[IN_DATA_SIZE]; // Allocate some space for the string
char * inDataP = inData;
char tempInData[TEMP_IN_DATA_SIZE]; // Allocate some space for the string


const char * username = "alex";
const char * userpass = "bulibuli";


Led leds[NUMBER_OF_LAMPS] = {Led{redLed, 100, true}, Led{yellowLed, 100, true}, Led{blueLed, 100, true},};

WiFiEspServer server(80);
// use a ring buffer to increase speed and reduce memory allocation
// make sure that the endpoints are smaller than the ring buffer
RingBuffer buf(20);

char * tb = NULL;

void setup()
{
  // Set led ports as outpus
  //DDRB |= (1 << redLed) | (1 << yellowLed) | (1 << blueLed);
  DDRB |= 0xFF;
  Serial.begin(115200);   // initialize serial for debugging
  Serial1.begin(9600);    // initialize serial for ESP module
  WiFi.init(&Serial1);    // initialize ESP module

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true);
  }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED) {
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
  WiFiEspClient client = server.available();  // listen for incoming clients

  if (client) {                               // if you get a client,
    Serial.println("New client");             // print a message out the serial port
    buf.init();                               // initialize the circular buffer
    while (client.connected()) {              // loop while the client's connected
      if (client.available()) {               // if there's bytes to read from the client,
        char c = client.read();               // read a byte, then
        buf.push(c);                          // push it to the ring buffer
        //buf.getStr(tb,0);

        // printing the stream to the serial monitor will slow down
        // the receiving of data from the ESP filling the serial buffer
        //Serial.write(c);

        // you got two newline characters in a row
        // that's the end of the HTTP request, so send a response
        if (buf.endsWith("\r\n\r\n")) {
          // Send an empty reponse if no endpoint is passed
          Serial.println("...Sending reponse.");
          sendHttpResponse(client, httpResBuf);
          break;
        }

        if (buf.endsWith("GET /light/status")) {
          Serial.println("...Getting light status");
          getLightStatus();
        }
        else if (buf.endsWith("POST /light/set")) {
          Serial.println("...POST:");

          // Resetting position of pointer
          resetBuffer(inData, IN_DATA_SIZE);
          inDataP = &inData[0];

          while (client.available()) {
            //Serial.write(client.read());

            *inDataP = client.read();

            //Parsing line by line
            if (*inDataP == '\r' || *inDataP == '\n') {


              //Check for authentication if not done yet
              Serial.println("LOG: Authenticating ...");
              Serial.println(inData);
              if (checkAuth(inData)) {
                Serial.println("User IS Valid");
                checkLeds(inData);
              } else {
                Serial.println("User NOT valid");
                break;
              }

              resetBuffer(inData, IN_DATA_SIZE);
              inDataP = &inData[0];
            } else {
              inDataP++;
            }
          }
          //*inDataP = '\0';

          //Serial.println("...END");
          //Serial.println(inData);

          getLightStatus();
          sendHttpResponse(client, httpResBuf);
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

char * parseData (char * _str1, const char * _str2) {

  char * s = strstr(_str1, _str2);
  resetBuffer(tempInData, TEMP_IN_DATA_SIZE);
  char * u = tempInData;
  Serial.print("Parsing;");
  Serial.println(_str2);
  Serial.println(s);
  if (s) {

    s = s + strlen(_str2) + 1;

    while ((*s != ' ') && (*s != '\r') && (*s != '\n') && (*s != '&')) {

      *u = *s;
      s++;
      u++;
    }
    //r -= shift;
    //cout << "r:" << r << endl;
    //reset pointer to the begining
    u = &tempInData[0];
    Serial.print("Return:");
    Serial.println(u);
    return u;
  } else {
    Serial.println("LOG: Parse does not exist");
    return NULL;
  }
}

/*
  void printLedStatus() {
  Serial.println("..Printing leds Status:");
  for (int i = 0; i < NUMBER_OF_LAMPS; i++) {
    Serial.print("pin:");
    Serial.println(leds[i].getPin());
    Serial.print("brightness:");
    Serial.println(leds[i].getBrightness());
    Serial.print("isOn:");
    Serial.println(leds[i].getState());
  }
  }
*/

bool checkAuth(char * req ) {
  char * _user = parseData(req, "user");
  if (_user) {
    // user parameter exits, lets check whether it is valid
    if (strcmp(username, _user ) == 0) {
      // username is valid, lets check the password
      char * _pass = parseData(req, "pass");
      if (_pass) {
        // password parameter exists, lets check whether it is valid

        if (strcmp(userpass, _pass) == 0) {
          // password is valid;
          return true;
        } else {
          // password is not valid
          free(_pass);
          return false;
        }

      } else {
        free(_pass);
        return false;
      }
    } else {
      // username not valid
      free(_user);
      return false;
    }
  } else {
    // user param does not exist
    free(_user);
    return false;
  }



}

unsigned int findLedIndex(unsigned int _led) {
  for (int i = 0; i < ARRAY_SIZE(leds); i++) {
    if (leds[i].getPin() == _led)
      return i;
  }
  return 0;
}

bool to_bool(char * _str) {
  if (strcmp(_str, "true") == 0)
    return true;
  else
    return false;
}

bool checkLeds(char * req) {
  const char * ledReqs [] = {"rlbri", "rlon", "ylbri", "ylon", "blbri", "blon"};
  // Serial.println("checking leds");
  for (int i = 0; i < ARRAY_SIZE(ledReqs); i++) {
    char * _led = parseData(req, ledReqs[i]);
    if (_led) {
      //  Serial.println("...found sth");
      if (strcmp(ledReqs[i], "blbri") == 0) {
        //   Serial.println("setting brightness..");
        leds[findLedIndex(blueLed)].setBrightness(atoi(_led));
      } else if (strcmp(ledReqs[i], "blon") == 0) {
        //   Serial.println("setting on..");
        leds[findLedIndex(blueLed)].setState(to_bool(_led));
      } else if (strcmp(ledReqs[i], "ylbri") == 0) {
        //   Serial.println("setting on..");
        leds[findLedIndex(yellowLed)].setBrightness(atoi(_led));
      } else if (strcmp(ledReqs[i], "ylon") == 0) {
        //   Serial.println("setting on..");
        leds[findLedIndex(yellowLed)].setState(to_bool(_led));
      } else if (strcmp(ledReqs[i], "rlbri") == 0) {
        //   Serial.println("setting on..");
        leds[findLedIndex(redLed)].setBrightness(atoi(_led));
      } else if (strcmp(ledReqs[i], "rlon") == 0) {
        //   Serial.println("setting on..");
        leds[findLedIndex(redLed)].setState(to_bool(_led));
      }
    }
    free(_led);
  }
}




/**
   Prepare a json file
*/
void getLightStatus()
{
  snprintf(
    httpResBuf,
    sizeof(httpResBuf),
    "{\"redLed\":{\"brightness\":%u,\"isOn\": %d},"
    "\"yellowLed\":{\"brightness\":%u,\"isOn\":%d},"
    "\"blueLed\":{\"brightness\":%u,\"isOn\":%d}}",
    leds[0].getBrightness(),
    leds[0].getState(),
    leds[1].getBrightness(),
    leds[1].getState(),
    leds[2].getBrightness(),
    leds[2].getState()
  );
}

void resetBuffer(char * buf, int _size)
{
  memset(buf, 0, _size);
}

void printBuffer(const char * buf) {
  //Serial.println("Printing buffer");
  for (const char * p = buf; *p; p++) {
    Serial.print(*p);
  }
}

void updateLed()
{
  for (int i = 0; i < NUMBER_OF_LAMPS; i++) {
    if (leds[i].getState()) {
      analogWrite(leds[i].getPin(), leds[i].getBrightness()*LED_MAX_BRIGHTNESS / 100);
    } else {
      analogWrite(leds[i].getPin(), 0);
    }
  }
}


void sendHttpResponse(WiFiEspClient client, char const * response )
{
  // Set the headers of the response
  setHeaders(client);

  client.println(response);

  // The HTTP response ends with another blank line:
  client.println();
}

void setHeaders(WiFiEspClient client) {
  // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
  // and a content-type so the client knows what's coming, then a blank line:
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:application/json"); // comment out if a back end rendered file is wished
  client.println("Access-Control-Allow-Origin: *");
  client.println("Allow: HEAD,GET,PUT,POST,DELETE,OPTIONS");
  client.println("Access-Control-Allow-Methods: GET, HEAD, POST, PUT");
  client.println();
};

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


void setCors(WiFiEspClient client)
{
  Serial.print("HTTP Method: ");
  //client.println("Content-type:application/json");
  client.println("Access-Control-Allow-Origin: *");
  client.println("Allow: HEAD,GET,PUT,POST,DELETE,OPTIONS");
  client.println("Access-Control-Allow-Methods: GET, HEAD, POST, PUT");
  //client.println("Access-Control-Allow-Headers: X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept");
}
