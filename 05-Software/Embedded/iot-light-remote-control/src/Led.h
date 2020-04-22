/**
 * Class Led creates an interface for manipulating 
 * the status of a Led connected to given pin
 * @author Victor Tolentino
 */

#ifndef Led_h
#define Led_h
#define MAX_NUMBER_LEDS 8 // Max number of LEDS

class Led
{
public:
	Led();
	/**
	 * Custom contructor
	 * 
	 * @param _pin led pin number
	 * @param _brightness led brightness 0 - 100
	 * @param _state led on/off state
	 */
	Led(int pin, unsigned int brightness, bool on);

	/**
	 * Destructor 
	 */
	~Led();

	/**
	 * Set the state of a given pin
	 * 
	 * @param _pin led pin number
	 * @return void  
	 */
	void setPin(unsigned int _pin);

	/**
	 * Set the brightness of a led
	 * @param _brightness led brightness 0 - 100
	 * @return void
	 */
	void setBrightness(unsigned int _brightness);

	/**
	 * Set the led pin on/off state
	 * 
	 * @param _state led on/off state
	 * @return void
	 */
	void setState(bool _state);

	/**
	 * Get the pin number of a led
	 * 
	 * @return unsigned int
	 */
	unsigned int getPin();

	/**
	 * Get the brightness of a led
	 * 
	 * @return unsigned int
	 */
	unsigned int getBrightness();

	/**
	 * Get the on/off state of a led
	 * 
	 * @return bool
	 */
	bool getState();

private:
	/* Led pin number*/
	unsigned int pin;

	/* Led brightness 0 - 100*/
	unsigned int brightness;

	/* Led on/off state*/
	bool isOn;
};

class Leds
{
public:
	Leds();
	~Leds();
	void add(int pin, unsigned int brightness, bool on);
	int getQuantity();
	void setBrightness(int led, int brightness);
	void setState(int led, bool state);
	int getBrightness(int led);
	bool getState(int led);
	int findIndex(int led);
	Led devs[MAX_NUMBER_LEDS];

private:
	int quantity;
};

#endif