/**
 * Class HttpBuffer inherits from RingBuffer class 
 * and provides additional functions for
 * manipulating http requests and responses
 * @author Victor Tolentino
 */

#ifndef HttpBuffer_h
#define HttpBuffer_h
#include "libraries/RingBuffer.h"

class HttpBuffer : public RingBuffer
{
public:
	HttpBuffer(unsigned int size);
	~HttpBuffer();
	/**
	 * Checks if the buffer contains a
	 * given param and if it is found
	 * it is copied to the value buffer
	 * 
	 * @param str 
	 * @return void
	 */
	bool parseParam(const char *param, char *value);

private:
};

#endif