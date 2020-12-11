#include <ArduinoJson.h>
#include <String.h>
#include <LiquidCrystal.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#include <Arduino.h>
#include <stdlib.h>

int temp = 0;
int maxtemp = 0;
int mintemp = 0;
int condition = 0;
int windspeed = 0;
String timeMode = "now";
String timeModeLabel = "now";
unsigned long updateInterval = 180000; // In miliseconds i.e. update data every 3 minutes.
bool is_pressed = false;               // true if any button is pressed

// Pin numbers
int nowButton = 12;
int twoHourButton = 14;
int sevenHourButton = 27;
int nextDayButton = 26;
int LED_PIN = 25;
int LED_COUNT = 25;

const char *root_ca = "94:FC:F6:23:6C:37:D5:E7:92:78:3C:0B:5F:AD:0C:E4:9E:FD:9E:A8";
String host = "https://weather-indicator.herokuapp.com/"; // The URL of our server
String base_url = "https://weather-indicator.herokuapp.com/helsinki?time=";

const char *ssid = "";     // Replace with your WiFi name
const char *password = ""; // Replace with your WiFi password

WiFiMulti WiFiMulti;                                               // Create WiFi object
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800); // Create the NeoPixels strip object
LiquidCrystal lcd(15, 2, 4, 16, 17, 5);                            // Create the LCD object
unsigned long last_update = millis();                              // Last update time

const size_t capacity = JSON_OBJECT_SIZE(5) + 50; // The size of the received JSON data.

//Return true if any button is pressed, otherwise return false
bool aButtonIsPressed()
{

    return digitalRead(nowButton) == 1 || digitalRead(twoHourButton) == 1 || digitalRead(sevenHourButton) == 1 || digitalRead(nextDayButton) == 1;
}

void getData()
{
    String dataString;
    if ((WiFiMulti.run() == WL_CONNECTED))
    {

        HTTPClient https;

        Serial.print("[HTTPS] begin...\n");
        String request_url = base_url + timeMode;
        if (https.begin(request_url, root_ca))
        { // HTTPS

            Serial.print("[HTTPS] GET...\n");
            // start connection and send HTTP header
            int httpCode = https.GET();

            // httpCode will be negative on error
            if (httpCode > 0)
            {
                // HTTP header has been send and Server response header has been handled
                Serial.printf("[HTTPS] GET... code: %d\n", httpCode);

                // file found at server
                if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY)
                {
                    dataString = https.getString();
                }
            }
            else
            {
                Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
            }

            https.end();
        }
        else
        {
            Serial.printf("[HTTPS] Unable to connect\n");
        }
    }
    DynamicJsonDocument doc(capacity);
    deserializeJson(doc, dataString); // Create an object from the JSON string received from the server
                                      //Assign the data to the variables
    temp = doc["temp"];
    maxtemp = doc["maxtemp"];
    mintemp = doc["mintemp"];
    condition = doc["weather"];
    windspeed = doc["windspeed"];
    return;
}

void renderInfo()
{
    lcd.clear();
    String condition_string = "";
    turnOffWeatherIndicators();
    switch (condition)
    {
    case 0:
        // switch on light for clear
        // 0,0,255
        condition_string = "clear";
        strip.setPixelColor(12, 0, 255, 0);
        break;
    case 1:
        // switch on light for thunderstorm
        // 0,0,255
        condition_string = "thunderstorm";
        strip.setPixelColor(18, 255, 0, 0);
        break;
    case 2:
        //switch on light for shower rain
        // 0,0,255
        condition_string = "shower rain";
        strip.setPixelColor(17, 0, 0, 255);
        break;
    case 3:
        //switch on light for rain
        // 0,0,255
        condition_string = "rain";
        strip.setPixelColor(16, 0, 0, 255);
        break;
    case 4:
        //switch on light for snow
        // 0,0,255
        condition_string = "snow";
        strip.setPixelColor(19, 0, 0, 255);
        break;
    case 5:
        //switch on light for mist
        // 0,0,255
        condition_string = "mist";
        strip.setPixelColor(15, 0, 0, 255);
        break;
    case 6:
        //switch on light for few clouds
        // 0,0,255
        condition_string = "few";
        strip.setPixelColor(13, 0, 0, 255);
        break;
    case 7:
        //change light color for scattered clouds
        //0,255,255
        condition_string = "scattered";
        strip.setPixelColor(14, 0, 255, 255);
        break;
    case 8:
        //change light color for broken clouds
        //0,115,255
        condition_string = "broken";
        strip.setPixelColor(14, 0, 115, 255);
        break;
    case 9:
        //change light color for overcast clouds
        //0,0,255
        condition_string = "overcast";
        strip.setPixelColor(14, 0, 0, 255);
        break;
    default:
        break;
    }
    //windlevel
    switch (windspeed)
    {
    case 0:
        // 255,255,255
        strip.setPixelColor(20, 255, 255, 255);
        break;
    case 1:
        //174,241,249
        strip.setPixelColor(20, 174, 241, 249);
        break;
    case 2:
        //150,247,220
        strip.setPixelColor(20, 150, 247, 220);
        break;
    case 3:
        //150,247,180
        strip.setPixelColor(20, 150, 247, 180);
        break;
    case 4:
        //111,244,111
        strip.setPixelColor(20, 111, 244, 111);
    case 5:
        //115,237,18
        strip.setPixelColor(20, 115, 237, 18);
        break;
    case 6:
        //164,237,18
        strip.setPixelColor(20, 164, 237, 18);
        break;
    case 7:
        //218, 237, 18
        strip.setPixelColor(20, 218, 237, 18);
        break;
    case 8:
        //237,194,18
        strip.setPixelColor(20, 237, 194, 18);
        break;
    case 9:
        //237,143,18
        strip.setPixelColor(20, 237, 143, 18);
        break;
    case 10:
        //237,99,18
        strip.setPixelColor(20, 237, 99, 18);
        break;
    case 11:
        //237,41,18
        strip.setPixelColor(20, 237, 41, 18);
        break;
    case 12:
        strip.setPixelColor(20, 213, 16, 45);
        //213,16,45
        break;
    default:
        break;
    }
    if (timeMode == "tomorrow") // print min and max temperature if the time mode is tomorrow
    {
        Serial.println("Min max");
        lcd.print("Min: ");
        lcd.print(mintemp);
        lcd.print(" Max: ");
        lcd.print(maxtemp);
    }
    else
    {
        lcd.print("Temp: ");
        lcd.print(temp);
    }
    int redBL;
    int greenBL;
    int blueBL;
    if (temp < -20)
    {
        redBL = 0;
        greenBL = 0;
        blueBL = 255;
    }
    else if (temp > 30)
    {
        redBL = 255;
        greenBL = 0;
        blueBL = 0;
    }
    else
    {
        int mapped_val = map(temp, -20, 30, 0, 1020);
        if (mapped_val <= 255)
        {
            blueBL = 255;
            greenBL = mapped_val;
            redBL = 0;
        }
        else if (mapped_val <= 510)
        {
            blueBL = 255 - (mapped_val - 255);
            greenBL = 255;
            redBL = 0;
        }
        else if (mapped_val <= 765)
        {
            blueBL = 0;
            greenBL = 255;
            redBL = mapped_val - 510;
        }
        else
        {
            blueBL = 0;
            greenBL = 255 - (mapped_val - 765);
            redBL = 255;
        }
    }
    //set RGB value for ambient light using redBL, greenBL, blueBL
    for (size_t i = 0; i < 12; i++)
    {
        strip.setPixelColor(i, redBL, greenBL, blueBL);
    }
    strip.show();
}

//Turn off the time mode indicators LEDs on top of the buttons
void turnOffTimeModeIndicators()
{
    for (size_t i = 21; i < 25; i++)
    {
        strip.setPixelColor(i, 0, 0, 0);
        strip.show();
    }
}

//Turn off the LEDs behing the weather symbols
void turnOffWeatherIndicators()
{
    for (size_t i = 12; i < 21; i++)
    {
        strip.setPixelColor(i, 0, 0, 0);
        strip.show();
    }
}

void setup()
{
    //Initialize LCD
    lcd.begin(16, 2);
    lcd.print("Starting up");
    lcd.blink();
    //Initialze Serial loggin
    Serial.begin(9600);
    while (!Serial)
        continue;
    //Initialize LED strip
    strip.begin();
    strip.setBrightness(50);
    strip.fill(strip.Color(255, 0, 0), 0, 23);
    strip.show();
    while (!Serial)
        continue;
    for (uint8_t t = 4; t > 0; t--)
    {
        Serial.printf("[SETUP] WAIT %d...\n", t);
        Serial.flush();
        delay(1000);
    }
    //Initialize WiFi connection
    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP(ssid, password);
    strip.clear();
    strip.setPixelColor(21, 255, 255, 255);
    strip.show();
    lcd.noBlink();
    //Set pin mode
    pinMode(nowButton, INPUT);
    pinMode(twoHourButton, INPUT);
    pinMode(sevenHourButton, INPUT);
    pinMode(nextDayButton, INPUT);
}

void loop()
{
    if (aButtonIsPressed() && is_pressed == false) // Not executed if there is already a button being pressed. This prevents bugs when two buttons are pressed simultaneously or being held down
    {
        is_pressed = true;
        turnOffTimeModeIndicators();
        if (digitalRead(nowButton))
        {
            timeMode = "now";
            timeModeLabel = "now";
            strip.setPixelColor(21, 255, 255, 255);
            //set light for now button
        }
        else if (digitalRead(twoHourButton))
        {
            timeMode = "twohour";
            timeModeLabel = "2 hours later";
            strip.setPixelColor(22, 255, 255, 255);
            //set light for two hour button
        }
        else if (digitalRead(sevenHourButton))
        {
            timeMode = "sevenhour";
            timeModeLabel = "7 hours later";
            strip.setPixelColor(23, 255, 255, 255);
            //set light for seven hour button
        }
        else if (digitalRead(nextDayButton))
        {
            timeMode = "tomorrow";
            timeModeLabel = "the next day";
            strip.setPixelColor(24, 255, 255, 255);
            //set light for tomorrow
        }
        strip.show();
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Getting data for ");
        lcd.setCursor(0, 1);
        lcd.print(timeModeLabel);
        lcd.blink();
        delay(1000);
        getData();
        lcd.noBlink();
        lcd.clear();
        renderInfo();
        last_update = millis();
    }
    else if (aButtonIsPressed() == false)
    {
        is_pressed = false;
    }
    if ((millis() - last_update) >= updateInterval)
    {
        getData();
        renderInfo();
        last_update = millis();
    }
    delay(20);
}
